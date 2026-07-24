from django.conf import settings
from rest_framework.throttling import SimpleRateThrottle

from .services import get_client_ip


class LeadsIPRateThrottle(SimpleRateThrottle):
    """Rate limit for public lead forms by client IP (see LEADS_RATE_LIMIT)."""

    scope = "leads"

    def get_rate(self):
        return settings.LEADS_RATE_LIMIT

    def get_cache_key(self, request, view):
        if request.method != "POST":
            return None
        ip = get_client_ip(request)
        if not ip:
            return None
        return self.cache_format % {"scope": self.scope, "ident": ip}
