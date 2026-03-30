"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.users.admin_forms import EmailOrUsernameAdminAuthenticationForm

# Надёжнее, чем только AppConfig.ready(): форма входа в /admin/
admin.site.login_form = EmailOrUsernameAdminAuthenticationForm

urlpatterns = [
    path("admin/", admin.site.urls),
    path("ckeditor5/", include("django_ckeditor_5.urls")),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.blog.urls")),
    path("api/", include("apps.pages.urls")),
    path("api/", include("apps.calculators.urls")),
    path("api/", include("apps.media.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
