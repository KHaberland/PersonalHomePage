# Generated data migration - initial author and first blog posts

from datetime import datetime

from django.db import migrations
from django.utils import timezone


def create_author_and_posts(apps, schema_editor):
    Author = apps.get_model("blog", "Author")
    Category = apps.get_model("blog", "Category")
    Post = apps.get_model("blog", "Post")
    Tag = apps.get_model("blog", "Tag")

    # Author
    author, _ = Author.objects.get_or_create(
        name="Oleg Suvorov",
        defaults={
            "bio": "Welding engineer with extensive experience in MIG/MAG, TIG, and MMA. Expert in shielding gases. Author of MAG/MIG welding book.",
        },
    )

    # Get categories
    cat_welding = Category.objects.filter(slug="welding-technology").first()
    cat_gases = Category.objects.filter(slug="shielding-gases").first()
    cat_equipment = Category.objects.filter(slug="welding-equipment").first()

    # Create posts if none exist
    if Post.objects.filter(author=author).exists():
        return

    posts_data = [
        {
            "slug": "shielding-gas-selection-mig-mag",
            "category": cat_gases,
            "title_en": "Shielding gases for MIG/MAG welding: selection guide",
            "title_ru": "Защитные газы для MIG/MAG сварки: руководство по выбору",
            "title_lv": "Aizsarggāzes MIG/MAG metināšanai: izvēles rokasgrāmata",
            "excerpt_en": "How to choose the right shielding gas for your welding application. CO2, argon mixtures, and their characteristics.",
            "excerpt_ru": "Как выбрать правильный защитный газ для вашей сварки. CO2, аргоновые смеси и их характеристики.",
            "excerpt_lv": "Kā izvēlēties pareizo aizsarggāzi metināšanai. CO2, argona maisījumi un to īpašības.",
            "content_en": """<p>Choosing the right shielding gas is crucial for MIG/MAG welding quality. The selection depends on the base material, welding position, and desired weld properties.</p>
<p><strong>Pure CO2</strong> offers deep penetration and is cost-effective for thick steel. However, it produces more spatter and a rougher bead surface.</p>
<p><strong>Argon-CO2 mixtures</strong> (e.g., 82% Ar / 18% CO2) provide a smoother arc, less spatter, and better appearance. Suitable for thin steel and sheet metal.</p>
<p><strong>Argon-oxygen mixtures</strong> are used for stainless steel and certain applications requiring specific oxidation control.</p>
<p>Contact a welding expert for personalized recommendations based on your specific requirements.</p>""",
            "content_ru": """<p>Выбор правильного защитного газа критичен для качества MIG/MAG сварки. Выбор зависит от основного материала, положения сварки и желаемых свойств шва.</p>
<p><strong>Чистый CO2</strong> обеспечивает глубокую проплавку и экономичен для толстой стали. Однако даёт больше брызг и более грубую поверхность шва.</p>
<p><strong>Смеси аргон-CO2</strong> (например, 82% Ar / 18% CO2) дают более стабильную дугу, меньше брызг и лучший внешний вид. Подходят для тонкой стали и листового металла.</p>
<p><strong>Смеси аргон-кислород</strong> применяются для нержавеющей стали и при необходимости контроля окисления.</p>
<p>Обратитесь к эксперту по сварке для персональных рекомендаций.</p>""",
            "content_lv": """<p>Pareizas aizsarggāzes izvēle ir kritiska MIG/MAG metināšanas kvalitātei. Izvēle ir atkarīga no pamatmateriāla, metināšanas stāvokļa un vēlamajām metinājuma īpašībām.</p>
<p><strong>Tīrs CO2</strong> nodrošina dziļu iespiešanos un ir ekonomisks biezai tēraudam. Tomēr rada vairāk izšļakstīšanās un raupjāku vītnes virsmu.</p>
<p><strong>Argona-CO2 maisījumi</strong> (piemēram, 82% Ar / 18% CO2) nodrošina vienmērīgāku loku, mazāk izšļakstīšanās un labāku izskatu. Piemēroti plānai tēraudam. </p>
<p>Sazinieties ar metināšanas ekspertu personīgām rekomendācijām.</p>""",
            "tags": ["shielding-gas", "mig-mag", "welding"],
        },
        {
            "slug": "heat-input-calculation-welding",
            "category": cat_welding,
            "title_en": "Heat input in welding: why it matters",
            "title_ru": "Тепловложение при сварке: почему это важно",
            "title_lv": "Siltuma ievade metināšanā: kāpēc tas ir svarīgi",
            "excerpt_en": "Understanding heat input helps control weld quality and avoid defects. Learn the formula and practical applications.",
            "excerpt_ru": "Понимание тепловложения помогает контролировать качество шва и избегать дефектов. Формула и практическое применение.",
            "excerpt_lv": "Siltuma ievades izpratne palīdz kontrolēt metinājuma kvalitāti un izvairīties no defektiem.",
            "content_en": """<p>Heat input (Q) is a key parameter in welding that affects the microstructure and mechanical properties of the weld. It is calculated as:</p>
<p><strong>Q = (U × I × 60) / (1000 × v)</strong> [kJ/mm]</p>
<p>Where U is voltage (V), I is current (A), and v is travel speed (mm/min).</p>
<p>Too high heat input can cause overheating, grain growth, and reduced toughness. Too low heat input may lead to lack of fusion or cold cracks.</p>
<p>For critical applications, use the Heat Input Calculator on this site to ensure optimal parameters.</p>""",
            "content_ru": """<p>Тепловложение (Q) — ключевой параметр сварки, влияющий на микроструктуру и механические свойства шва. Формула:</p>
<p><strong>Q = (U × I × 60) / (1000 × v)</strong> [кДж/мм]</p>
<p>Где U — напряжение (В), I — ток (А), v — скорость сварки (мм/мин).</p>
<p>Слишком высокое тепловложение вызывает перегрев и снижение ударной вязкости. Слишком низкое — несплавление или холодные трещины.</p>
<p>Для критичных применений используйте калькулятор тепловложения на этом сайте.</p>""",
            "content_lv": """<p>Siltuma ievade (Q) ir galvenais metināšanas parametrs, kas ietekmē metinājuma mikrostruktūru un mehāniskās īpašības. Aprēķins:</p>
<p><strong>Q = (U × I × 60) / (1000 × v)</strong> [kJ/mm]</p>
<p>Kur U ir spriegums (V), I ir strāva (A), v ir metināšanas ātrums (mm/min).</p>
<p>Pārāk augsta siltuma ievade var izraisīt pārkaršanu. Pārāk zema — nesavienojumu vai aukstās plaisas.</p>
<p>Izmantojiet šīs vietnes siltuma ievades kalkulatoru.</p>""",
            "tags": ["heat-input", "welding-parameters", "quality"],
        },
        {
            "slug": "welding-equipment-basics",
            "category": cat_equipment,
            "title_en": "MIG/MAG welding equipment: what to consider",
            "title_ru": "Оборудование для MIG/MAG сварки: на что обратить внимание",
            "title_lv": "MIG/MAG metināšanas iekārtas: ko ņemt vērā",
            "excerpt_en": "Key factors when choosing a MIG/MAG welding machine: power, duty cycle, wire feeder, and gas compatibility.",
            "excerpt_ru": "Ключевые факторы при выборе MIG/MAG аппарата: мощность, ПВ, подача проволоки, совместимость с газом.",
            "excerpt_lv": "Galvenie faktori izvēloties MIG/MAG metināšanas iekārtu: jauda, darba cikls, stieples padeve.",
            "content_en": """<p>Selecting the right MIG/MAG welding equipment depends on your typical applications and workpiece thickness.</p>
<p><strong>Power output</strong> should match the maximum thickness you plan to weld. A 250–350 A machine covers most workshop needs.</p>
<p><strong>Duty cycle</strong> indicates how long the machine can run at full power before overheating. Higher duty cycle means more continuous welding.</p>
<p><strong>Wire feeder</strong> type (push, pull, or push-pull) affects performance with different wire diameters and materials.</p>
<p>For detailed guidance, see the book \"MAG/MIG welding\" available on this site.</p>""",
            "content_ru": """<p>Выбор MIG/MAG оборудования зависит от типичных задач и толщины свариваемого металла.</p>
<p><strong>Мощность</strong> должна соответствовать максимальной толщине. Аппарат 250–350 А покрывает большинство потребностей.</p>
<p><strong>ПВ (продолжительность включения)</strong> показывает, сколько времени аппарат может работать на полной мощности. Выше ПВ — больше непрерывной сварки.</p>
<p><strong>Механизм подачи проволоки</strong> (толкающий, тянущий или комбинированный) влияет на работу с разными диаметрами.</p>
<p>Подробнее — в книге «Сварка MAG/MIG» на этом сайте.</p>""",
            "content_lv": """<p>MIG/MAG iekārtas izvēle ir atkarīga no tipiskajiem pielietojumiem un loksnes biezuma.</p>
<p><strong>Jaudas izeja</strong> jāatbilst maksimālajam biezumam. 250–350 A iekārta apmierina vairākumu vajadzību.</p>
<p><strong>Darba cikls</strong> norāda, cik ilgi iekārta var darboties pilnā jaudā. Augstāks cikls — vairāk nepārtrauktas metināšanas.</p>
<p>Detalizētai vadībai skatiet grāmatu \"MAG/MIG metināšana\".</p>""",
            "tags": ["equipment", "mig-mag", "welding-machine"],
        },
    ]

    for i, data in enumerate(posts_data):
        tags_data = data.pop("tags")
        category = data.pop("category")

        post = Post.objects.create(
            author=author,
            category=category,
            status="published",
            published_at=timezone.make_aware(datetime(2024, 12, 15 - i, 10, 0, 0)),
            **data,
        )

        for tag_slug in tags_data:
            tag, _ = Tag.objects.get_or_create(
                slug=tag_slug,
                defaults={"name": tag_slug.replace("-", " ").title()},
            )
            post.tags.add(tag)


def reverse_posts(apps, schema_editor):
    Author = apps.get_model("blog", "Author")
    Post = apps.get_model("blog", "Post")
    Post.objects.filter(
        slug__in=[
            "shielding-gas-selection-mig-mag",
            "heat-input-calculation-welding",
            "welding-equipment-basics",
        ]
    ).delete()
    Author.objects.filter(name="Oleg Suvorov").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0003_add_welding_metallurgy_category"),
    ]

    operations = [
        migrations.RunPython(create_author_and_posts, reverse_posts),
    ]
