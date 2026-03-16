from django.contrib import admin
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import Author, Category, Post, PostImage, Tag


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "photo"]
    search_fields = ["name"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name_en", "name_ru", "name_lv", "slug"]
    list_editable = ["name_ru", "name_lv"]
    search_fields = ["name_en", "name_ru", "name_lv"]
    prepopulated_fields = {"slug": ("name_en",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        "title_en",
        "author",
        "category",
        "status",
        "published_at",
        "created_at",
    ]
    list_filter = ["status", "category", "author"]
    search_fields = ["title_en", "title_ru", "title_lv", "content_en", "excerpt_en"]
    prepopulated_fields = {"slug": ("title_en",)}
    inlines = [PostImageInline]
    date_hierarchy = "published_at"
    list_editable = ["status"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "slug",
                    "author",
                    "category",
                    "tags",
                    "status",
                    "published_at",
                    "cover_image",
                )
            },
        ),
        ("English", {"fields": ("title_en", "content_en", "excerpt_en")}),
        ("Русский", {"fields": ("title_ru", "content_ru", "excerpt_ru")}),
        ("Latviešu", {"fields": ("title_lv", "content_lv", "excerpt_lv")}),
    )
