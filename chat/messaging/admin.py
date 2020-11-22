from django.contrib import admin
from .models import Thread


class ThreadAdmin(admin.ModelAdmin):
    fields = ('owner', 'opponent',)


admin.site.register(Thread, ThreadAdmin)
