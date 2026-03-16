from rest_framework import serializers

from .models import Calculator


class CalculatorSerializer(serializers.ModelSerializer):
    """Serializer for Calculator list (GET /api/tools)."""

    class Meta:
        model = Calculator
        fields = ["id", "name", "description", "slug", "created_at"]
