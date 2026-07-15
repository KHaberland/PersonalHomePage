from django.contrib import admin

from .models import Calculator


@admin.register(Calculator)
class CalculatorAdmin(admin.ModelAdmin):
    list_display = ["name_en", "name_ru", "name_lv", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name", "name_en", "name_ru", "name_lv", "description_en"]
    fieldsets = (
        (None, {"fields": ("slug", "name", "description", "created_at")}),
        ("English", {"fields": ("name_en", "description_en")}),
        ("Русский", {"fields": ("name_ru", "description_ru")}),
        ("Latviešu", {"fields": ("name_lv", "description_lv")}),
    )
    readonly_fields = ["created_at"]
