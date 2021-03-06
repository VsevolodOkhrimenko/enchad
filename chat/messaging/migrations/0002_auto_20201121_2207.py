# Generated by Django 2.2.10 on 2020-11-21 22:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('messaging', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='opponent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Thread opponent'),
        ),
        migrations.AddField(
            model_name='thread',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='self_threads', to=settings.AUTH_USER_MODEL, verbose_name='Thread owner'),
        ),
        migrations.AddField(
            model_name='message',
            name='alias',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='related_message', to='messaging.Message'),
        ),
        migrations.AddField(
            model_name='message',
            name='public_key_owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_by_pb_key', to=settings.AUTH_USER_MODEL, verbose_name='Public Key Owner'),
        ),
        migrations.AddField(
            model_name='message',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to=settings.AUTH_USER_MODEL, verbose_name='Author'),
        ),
        migrations.AddField(
            model_name='message',
            name='thread',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='messaging.Thread'),
        ),
    ]
