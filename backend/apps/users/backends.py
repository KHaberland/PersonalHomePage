"""Вход по имени пользователя или по email (для админки и SessionAuthentication)."""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model


class EmailOrUsernameModelBackend(ModelBackend):
    """
    Если в первое поле введён email — ищем пользователя по email (без учёта регистра),
    иначе — по username (без учёта регистра).
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        if not username or password is None:
            return None
        username = username.strip()
        if not username:
            return None
        if "@" in username:
            user = User.objects.filter(email__iexact=username).first()
        else:
            user = User.objects.filter(username__iexact=username).first()
        if user is None:
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
