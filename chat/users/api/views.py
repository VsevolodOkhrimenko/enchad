from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import (RetrieveModelMixin, DestroyModelMixin)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from chat.utils.helpers import generate_16_hash_code
from .serializers import UserSerializer

User = get_user_model()


PASSSWOR_MIN_LEN = 8


class UserViewSet(RetrieveModelMixin, DestroyModelMixin,
                  GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(id=self.request.user.id)

    def destroy(self, request, pk=None):
        issuer = request.user
        password = request.data['password']
        if issuer.check_password(password):
            issuer.delete()
            return Response({
                'message': 'No content'}, status=status.HTTP_204_NO_CONTENT)
        return Response({
            'password': ['Incorrect password']},
            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["GET"])
    def me(self, request):
        serializer = self.serializer_class(
            request.user, context={"request": request})
        return Response(data=serializer.data)

    @action(detail=False, methods=["POST"])
    def reset_lookup_id(self, request):
        issuer = request.user
        issuer.user_lookup_id = generate_16_hash_code()
        issuer.save()
        serializer = self.serializer_class(
            issuer, context={"request": request})
        return Response(data=serializer.data)

    @action(detail=False, methods=["POST"])
    def change_password(self, request):
        issuer = request.user
        password = request.data['password']
        if issuer.check_password(password):
            new_password = request.data['new_password']
            new_password2 = request.data['new_password2']
            if new_password != new_password2:
                return Response({
                    'new_password': ['Passwords are not equal'],
                    'new_password2': ['Passwords are not equal']},
                    status=status.HTTP_400_BAD_REQUEST)
            if len(new_password) < PASSSWOR_MIN_LEN:
                return Response({
                    'new_password': [
                        'Password minimum length: {} symbolsl'.format(
                            PASSSWOR_MIN_LEN)]},
                    status=status.HTTP_400_BAD_REQUEST)
            issuer.set_password(new_password)
            issuer.save()
            return Response({
                'message': 'Password successfully changed'})
        return Response({
            'password': ['Incorrect password']},
            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["POST"])
    def change_username(self, request):
        issuer = request.user
        password = request.data['password']
        if issuer.check_password(password):
            username = request.data['username']
            if User.objects.filter(username__iexact=username).exists():
                return Response({
                            'username': ['This username already taken']},
                            status=status.HTTP_400_BAD_REQUEST)
            issuer.username = username
            issuer.save()
            return Response({
                'message': 'Username successfully changed'})
        return Response({
            'password': ['Incorrect password']},
            status=status.HTTP_400_BAD_REQUEST)
