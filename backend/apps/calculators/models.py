from django.db import models


class Calculator(models.Model):
    """Engineering calculator - welding tools."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    name_en = models.CharField(max_length=255, blank=True)
    name_ru = models.CharField(max_length=255, blank=True)
    name_lv = models.CharField(max_length=255, blank=True)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_lv = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "calculators_calculator"
        verbose_name = "Calculator"
        verbose_name_plural = "Calculators"
        ordering = ["created_at"]

    def __str__(self):
        return self.name_en or self.name
