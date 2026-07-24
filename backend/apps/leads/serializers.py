from rest_framework import serializers


LOCALE_CHOICES = ("en", "ru", "lv")


class LeadTrackingSerializer(serializers.Serializer):
    locale = serializers.ChoiceField(choices=LOCALE_CHOICES)
    page_path = serializers.CharField(
        max_length=512, required=False, allow_blank=True, default=""
    )
    referrer = serializers.CharField(
        max_length=512, required=False, allow_blank=True, default=""
    )
    utm_source = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    utm_medium = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    utm_campaign = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    website = serializers.CharField(required=False, allow_blank=True, default="")


class SubscribeSerializer(LeadTrackingSerializer):
    email = serializers.EmailField(max_length=254)
    name = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    article_slug = serializers.SlugField(
        max_length=255, required=False, allow_blank=True, default=""
    )
    article_title = serializers.CharField(
        max_length=255, required=False, allow_blank=True, default=""
    )


class ArticleQuestionSerializer(LeadTrackingSerializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField(max_length=254)
    question = serializers.CharField(max_length=5000)
    article_slug = serializers.SlugField(max_length=255)
    article_title = serializers.CharField(max_length=255)
    subscribe_opt_in = serializers.BooleanField(required=False, default=False)


class ContactInquirySerializer(LeadTrackingSerializer):
    REQUEST_TYPE_CHOICES = (
        "defects",
        "process",
        "training",
        "cooperation",
        "commercial",
        "other",
    )

    name = serializers.CharField(max_length=255)
    email = serializers.EmailField(max_length=254)
    request_type = serializers.ChoiceField(choices=REQUEST_TYPE_CHOICES)
    message = serializers.CharField(max_length=5000)
