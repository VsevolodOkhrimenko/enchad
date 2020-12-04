import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import CIEmailField
from django.db.models import UUIDField, CharField
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import six
from chat.utils.helpers import generate_16_hash_code


class User(AbstractUser):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = CIEmailField(unique=True)
    user_secret = CharField(max_length=512)
    user_lookup_id = CharField(
      max_length=16,
      default=generate_16_hash_code,
      unique=True
    )


class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) +
            six.text_type(user.is_active)
        )


account_activation_token = TokenGenerator()
