from django.db import models


class Calculator(models.Model):
    """Engineering calculator - welding tools."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "calculators_calculator"
        verbose_name = "Calculator"
        verbose_name_plural = "Calculators"
        ordering = ["created_at"]

    def __str__(self):
        return self.name
