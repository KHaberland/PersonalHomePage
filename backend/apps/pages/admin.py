from django.contrib import admin
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import (
    About,
    AboutMain,
    Book,
    Contact,
    Experience,
    HomeBusinessOutcomeCard,
    HomeBusinessOutcomesIntro,
    HomeTechnicalSkillCard,
    HomeTechnicalSkillsIntro,
    SEOMetadata,
    SiteTextBlock,
)


@admin.register(SiteTextBlock)
class SiteTextBlockAdmin(admin.ModelAdmin):
    list_display = ["page", "block", "key", "updated_at"]
    list_filter = ["page", "block"]
    search_fields = ["page", "block", "key", "text_en", "text_ru", "text_lv"]
    readonly_fields = ["updated_at"]
    ordering = ["page", "block", "key"]
    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="extends")},
    }
    fieldsets = (
        (None, {"fields": ("page", "block", "key", "updated_at")}),
        ("English", {"fields": ("text_en",)}),
        ("Русский", {"fields": ("text_ru",)}),
        ("Latviešu", {"fields": ("text_lv",)}),
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


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ["title_en", "year", "updated_at"]
    search_fields = ["title_en", "description_en"]
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
