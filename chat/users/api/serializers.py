from rest_framework.serializers import ModelSerializer, SerializerMethodField
from chat.users.models import User
from chat.utils.encrypt import symmetric_decrypt


class UserSerializer(ModelSerializer):
    user_secret = SerializerMethodField("_user_secret", read_only=True)

    def _user_secret(self, obj):
        return symmetric_decrypt(obj.user_secret)

    def create(self, validated_data):

        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = [
          "id",
          "username",
          "user_secret",
          "user_lookup_id",
          "password",
          "email"
        ]
        write_only_fields = ["password", "email"]
        read_only_fields = ["id", "user_secret", "user_lookup_id"]


class PublicUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
        read_only_fields = ["id", "username"]
