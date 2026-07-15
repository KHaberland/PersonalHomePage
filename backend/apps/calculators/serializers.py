from rest_framework import serializers

from .models import Calculator


ALLOWED_LANGUAGES = {"en", "ru", "lv"}


def _language(context):
    lang = context.get("lang", "en")
    return lang if lang in ALLOWED_LANGUAGES else "en"


def _localized_field(obj, field_name, lang):
    legacy_value = getattr(obj, field_name, "")
    localized_value = getattr(obj, f"{field_name}_{lang}", "") or ""
    if localized_value.strip():
        return localized_value

    english_value = getattr(obj, f"{field_name}_en", "") or ""
    if english_value.strip():
        return english_value

    return legacy_value


class CalculatorSerializer(serializers.ModelSerializer):
    """Serializer for Calculator list (GET /api/tools)."""

    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Calculator
        fields = ["id", "name", "description", "slug", "created_at"]

    def get_name(self, obj):
        return _localized_field(obj, "name", _language(self.context))

    def get_description(self, obj):
        return _localized_field(obj, "description", _language(self.context))
