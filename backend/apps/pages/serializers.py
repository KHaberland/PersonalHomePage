from rest_framework import serializers

from .models import (
    About,
    AboutMain,
    Book,
    BookPageImage,
    Contact,
    Experience,
    HomeBusinessOutcomeCard,
    HomeTechnicalSkillCard,
    SEOMetadata,
)


class AboutSerializer(serializers.ModelSerializer):
    """Serializer for About with language-specific fields."""

    bio = serializers.SerializerMethodField()
    bio_main = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    qualifications = serializers.SerializerMethodField()

    class Meta:
        model = About
        fields = [
            "id",
            "bio",
            "bio_main",
            "education",
            "qualifications",
            "photo",
            "updated_at",
        ]

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

    def get_bio_main(self, obj):
        row = AboutMain.objects.first()
        if not row:
            return ""
        lang = self.context.get("lang", "en")
        en_val = row.main_bio_en or ""
        if lang == "en":
            return en_val
        loc_val = getattr(row, f"main_bio_{lang}", "") or ""
        if loc_val.strip():
            return loc_val
        return en_val

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


class BookPageImageSerializer(serializers.ModelSerializer):
    """Serializer for illustrative book page images."""

    image = serializers.SerializerMethodField()
    alt = serializers.SerializerMethodField()

    class Meta:
        model = BookPageImage
        fields = ["id", "image", "order", "alt"]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_alt(self, obj):
        lang = self.context.get("lang", "en")
        en_val = (obj.alt_en or "").strip()
        if lang == "en":
            return en_val
        loc_val = (getattr(obj, f"alt_{lang}", "") or "").strip()
        if loc_val:
            return loc_val
        return en_val


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book with language-specific fields."""

    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    pages = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "description",
            "year",
            "cover_image",
            "pages",
            "updated_at",
        ]

    def _get_lang_field(self, obj, base_name):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"{base_name}_{lang}", None) or getattr(
            obj, f"{base_name}_en", ""
        )

    def get_title(self, obj):
        return self._get_lang_field(obj, "title")

    def get_description(self, obj):
        return self._get_lang_field(obj, "description")

    def get_pages(self, obj):
        qs = obj.page_images.filter(is_active=True).order_by("order", "id")
        return BookPageImageSerializer(qs, many=True, context=self.context).data


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact."""

    class Meta:
        model = Contact
        fields = ["id", "email", "linkedin_url", "youtube_url", "updated_at"]


class SEOMetadataSerializer(serializers.ModelSerializer):
    """Serializer for localized SEO metadata."""

    class Meta:
        model = SEOMetadata
        fields = ["page", "language", "title", "description", "updated_at"]


def _localized_text(obj, base: str, lang: str) -> str:
    en_val = (getattr(obj, f"{base}_en", None) or "").strip()
    if lang == "en":
        return en_val
    loc_val = (getattr(obj, f"{base}_{lang}", None) or "").strip()
    if loc_val:
        return loc_val
    return en_val


class HomeTechnicalSkillCardSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = HomeTechnicalSkillCard
        fields = ["order", "title", "description"]

    def get_title(self, obj):
        lang = self.context.get("lang", "en")
        return _localized_text(obj, "title", lang)

    def get_description(self, obj):
        lang = self.context.get("lang", "en")
        return _localized_text(obj, "description", lang)


class HomeBusinessOutcomeCardSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = HomeBusinessOutcomeCard
        fields = ["order", "title", "description"]

    def get_title(self, obj):
        lang = self.context.get("lang", "en")
        return _localized_text(obj, "title", lang)

    def get_description(self, obj):
        lang = self.context.get("lang", "en")
        return _localized_text(obj, "description", lang)
