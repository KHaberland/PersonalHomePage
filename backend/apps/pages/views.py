from django.http import Http404

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    About,
    Book,
    Contact,
    Experience,
    HomeBusinessOutcomeCard,
    HomeBusinessOutcomesIntro,
    HomeTechnicalSkillCard,
    HomeTechnicalSkillsIntro,
    SEOMetadata,
    SiteTextBlock,
)
from .serializers import (
    AboutSerializer,
    BookSerializer,
    ContactSerializer,
    ExperienceSerializer,
    HomeBusinessOutcomeCardSerializer,
    HomeTechnicalSkillCardSerializer,
    SEOMetadataSerializer,
    _localized_text,
)


class AboutView(generics.RetrieveAPIView):
    """GET /api/about - Get about page content (first record)."""

    serializer_class = AboutSerializer

    def get_object(self):
        obj = About.objects.first()
        if obj is None:
            raise Http404("About content not found")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class ExperienceListView(generics.ListAPIView):
    """GET /api/experience - List experience timeline."""

    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class BookView(generics.RetrieveAPIView):
    """GET /api/book - Get book page content (first record)."""

    serializer_class = BookSerializer

    def get_object(self):
        obj = Book.objects.first()
        if obj is None:
            raise Http404("Book content not found")
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["lang"] = self.request.query_params.get("lang", "en")
        return context


class ContactView(generics.RetrieveAPIView):
    """GET /api/contact - Get contact info (first record)."""

    serializer_class = ContactSerializer

    def get_object(self):
        obj = Contact.objects.first()
        if obj is None:
            raise Http404("Contact info not found")
        return obj


class PageContentView(APIView):
    """GET /api/content/page/{page}/ — CMS text grouped by page section."""

    allowed_languages = {"en", "ru", "lv"}

    def get(self, request, page):
        lang = request.query_params.get("lang", "en")
        if lang not in self.allowed_languages:
            lang = "en"

        content = {}
        blocks = SiteTextBlock.objects.filter(page=page).order_by("block", "key")

        for block in blocks:
            section = content.setdefault(block.block, {})
            section[block.key] = self._localized_text(block, lang)

        return Response(content)

    def _localized_text(self, block, lang):
        en_text = block.text_en or ""
        if lang == "en":
            return en_text

        localized_text = getattr(block, f"text_{lang}", "") or ""
        if localized_text.strip():
            return localized_text
        return en_text


class SEOMetadataView(generics.RetrieveAPIView):
    """GET /api/content/seo/{page}/ — localized SEO metadata."""

    serializer_class = SEOMetadataSerializer
    allowed_languages = {"en", "ru", "lv"}

    def get_object(self):
        lang = self.request.query_params.get("lang", "en")
        if lang not in self.allowed_languages:
            lang = "en"

        obj = SEOMetadata.objects.filter(
            page=self.kwargs["page"], language=lang
        ).first()
        if obj is None:
            raise Http404("SEO metadata not found")
        return obj


class HomeTechnicalSkillsView(APIView):
    """GET /api/home-technical-skills/ — блок «Технические навыки» на главной."""

    def get(self, request):
        lang = request.query_params.get("lang", "en")
        intro = HomeTechnicalSkillsIntro.objects.first()
        items = HomeTechnicalSkillCard.objects.order_by("order")
        ctx = {"lang": lang}
        lead = _localized_text(intro, "lead", lang) if intro else ""
        return Response(
            {
                "technical_lead": lead,
                "items": HomeTechnicalSkillCardSerializer(
                    items, many=True, context=ctx
                ).data,
            }
        )


class HomeBusinessOutcomesView(APIView):
    """GET /api/home-business-outcomes/ — блок «Business outcomes» на главной."""

    def get(self, request):
        lang = request.query_params.get("lang", "en")
        intro = HomeBusinessOutcomesIntro.objects.first()
        items = HomeBusinessOutcomeCard.objects.order_by("order")
        ctx = {"lang": lang}
        subtitle = _localized_text(intro, "subtitle", lang) if intro else ""
        lead = _localized_text(intro, "lead", lang) if intro else ""
        return Response(
            {
                "business_subtitle": subtitle,
                "business_lead": lead,
                "items": HomeBusinessOutcomeCardSerializer(
                    items, many=True, context=ctx
                ).data,
            }
        )
