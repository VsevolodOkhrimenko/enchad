import uuid
from django.contrib.auth import get_user_model
from django.db.models import (Model, UUIDField, ForeignKey, OneToOneField,
                              TextField, BooleanField, DateTimeField, CASCADE)


User = get_user_model()


class Thread(Model):
    class Meta:
        ordering = ['-modified']

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = ForeignKey(
        User,
        verbose_name="Thread owner",
        related_name="self_threads",
        on_delete=CASCADE)
    owner_public_key = TextField(
        verbose_name="Owner public key",
        null=True,
        blank=True,
        max_length=4096)
    opponent = ForeignKey(
        User,
        verbose_name="Thread opponent",
        on_delete=CASCADE)
    opponent_public_key = TextField(
        verbose_name="Opponent public key",
        null=True,
        blank=True,
        max_length=4096)
    modified = DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id)


class Message(Model):
    class Meta:
        ordering = ['-created']

    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    thread = ForeignKey(Thread, related_name="messages", on_delete=CASCADE)
    alias = OneToOneField(
        "Message", null=True, related_name="related_message",
        on_delete=CASCADE)
    sender = ForeignKey(
        User, verbose_name="Author",
        related_name="messages", on_delete=CASCADE)
    public_key_owner = ForeignKey(
        User, verbose_name="Public Key Owner",
        related_name="messages_by_pb_key", on_delete=CASCADE)
    text = TextField(verbose_name="Message text", max_length=4096)
    read = BooleanField(verbose_name="Read", default=False)
    created = DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
