from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, pre_save
from chat.users.api.serializers import UserSerializer
from chat.messaging.api.serializers import MessageSerializer
from .models import Message, Thread


def message_created(sender, instance, created, **kwargs):
    if created and instance.sender.id != instance.public_key_owner.id:
        channel_layer = get_channel_layer()
        serializer = MessageSerializer(instance)
        data = serializer.data.copy()
        data['thread'] = str(data['thread'])
        data['sender'] = str(data['sender'])
        thread = instance.thread
        if thread.owner == instance.sender:
            recipient = thread.opponent
        else:
            recipient = thread.owner
        group_name = 'messages_{}'.format(recipient.id)
        group_send = async_to_sync(channel_layer.group_send)
        group_send(group_name, {
            'type': 'chat.message',
            'payload': data
        })


def thread_created(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        recipient = instance.opponent
        data = {
            'id': str(instance.id),
            'owner': UserSerializer(instance.owner).data,
            'opponent': UserSerializer(instance.opponent).data,
        }
        group_name = 'messages_{}'.format(recipient.id)
        group_send = async_to_sync(channel_layer.group_send)
        group_send(group_name, {
            'type': 'thread.create',
            'payload': data
        })


def thread_update(sender, instance, **kwargs):
    previous = Thread.objects.filter(id=instance.id).first()
    if previous:
        recipient = None
        public_key = None
        if instance.owner_public_key != previous.owner_public_key:
            recipient = instance.opponent
            public_key = instance.owner_public_key
        elif instance.opponent_public_key != previous.opponent_public_key:
            recipient = instance.owner
            public_key = instance.opponent_public_key
        if recipient:
            channel_layer = get_channel_layer()
            data = {
                'id': str(instance.id),
                'public_key': public_key
            }
            group_name = 'messages_{}'.format(recipient.id)
            group_send = async_to_sync(channel_layer.group_send)
            group_send(group_name, {
                'type': 'thread.update',
                'payload': data
            })


post_save.connect(message_created, sender=Message)
post_save.connect(thread_created, sender=Thread)
pre_save.connect(thread_update, sender=Thread)
