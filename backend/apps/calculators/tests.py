from django.test import TestCase
from django.urls import reverse

from .models import Calculator
from .shielding_gas_catalog import REQUIRED_TOP_LEVEL_KEYS, get_shielding_gas_catalog


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


class ShieldingGasCatalogApiTests(TestCase):
    def test_catalog_has_required_structure(self):
        catalog = get_shielding_gas_catalog("en")

        for key in REQUIRED_TOP_LEVEL_KEYS:
            self.assertIn(key, catalog)

        self.assertEqual(len(catalog["materials"]), 3)
        self.assertIn("fe-steel", catalog["materials"])
        self.assertIn("cr-ni-steel", catalog["materials"])
        self.assertIn("al-alloys", catalog["materials"])
        self.assertIn("ferroline", catalog["criteriaGroups"])
        self.assertIn("ferroline-c6x1", catalog["gasCriteriaScores"])

    def test_catalog_localizes_for_en_ru_lv(self):
        en = self.client.get(reverse("shielding-gas-catalog"), {"lang": "en"}).json()
        ru = self.client.get(reverse("shielding-gas-catalog"), {"lang": "ru"}).json()
        lv = self.client.get(reverse("shielding-gas-catalog"), {"lang": "lv"}).json()

        self.assertIn("stainless", en["rootProtectionWarning"].lower())
        self.assertIn("TIG", ru["rootProtectionWarning"])
        self.assertIn("TIG", lv["rootProtectionWarning"])
        self.assertNotEqual(en["rootProtectionWarning"], ru["rootProtectionWarning"])

        ar_name_en = en["gases"]["fe-steel"]["TIG"]["thin"][0]["name"]
        ar_name_ru = ru["gases"]["fe-steel"]["TIG"]["thin"][0]["name"]
        ar_name_lv = lv["gases"]["fe-steel"]["TIG"]["thin"][0]["name"]

        self.assertEqual(ar_name_en, "welding Ar")
        self.assertEqual(ar_name_ru, "сварочный Ar")
        self.assertEqual(ar_name_lv, "metināšanas Ar")

    def test_catalog_falls_back_to_english_for_unknown_lang(self):
        response = self.client.get(reverse("shielding-gas-catalog"), {"lang": "de"})
        fallback = self.client.get(reverse("shielding-gas-catalog"), {"lang": "en"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), fallback.json())

    def test_catalog_includes_gas_properties_and_criteria_scores(self):
        catalog = get_shielding_gas_catalog("en")
        gas_id = "ferroline-c6x1"

        self.assertIn(gas_id, catalog["gasProperties"])
        self.assertIn("isoStandard", catalog["gasProperties"][gas_id])
        self.assertIn("application", catalog["gasProperties"][gas_id])
        self.assertIn(gas_id, catalog["gasCriteriaScores"])
        self.assertIn("penetrationLevel", catalog["gasCriteriaScores"][gas_id])

    def test_mvp_scenario_gases_are_available(self):
        catalog = get_shielding_gas_catalog("en")
        thin_mag_gases = catalog["gases"]["fe-steel"]["MAG"]["thin"]
        gas_ids = {gas["id"] for gas in thin_mag_gases}

        self.assertEqual(gas_ids, {"ferroline-c6x1", "ferroline-c8"})

    def test_shielding_gas_calculator_metadata_describes_mix_selection(self):
        en = self.client.get(reverse("calculator-list"), {"lang": "en"}).json()
        ru = self.client.get(reverse("calculator-list"), {"lang": "ru"}).json()
        lv = self.client.get(reverse("calculator-list"), {"lang": "lv"}).json()

        shielding_en = next(
            item for item in en["results"] if item["slug"] == "shielding-gas"
        )
        shielding_ru = next(
            item for item in ru["results"] if item["slug"] == "shielding-gas"
        )
        shielding_lv = next(
            item for item in lv["results"] if item["slug"] == "shielding-gas"
        )

        self.assertIn("mixture", shielding_en["description"].lower())
        self.assertNotIn("flow", shielding_en["description"].lower())
        self.assertIn("смес", shielding_ru["description"].lower())
        self.assertNotIn("расход", shielding_ru["description"].lower())
        self.assertIn("maisījum", shielding_lv["description"].lower())
        self.assertNotIn("plūsmas", shielding_lv["description"].lower())

    def test_legacy_shielding_gas_calculate_endpoint_still_works(self):
        response = self.client.post(
            reverse("calculate-shielding-gas"),
            data={"wire_diameter_mm": 1.2, "material": "steel", "process": "MIG/MAG"},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("flow_rate_min", response.json())
