from django.contrib.auth import get_user_model
from chat.utils.helpers import generate_56_hash_code
from django.db.models.signals import post_save
from chat.utils.encrypt import symmetric_encrypt


User = get_user_model()


def user_created(sender, instance, created, **kwargs):
    if created:
        random_hash = generate_56_hash_code()
        instance.user_salt = symmetric_encrypt(random_hash)
        instance.save()


post_save.connect(user_created, sender=User)
