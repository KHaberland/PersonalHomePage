from django.contrib.admin.forms import AdminAuthenticationForm
from django.utils.translation import get_language


# Без GNU gettext (msgfmt) на Windows: строки по активному языку запроса
_USERNAME_LABEL = {
    "ru": "Имя пользователя или email",
    "lv": "Lietotājvārds vai e-pasts",
    "en": "Username or email",
}
_USERNAME_HELP = {
    "ru": "Введите имя пользователя или email, указанный в учётной записи.",
    "lv": "Izmantojiet lietotājvārdu vai šī konta e-pasta adresi.",
    "en": "Use your account username or the email address stored for this account.",
}


def _lang_for_form(request) -> str:
    """Язык подписи: Accept-Language (как у админки в браузере), затем gettext."""
    if request is not None:
        accept = request.META.get("HTTP_ACCEPT_LANGUAGE", "")
        for segment in accept.split(","):
            code = segment.split(";")[0].strip().lower()
            if code.startswith("ru"):
                return "ru"
            if code.startswith("lv"):
                return "lv"
    lang = (get_language() or "en").split("-")[0].lower()
    return lang if lang in _USERNAME_LABEL else "en"


class EmailOrUsernameAdminAuthenticationForm(AdminAuthenticationForm):
    """Первое поле принимает username или email (см. EmailOrUsernameModelBackend)."""

    def __init__(self, request=None, *args, **kwargs):
        super().__init__(request, *args, **kwargs)
        lang = _lang_for_form(request)
        self.fields["username"].label = _USERNAME_LABEL.get(lang, _USERNAME_LABEL["en"])
        self.fields["username"].help_text = _USERNAME_HELP.get(
            lang, _USERNAME_HELP["en"]
        )
        # Уменьшить подмену подписи браузером («Email» при autocomplete=username)
        self.fields["username"].widget.attrs.update(
            {
                "autocomplete": "off",
                "data-lpignore": "true",
            }
        )
