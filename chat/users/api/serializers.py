from rest_framework.serializers import ModelSerializer, SerializerMethodField
from chat.users.models import User
from chat.utils.encrypt import symmetric_decrypt


class UserSerializer(ModelSerializer):
    user_secret = SerializerMethodField('_user_secret', read_only=True)

    def _user_secret(self, obj):
        return symmetric_decrypt(obj.user_secret)

    class Meta:
        model = User
        fields = ["id", "username", "user_secret", "user_lookup_id"]


class PublicUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
