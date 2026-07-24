# Generated manually for leads sync fields

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("leads", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscriberreference",
            name="brevo_pending",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="contactinquiry",
            name="brevo_synced",
            field=models.BooleanField(default=False),
        ),
        migrations.AddIndex(
            model_name="subscriberreference",
            index=models.Index(
                fields=["brevo_pending", "newsletter"],
                name="leads_subsc_brevo_p_8a1c2d_idx",
            ),
        ),
    ]
