from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from chat.utils.helpers import validate_uuid4_array
from chat.messaging.models import Thread, Message
from config.throttling import OncePerSecondUserThrottle
from .serializers import ThreadSerializer, MessageSerializer


User = get_user_model()


def send_read(message, ids):
    channel_layer = get_channel_layer()
    recipient = message.alias.public_key_owner
    group_name = 'messages_{}'.format(recipient.id)
    group_send = async_to_sync(channel_layer.group_send)
    data = {
        'messages': ids,
        'thread': str(message.thread.id)
    }
    group_send(group_name, {
        'type': 'chat.read',
        'payload': data
    })


class ThreadPagination(LimitOffsetPagination):
    default_limit = 30
    max_limit = 30
    template = None

    def get_paginated_response(self, data, unread_count):
        return Response({
            'next': self.get_next_link(),
            'results': data,
            'unread_count': unread_count
        })


class ThreadViewSet(viewsets.ViewSet,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    serializer_class = ThreadSerializer
    pagination_class = ThreadPagination
    permission_classes = (IsAuthenticated,)

    def get_throttles(self):
        throttle_classes = []
        if self.action == 'create' or self.action == 'list':
            throttle_classes = [OncePerSecondUserThrottle]
        return [throttle() for throttle in throttle_classes]

    def get_queryset(self):
        return Thread.objects.filter(
            Q(owner=self.request.user) | Q(opponent=self.request.user)).\
            select_related('owner', 'opponent')

    def get_paginated_response(self, data):
        assert self.paginator is not None
        unread_count = Message.objects.filter(
            read=False,
            public_key_owner=self.request.user).exclude(
                sender=self.request.user).count()
        return self.paginator.get_paginated_response(data, unread_count)

    def retrieve(self, request, pk=None):
        try:
            thread = self.get_queryset().get(id=pk)
        except Thread.DoesNotExist:
            return Response({
                'detail': 'Thread not found',
            }, status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(
            thread,
            context={'request': request})
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        issuer = request.user
        thread_id = pk
        try:
            thread = self.get_queryset().get(id=thread_id)
        except Thread.DoesNotExist:
            return Response({
                'detail': 'Thread not found',
            }, status=status.HTTP_404_NOT_FOUND)
        if thread.owner == issuer or thread.opponent == issuer:
            thread.delete()
            return Response({'status': 'ok'})
        return Response(
                {'detail': 'User is not owner of this thread'},
                status=status.HTTP_403_FORBIDDEN)

    def update(self, request, pk=None):
        return Response(
                {'detail': 'Method PUT is not allowed on this endpoint'},
                status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def partial_update(self, request, pk=None):
        issuer = request.user
        thread_id = pk
        try:
            thread = self.get_queryset().get(id=thread_id)
        except Thread.DoesNotExist:
            return Response({
                'detail': 'Thread not found',
            }, status=status.HTTP_404_NOT_FOUND)
        if thread.owner == issuer:
            owner_public_key = str(
                request.data.get('public_key', None))
            thread.owner_public_key = owner_public_key
            thread = thread.save()
            serializer = self.serializer_class(
                instance=thread,
                context={'request': request})
            return Response(serializer.data)
        elif thread.opponent == issuer:
            opponent_public_key = str(
                request.data.get('public_key', None))
            thread.opponent_public_key = opponent_public_key
            thread = thread.save()
            serializer = self.serializer_class(
                thread,
                context={'request': request})
            return Response(serializer.data)
        return Response(
                {'detail': 'User is not owner of this thread'},
                status=status.HTTP_403_FORBIDDEN)

    def create(self, request):
        owner = request.user
        user_lookup_id = str(
            request.data.get('opponent'))
        try:
            opponent = User.objects.get(
                user_lookup_id=user_lookup_id)
        except User.DoesNotExist:
            return Response({
                'detail': 'User not found',
            }, status=status.HTTP_404_NOT_FOUND)
        created_thread = Thread.objects.filter(
            Q(owner=owner, opponent=opponent) | Q(
                owner=opponent, opponent=owner)).first()
        if created_thread:
            return Response({
                'id': created_thread.id,
            }, status=status.HTTP_302_FOUND)
        owner_public_key = str(
            request.data.get('owner_public_key', None))
        serializer = self.serializer_class(
            data={'owner_public_key': owner_public_key},
            context={'request': request})
        if serializer.is_valid():
            serializer.save(
                owner=owner,
                opponent=opponent,
                owner_public_key=owner_public_key)
            return Response(serializer.data)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["POST"])
    def mark_as_read_array(self, request, pk=None):
        issuer = request.user
        messages_ids = request.data.get('messages')
        if not validate_uuid4_array(messages_ids):
            return Response({'detail': 'Some of ids are not UUID instances'},
                            status=status.HTTP_400_BAD_REQUEST)
        to_update = Message.objects.filter(
            ~Q(sender=issuer),
            id__in=messages_ids, thread__id=pk,
            public_key_owner=issuer,
            read=False).select_related('alias__sender', 'alias__thread')
        to_send = []
        for message in to_update:
            if message.alias:
                message.alias.read = True
                message.alias.save()
                message_id = message.alias.id
                to_send.append(str(message_id))
        first_of_update = to_update.first()
        if first_of_update:
            send_read(first_of_update, to_send)
        to_update.update(read=True)
        return Response({'status': 'ok'})


class MessagePagination(LimitOffsetPagination):
    default_limit = 30
    max_limit = 30
    template = None

    def paginate_queryset(self, queryset, request, view=None):
        to_update = queryset.filter(read=False).exclude(
            sender=request.user)
        to_send = []
        for message in to_update:
            if message.alias:
                message.alias.read = True
                message.alias.save()
                message_id = message.alias.id
                to_send.append(str(message_id))
        first_of_update = to_update.first()
        if first_of_update:
            send_read(first_of_update, to_send)
        to_update.update(read=True)
        return super(MessagePagination, self).paginate_queryset(
            queryset, request, view)

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'results': data
        })


