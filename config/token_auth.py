from channels.auth import AuthMiddlewareStack
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import APIException
from rest_framework.authtoken.models import Token


class UnauthorizedException(APIException):
    """
    Enforce to return 401 Response code to handle authentification
    on frontend
    """

    status_code = 401
    default_detail = 'Token authentication failed'
    default_code = 'unauthorized'


class TokenAuthMiddleware:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = dict(scope['headers'])
        if b'sec-websocket-protocol' in headers:
            try:
                token_name, token_key = headers[
                    b'sec-websocket-protocol'].decode().split(', ')
                if token_name == 'Token':
                    token = Token.objects.select_related('user').get(
                        key=token_key)
                    scope['user'] = token.user
                else:
                    raise UnauthorizedException('Token is not passed properly')
            except Token.DoesNotExist:
                raise UnauthorizedException('Invalid token')
            if not token.user.is_active:
                raise UnauthorizedException('User inactive or deleted')
        return self.inner(scope)


def TokenAuthMiddlewareStack(inner):
    return TokenAuthMiddleware(AuthMiddlewareStack(inner))


class CustomTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.select_related('user').get(key=key)
        except Token.DoesNotExist:
            raise UnauthorizedException('Invalid token')
        if not token.user.is_active:
            raise UnauthorizedException('User inactive or deleted')
        return token.user, token
