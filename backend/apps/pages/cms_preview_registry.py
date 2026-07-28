"""Preview URL registry for Admin → Site navigation (SiteTextBlock)."""

from __future__ import annotations

import os
from typing import NamedTuple

DEFAULT_FRONTEND_BASE_URL = "http://localhost:3000"
DEFAULT_PREVIEW_LOCALE = "ru"


class PreviewRoute(NamedTuple):
    path: str
    anchor: str | None = None


# (page, block) → route. Source: admin_plan.md Appendix B (Phase 0).
PREVIEW_REGISTRY: dict[tuple[str, str], PreviewRoute] = {
    # home
    ("home", "hero"): PreviewRoute("/", "hero"),
    ("home", "about_teaser"): PreviewRoute("/", "problem-value"),
    ("home", "decision_system"): PreviewRoute("/", "decision-system"),
    ("home", "entry_paths"): PreviewRoute("/", "user-paths"),
    ("home", "proof"): PreviewRoute("/", "proof"),
    ("home", "contact_cta"): PreviewRoute("/", "contact"),
    # solutions
    ("solutions", "hero"): PreviewRoute("/solutions"),
    ("solutions", "validation"): PreviewRoute("/solutions"),
    ("solutions", "nav"): PreviewRoute("/solutions"),
    ("solutions", "labels"): PreviewRoute("/solutions"),
    ("solutions", "final_cta"): PreviewRoute("/solutions"),
    ("solutions", "section_defectReduction"): PreviewRoute(
        "/solutions", "solutions-defect-reduction"
    ),
    ("solutions", "section_processOptimization"): PreviewRoute(
        "/solutions", "solutions-process-optimization"
    ),
    ("solutions", "section_gasSelection"): PreviewRoute(
        "/solutions", "solutions-gas-selection"
    ),
    ("solutions", "section_training"): PreviewRoute("/solutions", "solutions-training"),
    ("solutions", "section_wpsSupport"): PreviewRoute(
        "/solutions", "solutions-wps-support"
    ),
    ("solutions", "nav_defectReduction"): PreviewRoute(
        "/solutions", "solutions-defect-reduction"
    ),
    ("solutions", "nav_processOptimization"): PreviewRoute(
        "/solutions", "solutions-process-optimization"
    ),
    ("solutions", "nav_gasSelection"): PreviewRoute(
        "/solutions", "solutions-gas-selection"
    ),
    ("solutions", "nav_training"): PreviewRoute("/solutions", "solutions-training"),
    ("solutions", "nav_wpsSupport"): PreviewRoute(
        "/solutions", "solutions-wps-support"
    ),
    # contact
    ("contact", "hero"): PreviewRoute("/contact"),
    ("contact", "form"): PreviewRoute("/contact"),
    ("contact", "request_types"): PreviewRoute("/contact"),
    ("contact", "contact_methods"): PreviewRoute("/contact"),
    ("contact", "empty"): PreviewRoute("/contact"),
    ("contact", "map"): PreviewRoute("/contact", "contact-map-heading"),
    # book
    ("book", "hero"): PreviewRoute("/book"),
    ("book", "authority"): PreviewRoute("/book"),
    ("book", "purchase"): PreviewRoute("/book"),
    ("book", "cta"): PreviewRoute("/book"),
    ("book", "cover"): PreviewRoute("/book"),
    ("book", "preview"): PreviewRoute("/book"),
    # experience
    ("experience", "ui"): PreviewRoute("/experience"),
    ("experience", "cases"): PreviewRoute("/experience", "cases"),
}

# Fallback when block is not in registry but page has a known frontend route.
PAGE_DEFAULT_PATH: dict[str, str] = {
    "home": "/",
    "about": "/about",
    "experience": "/experience",
    "expertise": "/expertise",
    "solutions": "/solutions",
    "knowledge": "/knowledge",
    "blog": "/blog",
    "tools": "/tools",
    "contact": "/contact",
    "book": "/book",
    "common": "/",
}


def get_preview_route(page: str, block: str) -> PreviewRoute | None:
    """Return path + optional anchor for a CMS block, or page-level fallback."""
    key = (page, block)
    if key in PREVIEW_REGISTRY:
        return PREVIEW_REGISTRY[key]

    default_path = PAGE_DEFAULT_PATH.get(page)
    if default_path is not None:
        return PreviewRoute(default_path)

    return None


def _frontend_base_url() -> str:
    return os.getenv("FRONTEND_BASE_URL", DEFAULT_FRONTEND_BASE_URL).rstrip("/")


def _preview_locale(locale: str | None) -> str:
    if locale:
        return locale
    return os.getenv("CMS_PREVIEW_LOCALE", DEFAULT_PREVIEW_LOCALE)


def build_preview_url(
    page: str, block: str, *, locale: str | None = None
) -> str | None:
    """Build absolute preview URL for Admin → Site, or None if unknown."""
    route = get_preview_route(page, block)
    if route is None:
        return None

    locale_segment = _preview_locale(locale)
    path = route.path if route.path != "/" else ""
    if path:
        url = f"{_frontend_base_url()}/{locale_segment}{path}"
    else:
        url = f"{_frontend_base_url()}/{locale_segment}/"

    if route.anchor:
        url = f"{url}#{route.anchor}"

    return url
