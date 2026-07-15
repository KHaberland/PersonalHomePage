"""Load and localize shielding gas catalog JSON fixture."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

SUPPORTED_LANGS = frozenset({"en", "ru", "lv"})
LOCALE_KEYS = frozenset({"en", "ru", "lv", "de", "lt", "et"})

CATALOG_PATH = Path(__file__).with_name("shielding_gas_catalog.json")

REQUIRED_TOP_LEVEL_KEYS = (
    "materials",
    "thicknessOptions",
    "gases",
    "rootProtectionGases",
    "gasProperties",
    "criteriaGroups",
    "gasCriteriaScores",
    "propertyLabels",
    "rootProtectionWarning",
)


def normalize_lang(lang: str | None) -> str:
    if lang in SUPPORTED_LANGS:
        return lang
    return "en"


@lru_cache(maxsize=1)
def load_raw_catalog() -> dict[str, Any]:
    with CATALOG_PATH.open(encoding="utf-8") as catalog_file:
        return json.load(catalog_file)


def _is_locale_map(value: dict[str, Any]) -> bool:
    return bool(set(value.keys()) & LOCALE_KEYS)


def _pick_localized(value: Any, lang: str) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, list):
        return [_pick_localized(item, lang) for item in value]
    if isinstance(value, dict):
        if _is_locale_map(value):
            for candidate in (lang, "en", "ru", "lv"):
                localized = value.get(candidate)
                if isinstance(localized, str) and localized.strip():
                    return localized
            for localized in value.values():
                if isinstance(localized, str) and localized.strip():
                    return localized
            return ""
        return {key: _pick_localized(item, lang) for key, item in value.items()}
    return value


def get_shielding_gas_catalog(lang: str | None = "en") -> dict[str, Any]:
    """Return catalog localized for the requested language (fallback: en)."""
    normalized_lang = normalize_lang(lang)
    raw_catalog = load_raw_catalog()
    return _pick_localized(raw_catalog, normalized_lang)
