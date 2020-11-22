from django.apps import AppConfig


class MessagingConfig(AppConfig):
    name = 'chat.messaging'

    def ready(self):
        try:
            import chat.messaging.signals  # noqa F401
        except ImportError:
            pass
