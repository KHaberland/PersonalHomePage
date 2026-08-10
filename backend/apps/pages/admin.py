from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.html import format_html
from django_ckeditor_5.widgets import CKEditor5Widget

from .cms_preview_registry import build_preview_url
from .models import (
    About,
    AboutMain,
    Book,
    BookPageImage,
    Contact,
    Experience,
    HomeBusinessOutcomeCard,
    HomeBusinessOutcomesIntro,
    HomeTechnicalSkillCard,
    HomeTechnicalSkillsIntro,
    SEOMetadata,
    SiteTextBlock,
    SolutionBullet,
    SolutionColumnGroup,
    SolutionSection,
    section_to_block_name,
)

DEPRECATED_SOLUTIONS_SECTION_BLOCK_PREFIX = "section_"


def exclude_deprecated_solutions_section_blocks(queryset):
    """Hide legacy SiteTextBlock rows superseded by SolutionSection models."""
    return queryset.exclude(
        page=SiteTextBlock.Page.SOLUTIONS,
        block__startswith=DEPRECATED_SOLUTIONS_SECTION_BLOCK_PREFIX,
    )


@admin.register(SiteTextBlock)
class SiteTextBlockAdmin(admin.ModelAdmin):
    list_display = [
        "page",
        "block",
        "key",
        "text_ru_preview",
        "preview_link",
        "updated_at",
    ]
    list_filter = ["page", "block"]
    search_fields = ["page", "block", "key", "text_en", "text_ru", "text_lv"]
    readonly_fields = ["updated_at", "preview_on_site"]
    ordering = ["page", "block", "key"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (None, {"fields": ("page", "block", "key", "preview_on_site", "updated_at")}),
        ("English", {"fields": ("text_en",)}),
        ("Русский", {"fields": ("text_ru",)}),
        ("Latviešu", {"fields": ("text_lv",)}),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return exclude_deprecated_solutions_section_blocks(queryset)

    def save_model(self, request, obj, form, change):
        if obj.page == SiteTextBlock.Page.SOLUTIONS and obj.block.startswith(
            DEPRECATED_SOLUTIONS_SECTION_BLOCK_PREFIX
        ):
            raise ValidationError(
                "Блоки solutions/section_* устарели. "
                "Редактируйте Solutions – секции / Solutions – колонки."
            )
        super().save_model(request, obj, form, change)

    @admin.display(description="RU")
    def text_ru_preview(self, obj):
        text = (obj.text_ru or "").strip()
        if not text:
            return "—"
        if len(text) <= 60:
            return text
        return f"{text[:60]}…"

    @admin.display(description="На сайте")
    def preview_link(self, obj):
        return self._format_preview_link(obj)

    @admin.display(description="На сайте")
    def preview_on_site(self, obj):
        return self._format_preview_link(obj)

    def _format_preview_link(self, obj):
        url = build_preview_url(obj.page, obj.block)
        if not url:
            return "—"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">На сайте ↗</a>',
            url,
        )


@admin.register(SEOMetadata)
class SEOMetadataAdmin(admin.ModelAdmin):
    list_display = ["page", "language", "title", "updated_at"]
    list_filter = ["page", "language"]
    search_fields = ["page", "language", "title", "description"]
    readonly_fields = ["updated_at"]
    ordering = ["page", "language"]
    fieldsets = (
        (None, {"fields": ("page", "language", "title", "description", "updated_at")}),
    )


@admin.register(AboutMain)
class AboutMainAdmin(admin.ModelAdmin):
    list_display = ["updated_at"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        ("English", {"fields": ("main_bio_en",)}),
        ("Русский", {"fields": ("main_bio_ru",)}),
        ("Latviešu", {"fields": ("main_bio_lv",)}),
    )

    def has_add_permission(self, request):
        return not AboutMain.objects.exists()


@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ["updated_at"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (None, {"fields": ("photo",)}),
        ("English", {"fields": ("bio_en", "education_en", "qualifications_en")}),
        ("Русский", {"fields": ("bio_ru", "education_ru", "qualifications_ru")}),
        ("Latviešu", {"fields": ("bio_lv", "education_lv", "qualifications_lv")}),
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["company_en", "title_en", "start_year", "end_year", "order"]
    list_filter = ["start_year"]
    search_fields = ["company_en", "title_en", "description_en"]
    list_editable = ["order"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (None, {"fields": ("start_year", "end_year", "order")}),
        ("English", {"fields": ("title_en", "company_en", "description_en")}),
        ("Русский", {"fields": ("title_ru", "company_ru", "description_ru")}),
        ("Latviešu", {"fields": ("title_lv", "company_lv", "description_lv")}),
    )


class BookPageImageInline(admin.TabularInline):
    model = BookPageImage
    extra = 1
    fields = ("image", "order", "alt_en", "alt_ru", "alt_lv", "is_active")
    ordering = ("order", "id")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title_en", "year", "updated_at"]
    search_fields = ["title_en", "description_en"]
    inlines = [BookPageImageInline]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (None, {"fields": ("year", "cover_image")}),
        ("English", {"fields": ("title_en", "description_en")}),
        ("Русский", {"fields": ("title_ru", "description_ru")}),
        ("Latviešu", {"fields": ("title_lv", "description_lv")}),
    )


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ["email", "linkedin_url", "youtube_url"]


