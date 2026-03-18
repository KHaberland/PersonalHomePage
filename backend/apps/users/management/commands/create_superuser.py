"""
Management command для создания суперпользователя (для CI/CD и скриптов).

Использование:
    python manage.py create_superuser
    python manage.py create_superuser --username admin --email x@x.com --password secret

Переменные окружения:
    DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD
"""

import os

from django.core.management.base import BaseCommand

from apps.users.models import User


class Command(BaseCommand):
    help = "Создаёт суперпользователя (если не существует)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--username", default=os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        )
        parser.add_argument(
            "--email", default=os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        )
        parser.add_argument(
            "--password", default=os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin")
        )

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        password = options["password"]

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists."))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created."))
