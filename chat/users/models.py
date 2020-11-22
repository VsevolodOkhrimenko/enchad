import uuid
from django.contrib.auth.models import AbstractUser
from django.db.models import UUIDField, CharField
from chat.utils.helpers import generate_16_hash_code


class User(AbstractUser):
    id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_salt = CharField(max_length=512)
    user_lookup_id = CharField(
      max_length=16,
      default=generate_16_hash_code,
      unique=True
    )
