from rest_framework import generics

from .filters import PostFilter
from .models import Category, Post, Tag
from .serializers import (
    CategorySerializer,
    PostDetailSerializer,
    PostListSerializer,
    TagSerializer,
)


class PostListView(generics.ListAPIView):
    """GET /api/posts - List published posts with filters and pagination."""

    serializer_class = PostListSerializer
    filterset_class = PostFilter

    def get_queryset(self):
        return (
            Post.objects.filter(status=Post.Status.PUBLISHED)
            .select_related("author", "category")
            .prefetch_related("tags")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class PostDetailView(generics.RetrieveAPIView):
    """GET /api/posts/{slug} - Get single post by slug."""

    serializer_class = PostDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return (
            Post.objects.filter(status=Post.Status.PUBLISHED)
            .select_related("author", "category")
            .prefetch_related("tags", "images")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class CategoryListView(generics.ListAPIView):
    """GET /api/categories - List all categories."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TagListView(generics.ListAPIView):
    """GET /api/tags - List all tags."""

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
