from django.contrib import admin, messages
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import (
    Author,
    AuthorTranslation,
    Category,
    Post,
    PostImage,
    PostImageTranslation,
    Tag,
    TagTranslation,
)
from apps.leads.services.newsletter import BrevoError, send_post_newsletter


class AuthorTranslationInline(admin.TabularInline):
    model = AuthorTranslation
    extra = 1


class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 1


class PostImageTranslationInline(admin.TabularInline):
    model = PostImageTranslation
    extra = 1


class TagTranslationInline(admin.TabularInline):
    model = TagTranslation
    extra = 1


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ["name", "photo"]
    search_fields = ["name", "translations__name", "translations__bio"]
    inlines = [AuthorTranslationInline]
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
    search_fields = ["name", "translations__name"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [TagTranslationInline]


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
    actions = ["send_newsletter_action"]
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

    @admin.action(description="Send newsletter (Brevo)")
    def send_newsletter_action(self, request, queryset):
        sent_total = 0
        for post in queryset:
            if post.status != Post.Status.PUBLISHED:
                self.message_user(
                    request,
                    f"Skipped {post.slug}: not published",
                    level=messages.WARNING,
                )
                continue
            try:
                results = send_post_newsletter(post)
            except (BrevoError, ValueError) as exc:
                self.message_user(
                    request,
                    f"Failed {post.slug}: {exc}",
                    level=messages.ERROR,
                )
                continue

            sent = [item for item in results if item.get("status") == "sent"]
            sent_total += len(sent)
            if sent:
                self.message_user(
                    request,
                    f"{post.slug}: sent {', '.join(item['locale'] for item in sent)}",
                    level=messages.SUCCESS,
                )
            else:
                self.message_user(
                    request,
                    f"{post.slug}: nothing sent (already sent or no locale content)",
                    level=messages.WARNING,
                )

        if sent_total:
            self.message_user(
                request,
                f"Newsletter campaigns sent: {sent_total}",
                level=messages.SUCCESS,
            )


@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ["post", "caption", "created_at"]
    search_fields = ["post__slug", "caption", "translations__caption"]
    inlines = [PostImageTranslationInline]
