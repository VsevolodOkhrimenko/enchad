from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chat.messaging.consumers import MessagingConsumer
from config.token_auth import TokenAuthMiddlewareStack


application = ProtocolTypeRouter({
  "websocket": AllowedHostsOriginValidator(
        TokenAuthMiddlewareStack(
            URLRouter([
                url(r"^messaging/$", MessagingConsumer),
            ])
        ),
    ),
})
