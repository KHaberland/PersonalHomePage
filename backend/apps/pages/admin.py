from django.contrib import admin
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import About, Book, Contact, Experience


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
