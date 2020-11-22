from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.admin import TokenAdmin

from chat.users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("user_lookup_id",)}),) + UserAdmin.fieldsets
    list_display = ["username", "is_superuser"]


class ExpiringTokenAdmin(TokenAdmin):
    fields = ('user', 'created',)
    readonly_fields = ('created',)


admin.site.unregister(Token)
admin.site.register(Token, ExpiringTokenAdmin)
