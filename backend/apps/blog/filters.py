import django_filters

from .models import Post


class PostFilter(django_filters.FilterSet):
    """Filter for Post list API."""

    category = django_filters.NumberFilter(field_name="category_id")
    tag = django_filters.NumberFilter(field_name="tags__id")
    tag_slug = django_filters.CharFilter(field_name="tags__slug")
    category_slug = django_filters.CharFilter(field_name="category__slug")

    class Meta:
        model = Post
        fields = ["category", "tag", "category_slug", "tag_slug"]
