# Generated by Django 2.2.10 on 2020-11-26 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='user_salt',
            new_name='user_secret',
        ),
    ]