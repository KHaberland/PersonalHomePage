from django.contrib import admin

from .models import Calculator


@admin.register(Calculator)
class CalculatorAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}
