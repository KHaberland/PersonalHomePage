from rest_framework import serializers

from .models import About, Book, Contact, Experience


class AboutSerializer(serializers.ModelSerializer):
    """Serializer for About with language-specific fields."""

    bio = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    qualifications = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = ["id", "bio", "education", "qualifications", "photo", "updated_at"]

    def _get_lang_field(self, obj, base_name):
        lang = self.context.get("lang", "en")
        en_val = getattr(obj, f"{base_name}_en", "") or ""
        if lang == "en":
            return en_val
        loc_val = getattr(obj, f"{base_name}_{lang}", "") or ""
        if lang == "ru" and base_name == "bio" and (not loc_val or not loc_val.strip()):
            return ""
        if loc_val.strip():
            return loc_val
        return en_val

    def get_bio(self, obj):
        return self._get_lang_field(obj, "bio")

    def get_education(self, obj):
        return self._get_lang_field(obj, "education")

    def get_qualifications(self, obj):
        return self._get_lang_field(obj, "qualifications")


class ExperienceSerializer(serializers.ModelSerializer):
    """Serializer for Experience with language-specific fields."""

    title = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            "id",
            "title",
            "company",
            "description",
            "start_year",
            "end_year",
            "order",
        ]

    def _get_lang_field(self, obj, base_name):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"{base_name}_{lang}", None) or getattr(
            obj, f"{base_name}_en", ""
        )

    def get_title(self, obj):
        return self._get_lang_field(obj, "title")

    def get_company(self, obj):
        return self._get_lang_field(obj, "company")

    def get_description(self, obj):
        return self._get_lang_field(obj, "description")


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book with language-specific fields."""

    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["id", "title", "description", "year", "cover_image", "updated_at"]

    def _get_lang_field(self, obj, base_name):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"{base_name}_{lang}", None) or getattr(
            obj, f"{base_name}_en", ""
        )

    def get_title(self, obj):
        return self._get_lang_field(obj, "title")

    def get_description(self, obj):
        return self._get_lang_field(obj, "description")


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact."""

    class Meta:
        model = Contact
        fields = ["id", "email", "linkedin_url", "youtube_url", "updated_at"]
