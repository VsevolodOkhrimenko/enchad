from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = "chat.users"
    verbose_name = "Users"

    def ready(self):
        try:
            import chat.users.signals  # noqa F401
        except ImportError:
            pass
