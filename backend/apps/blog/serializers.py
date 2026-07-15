from rest_framework import serializers

from .models import Author, Category, Post, PostImage, Tag


ALLOWED_LANGUAGES = {"en", "ru", "lv"}


def _language(context):
    lang = context.get("lang", "en")
    return lang if lang in ALLOWED_LANGUAGES else "en"


def _localized_translation(obj, field_name, lang, legacy_field_name):
    translations = list(obj.translations.all())
    selected = next((item for item in translations if item.language == lang), None)
    if selected is None and lang != "en":
        selected = next((item for item in translations if item.language == "en"), None)

    value = getattr(selected, field_name, "") if selected is not None else ""
    if isinstance(value, str) and value.strip():
        return value

    if lang != "en":
        english = next((item for item in translations if item.language == "en"), None)
        english_value = getattr(english, field_name, "") if english is not None else ""
        if isinstance(english_value, str) and english_value.strip():
            return english_value

    return getattr(obj, legacy_field_name, "")


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for Author."""

    name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ["id", "name", "bio", "photo"]

    def get_name(self, obj):
        return _localized_translation(obj, "name", _language(self.context), "name")

    def get_bio(self, obj):
        return _localized_translation(obj, "bio", _language(self.context), "bio")


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category with language-specific name."""

    class Meta:
        model = Category
        fields = ["id", "name_en", "name_ru", "name_lv", "slug"]


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag."""

    name = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]

    def get_name(self, obj):
        return _localized_translation(obj, "name", _language(self.context), "name")


class PostImageSerializer(serializers.ModelSerializer):
    """Serializer for PostImage."""

    image_url = serializers.SerializerMethodField()
    caption = serializers.SerializerMethodField()

    class Meta:
        model = PostImage
        fields = ["id", "image_url", "caption", "created_at"]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_caption(self, obj):
        return _localized_translation(
            obj, "caption", _language(self.context), "caption"
        )


class PostListSerializer(serializers.ModelSerializer):
    """Serializer for Post list (minimal fields)."""

    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "slug",
            "title",
            "excerpt",
            "author",
            "category",
            "tags",
            "cover_image",
            "published_at",
            "created_at",
        ]

    def get_title(self, obj):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"title_{lang}", obj.title_en) or obj.title_en

    def get_excerpt(self, obj):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"excerpt_{lang}", obj.excerpt_en) or obj.excerpt_en


class PostDetailSerializer(serializers.ModelSerializer):
    """Serializer for Post detail (full content)."""

    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = PostImageSerializer(many=True, read_only=True)
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "slug",
            "title",
            "content",
            "excerpt",
            "author",
            "category",
            "tags",
            "cover_image",
            "images",
            "status",
            "published_at",
            "created_at",
            "updated_at",
        ]

    def get_title(self, obj):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"title_{lang}", obj.title_en) or obj.title_en

    def get_content(self, obj):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"content_{lang}", obj.content_en) or obj.content_en

    def get_excerpt(self, obj):
        lang = self.context.get("lang", "en")
        return getattr(obj, f"excerpt_{lang}", obj.excerpt_en) or obj.excerpt_en
