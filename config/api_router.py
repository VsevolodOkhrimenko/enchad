from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf import settings
from chat.users.api.views import UserViewSet
from chat.messaging.api.views import ThreadViewSet, MessageViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("users", UserViewSet)
router.register("threads", ThreadViewSet, basename='Thread')
router.register("messages", MessageViewSet, basename='Message')


app_name = "api"
urlpatterns = router.urls
