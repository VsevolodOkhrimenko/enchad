from rest_framework import serializers
from chat.users.api.serializers import PublicUserSerializer
from chat.messaging.models import Thread, Message


class ThreadSerializer(serializers.ModelSerializer):
    unread_count = serializers.\
        SerializerMethodField('_unread_count')
    public_key = serializers.\
        SerializerMethodField('_public_key')

    owner = PublicUserSerializer(many=False, read_only=True)
    opponent = PublicUserSerializer(many=False, read_only=True)

    def _unread_count(self, obj):
        return obj.messages.filter(
            read=False,
            public_key_owner=self.context['request'].user).exclude(
            sender=self.context['request'].user).count()

    def _public_key(self, obj):
        if self.context['request'].user.id == obj.owner.id:
            return obj.opponent_public_key
        return obj.owner_public_key

    class Meta:
        model = Thread
        fields = (
            'id',
            'owner',
            'opponent',
            'public_key',
            'owner_public_key',
            'unread_count',
        )
        extra_kwargs = {
            'owner_public_key': {'write_only': True},
        }


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = (
            'id',
            'thread',
            'sender',
            'text',
            'read',
            'created',
        )
