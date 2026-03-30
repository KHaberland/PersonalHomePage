from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"
    verbose_name = "Users"

    def ready(self) -> None:
        # Подпись поля входа в /admin/: не «Email», а явно «логин или email»
        from django.contrib import admin

        from .admin_forms import EmailOrUsernameAdminAuthenticationForm

        admin.site.login_form = EmailOrUsernameAdminAuthenticationForm
