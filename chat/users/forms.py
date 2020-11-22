from captcha.fields import ReCaptchaField
from captcha.widgets import ReCaptchaV3
from django.conf import settings
from django.contrib.admin.forms import AdminAuthenticationForm
from django.contrib.auth import get_user_model, forms
from django.core.exceptions import ValidationError

User = get_user_model()


class UserChangeForm(forms.UserChangeForm):
    class Meta(forms.UserChangeForm.Meta):
        model = User


class UserCreationForm(forms.UserCreationForm):

    error_message = forms.UserCreationForm.error_messages.update(
        {"duplicate_username": "This username has already been taken."}
    )

    class Meta(forms.UserCreationForm.Meta):
        model = User

    def clean_username(self):
        username = self.cleaned_data["username"]

        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            return username

        raise ValidationError(self.error_messages["duplicate_username"])


class AuthenticationFormWithCaptchaV3(AdminAuthenticationForm):

    def __init__(self, *args, **kwargs):
        super(AuthenticationFormWithCaptchaV3, self).__init__(*args, **kwargs)
        if not getattr(settings, 'DEBUG', False):
            self.fields['captcha'] = ReCaptchaField(widget=ReCaptchaV3())