@admin.register(HomeBusinessOutcomesIntro)
class HomeBusinessOutcomesIntroAdmin(admin.ModelAdmin):
    list_display = ["updated_at"]
    fieldsets = (
        ("English", {"fields": ("subtitle_en", "lead_en")}),
        ("Русский", {"fields": ("subtitle_ru", "lead_ru")}),
        ("Latviešu", {"fields": ("subtitle_lv", "lead_lv")}),
    )

    def has_add_permission(self, request):
        return not HomeBusinessOutcomesIntro.objects.exists()


@admin.register(HomeBusinessOutcomeCard)
class HomeBusinessOutcomeCardAdmin(admin.ModelAdmin):
    list_display = ["order", "title_en", "updated_at"]
    ordering = ["order"]
    search_fields = ["title_en", "title_ru", "description_en"]
    fieldsets = (
        (None, {"fields": ("order",)}),
        ("English", {"fields": ("title_en", "description_en")}),
        ("Русский", {"fields": ("title_ru", "description_ru")}),
        ("Latviešu", {"fields": ("title_lv", "description_lv")}),
    )


@admin.register(HomeTechnicalSkillsIntro)
class HomeTechnicalSkillsIntroAdmin(admin.ModelAdmin):
    list_display = ["updated_at"]
    fieldsets = (
        ("English", {"fields": ("lead_en",)}),
        ("Русский", {"fields": ("lead_ru",)}),
        ("Latviešu", {"fields": ("lead_lv",)}),
    )

    def has_add_permission(self, request):
        return not HomeTechnicalSkillsIntro.objects.exists()


@admin.register(HomeTechnicalSkillCard)
class HomeTechnicalSkillCardAdmin(admin.ModelAdmin):
    list_display = ["order", "title_en", "updated_at"]
    ordering = ["order"]
    search_fields = ["title_en", "title_ru", "description_en"]
    fieldsets = (
        (None, {"fields": ("order",)}),
        ("English", {"fields": ("title_en", "description_en")}),
        ("Русский", {"fields": ("title_ru", "description_ru")}),
        ("Latviešu", {"fields": ("title_lv", "description_lv")}),
    )


@admin.register(SolutionSection)
class SolutionSectionAdmin(admin.ModelAdmin):
    list_display = ["order", "item_key", "title_ru_preview", "updated_at"]
    ordering = ["order", "item_key"]
    search_fields = ["item_key", "title_en", "title_ru", "title_lv"]
    readonly_fields = ["item_key", "order", "updated_at", "preview_on_site"]
    fieldsets = (
        (None, {"fields": ("item_key", "order", "preview_on_site", "updated_at")}),
        ("English", {"fields": ("title_en",)}),
        ("Русский", {"fields": ("title_ru",)}),
        ("Latviešu", {"fields": ("title_lv",)}),
    )

    @admin.display(description="RU")
    def title_ru_preview(self, obj):
        text = (obj.title_ru or "").strip()
        if not text:
            return "—"
        if len(text) <= 60:
            return text
        return f"{text[:60]}…"

    @admin.display(description="На сайте")
    def preview_on_site(self, obj):
        url = build_preview_url("solutions", section_to_block_name(obj.item_key))
        if not url:
            return "—"
        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">На сайте ↗</a>',
            url,
        )

    def has_add_permission(self, request):
        return SolutionSection.objects.count() < 5


class SolutionBulletInline(admin.TabularInline):
    model = SolutionBullet
    extra = 1
    fields = ("order", "text_en", "text_ru", "text_lv")
    ordering = ("order", "id")


@admin.register(SolutionColumnGroup)
class SolutionColumnGroupAdmin(admin.ModelAdmin):
    list_display = ["section", "column", "bullet_count", "updated_at"]
    list_filter = ["section", "column"]
    search_fields = [
        "section__item_key",
        "section__title_ru",
        "section__title_en",
    ]
    readonly_fields = ["section", "column", "updated_at"]
    inlines = [SolutionBulletInline]

    @admin.display(description="Абзацев")
    def bullet_count(self, obj):
        return obj.bullets.count()

    def has_add_permission(self, request):
        return False

    def save_formset(self, request, form, formset, change):
        super().save_formset(request, form, formset, change)
        if formset.model is not SolutionBullet:
            return

        group = form.instance
        bullets = list(group.bullets.order_by("order", "id"))
        for index, bullet in enumerate(bullets, start=1):
            if bullet.order != index:
                bullet.order = index
                bullet.save(update_fields=["order"])
