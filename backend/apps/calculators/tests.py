from django.test import TestCase
from django.urls import reverse

from .models import Calculator


class CalculatorTranslationApiTests(TestCase):
    def test_tools_use_requested_language_with_english_fallback(self):
        Calculator.objects.all().delete()

        Calculator.objects.create(
            name="Heat Input Calculator",
            description="Legacy description",
            name_en="Heat Input Calculator",
            name_ru="Калькулятор тепловложения",
            description_en="Calculate heat input",
            description_ru="Расчёт тепловложения",
            slug="heat-input",
        )
        Calculator.objects.create(
            name="Gas Flow Calculator",
            description="Legacy gas description",
            name_en="Gas Flow Calculator",
            description_en="Calculate gas consumption",
            slug="gas-flow",
        )

        response = self.client.get(reverse("calculator-list"), {"lang": "ru"})

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(results[0]["name"], "Калькулятор тепловложения")
        self.assertEqual(results[0]["description"], "Расчёт тепловложения")
        self.assertEqual(results[1]["name"], "Gas Flow Calculator")
        self.assertEqual(results[1]["description"], "Calculate gas consumption")