class MessageViewSet(viewsets.ViewSet,
                     viewsets.GenericViewSet):
    serializer_class = MessageSerializer
    pagination_class = MessagePagination
    permission_classes = (IsAuthenticated,)
    queryset = Message.objects.none()

    def get_throttles(self):
        throttle_classes = []
        if self.action == 'create' or self.action == 'list':
            throttle_classes = [OncePerSecondUserThrottle]
        return [throttle() for throttle in throttle_classes]

    def list(self, request):
        thread_id = request.GET.get('thread_id', None)
        issuer = request.user
        thread = get_object_or_404(
            Thread.objects,
            Q(owner=issuer) | Q(opponent=issuer), pk=thread_id)
        messages = Message.objects.filter(
            thread=thread, public_key_owner=issuer)
        page = self.paginate_queryset(messages)
        page.reverse()
        serializer = self.get_serializer(
            page, many=True,
            context={'request': request})
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        issuer = request.user
        message_id = pk
        try:
            message = Message.objects.select_related(
                'thread__opponent', 'thread__owner').get(
                id=message_id, public_key_owner=issuer, sender=issuer)
        except Message.DoesNotExist:
            return Response({
                'detail': 'Thread not found',
            }, status=status.HTTP_404_NOT_FOUND)
        if message.thread.owner == issuer or message.thread.opponent == issuer:
            message.delete()
            return Response({'status': 'ok'})
        return Response(
                {'detail': 'User is not owner of this message'},
                status=status.HTTP_403_FORBIDDEN)

    @action(detail=True, methods=["POST"])
    def mark_as_read_by_id(self, request, pk=None):
        issuer = request.user
        message_query = Message.objects.filter(pk=pk).select_related(
                'alias__thread', 'alias__sender', 'thread__owner',
                'thread__opponent')
        message = message_query.first()
        if message.thread.owner == issuer or message.thread.opponent == issuer:
            message_query.update(read=True)
            if message.alias:
                message.alias.read = True
                message.alias.save()
                message_id = message.alias.id
                data = [str(message_id)]
                send_read(message.alias, data)
        return Response({'message': message.pk})

    def create(self, request):
        thread_id = request.data.get('threadID')
        issuer = request.user
        data = request.data.copy()
        self_encrypted = data['self_encrypted']
        target_encrypted = data['target_encrypted']
        thread = get_object_or_404(
            Thread.objects.select_related('owner', 'opponent'),
            Q(owner=issuer) | Q(opponent=issuer), pk=thread_id)
        self_encrypted['thread'] = thread.id
        target_encrypted['thread'] = thread.id
        self_encrypted['sender'] = str(issuer.id)
        target_encrypted['sender'] = str(issuer.id)
        serializer_self = self.serializer_class(data=self_encrypted)
        serializer_target = self.serializer_class(data=target_encrypted)
        if serializer_self.is_valid() and serializer_target.is_valid():
            message = serializer_self.save(public_key_owner=issuer)
            target_message = None
            if thread.owner.id == issuer.id:
                target_message = serializer_target.save(
                    public_key_owner=thread.opponent, alias=message)
            else:
                target_message = serializer_target.save(
                    public_key_owner=thread.owner, alias=message)
            message.alias = target_message
            message.save()
            thread.modified = timezone.now()
            thread.save()
            response = Response(self.serializer_class(message).data)
        else:
            response = Response(serializer_target.errors,
                                status=status.HTTP_400_BAD_REQUEST)
        return response
