from rest_framework.serializers import ModelSerializer, SerializerMethodField
from chat.users.models import User
from chat.utils.encrypt import symmetric_decrypt


class UserSerializer(ModelSerializer):
    user_salt = SerializerMethodField('_user_salt', read_only=True)

    def _user_salt(self, obj):
        return symmetric_decrypt(obj.user_salt)

    class Meta:
        model = User
        fields = ["id", "username", "user_salt", "user_lookup_id"]


class PublicUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
