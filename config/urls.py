from django.conf import settings
from django.urls import include, path, re_path
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.views import defaults as default_views
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from chat.users.forms import AuthenticationFormWithCaptchaV3
from chat.users.views import obtain_expiring_auth_token, activate


admin.autodiscover()
admin.site.login_form = AuthenticationFormWithCaptchaV3


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    url(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        activate, name='activate')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# API URLS
urlpatterns += [
    # API base url
    path("api/", include("config.api_router")),
    # DRF auth token
    path("auth-token/", obtain_expiring_auth_token),
]

# Frontend urls

if settings.HAS_EMBDED_FRONTEND:
    urlpatterns += [
        re_path(r'^(?P<route>.*)$', ensure_csrf_cookie(
            TemplateView.as_view(template_name="index.html")), name='app'),
    ]

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
