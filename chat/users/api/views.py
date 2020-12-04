from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet
from chat.users.models import account_activation_token
from chat.utils.helpers import generate_16_hash_code
from config.throttling import OncePerDayUserThrottle, TenPerMinuteUserThrottle
from .serializers import UserSerializer

User = get_user_model()


PASSSWOR_MIN_LEN = 8


class UserViewSet(RetrieveModelMixin,
                  ViewSet,
                  GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(id=self.request.user.id)

    def get_throttles(self):
        throttle_classes = []
        if self.action == 'change_password':
            throttle_classes = [TenPerMinuteUserThrottle]
        elif self.action == 'reset_lookup_id':
            throttle_classes = [OncePerDayUserThrottle]
        return [throttle() for throttle in throttle_classes]

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
    def register(self, request):
        if not request.user.is_anonymous:
            return Response({'detail': [
                'You can\'t create account while authentificated']},
                status=status.HTTP_401_UNAUTHORIZED)
        password = request.data['password']
        password2 = request.data['password2']
        email = request.data['email']
        username = request.data['username']
        if password != password2:
            return Response({
                'password': ['Passwords are not equal'],
                'password2': ['Passwords are not equal']},
                status=status.HTTP_400_BAD_REQUEST)
        if len(password) < PASSSWOR_MIN_LEN:
            return Response({
                'password': [
                    'Password minimum length: {} symbolsl'.format(
                        PASSSWOR_MIN_LEN)]},
                status=status.HTTP_400_BAD_REQUEST)
        serializer = self.serializer_class(
            data={'username': username, 'password': password, 'email': email})
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your EnChad account.'
            message = render_to_string('acc_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)).decode(),
                'token': account_activation_token.make_token(user),
            })
            to_email = email
            email_message = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email_message.send()
            return Response({
                'message': '''Please confirm your email address to complete
                              the registration'''})
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
