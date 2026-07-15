# flake8: noqa: E501
from django.db import migrations, models


SEO_METADATA = [
    (
        "home",
        {
            "en": (
                "Oleg Suvorov | Welding Engineer",
                "Engineering entry page for an International Welding Engineer: follow Reasoning -> Proof -> Knowledge, then validate parameters with tools.",
            ),
            "ru": (
                "Олег Суворов | Инженер по сварке",
                "Входная страница International Welding Engineer: пройти путь логика -> подтверждение -> знания и проверить параметры инструментами.",
            ),
            "lv": (
                "Olegs Suvorovs | Metināšanas inženieris",
                "International Welding Engineer sākumlapa: sekojiet ceļam loģika -> pierādījums -> zināšanas un pēc tam pārbaudiet parametrus ar rīkiem.",
            ),
        },
    ),
    (
        "about",
        {
            "en": (
                "About Oleg Suvorov | Welding Engineer",
                "Biography, education and professional qualifications of welding engineer Oleg Suvorov. MMA/MAG, TIG certifications.",
            ),
            "ru": (
                "Обо мне | Олег Суворов — инженер по сварке",
                "Биография, образование и квалификации инженера по сварке Олега Суворова. Сертификаты MMA/MAG, TIG.",
            ),
            "lv": (
                "Par mani | Olegs Suvorovs — metināšanas inženieris",
                "Biogrāfija, izglītība un kvalifikācijas metināšanas inženiera Oļega Suvorova. MMA/MAG, TIG sertifikāti.",
            ),
        },
    ),
    (
        "experience",
        {
            "en": (
                "Professional Experience | Oleg Suvorov",
                "Timeline, cases, projects, and results from practical welding engineering work.",
            ),
            "ru": (
                "Профессиональный опыт | Олег Суворов",
                "Хронология, кейсы, проекты и результаты из практического опыта инженера по сварке.",
            ),
            "lv": (
                "Profesionālā pieredze | Olegs Suvorovs",
                "Laika līnija, piemēri, projekti un rezultāti no praktiskas metināšanas inženiera pieredzes.",
            ),
        },
    ),
    (
        "expertise",
        {
            "en": (
                "Welding Expertise | MIG/MAG, TIG, Gases and Quality",
                "Static engineering capability map: welding processes, materials, gases, metallurgy, and safety.",
            ),
            "ru": (
                "Экспертиза в сварке | MIG/MAG, TIG, газы и качество",
                "Статическая карта инженерных компетенций: процессы сварки, материалы, газы, металлургия и безопасность.",
            ),
            "lv": (
                "Metināšanas ekspertīze | MIG/MAG, TIG, gāzes un kvalitāte",
                "Statiska inženiertehnisko kompetenču karte: metināšanas procesi, materiāli, gāzes, metalurģija un drošība.",
            ),
        },
    ),
    (
        "solutions",
        {
            "en": (
                "Welding Solutions | Defect Reduction and Process Stability",
                "Decision layer for welding problems: reusable solution patterns for defects, process stability, shielding gas, training, and WPS support.",
            ),
            "ru": (
                "Решения по сварке | Снижение дефектов и стабильность процесса",
                "Слой решений для сварочных задач: повторяемые паттерны решений по дефектам, стабильности процесса, газам, обучению и WPS.",
            ),
            "lv": (
                "Metināšanas risinājumi | Defektu samazināšana un procesa stabilitāte",
                "Risinājumu slānis metināšanas uzdevumiem: atkārtojami risinājumu modeļi defektiem, procesa stabilitātei, gāzēm, apmācībai un WPS atbalstam.",
            ),
        },
    ),
    (
        "book",
        {
            "en": (
                "MAG/MIG Welding Book | Oleg Suvorov",
                "Static authority artifact by Oleg Suvorov: a MAG/MIG welding book that supports credibility without replacing the knowledge hub or blog archive.",
            ),
            "ru": (
                "Книга «Сварка MAG/MIG» | Олег Суворов",
                "Статический авторитетный материал Олега Суворова: книга по MAG/MIG-сварке поддерживает доверие, но не заменяет базу знаний или архив блога.",
            ),
            "lv": (
                'Grāmata "MAG/MIG metināšana" | Olegs Suvorovs',
                "Statisks autoritātes materiāls no Oļega Suvorova: MAG/MIG metināšanas grāmata stiprina uzticamību, bet neaizstāj zināšanu bāzi vai bloga arhīvu.",
            ),
        },
    ),
    (
        "tools",
        {
            "en": (
                "Tools | Welding Calculators",
                "Calculation layer for welding parameters: heat input, gas flow, shielding gas, cutting, cost, and welding settings.",
            ),
            "ru": (
                "Инструменты | Сварочные калькуляторы",
                "Расчётный слой для сварочных параметров: тепловложение, расход газа, защитный газ, резка, стоимость и режимы.",
            ),
            "lv": (
                "Rīki | Metināšanas kalkulatori",
                "Aprēķinu slānis metināšanas parametriem: siltuma ievade, gāzes plūsma, aizsarggāze, griešana, izmaksas un režīmi.",
            ),
        },
    ),
    (
        "knowledge",
        {
            "en": (
                "Welding Knowledge Base | Articles",
                "Structured explanations of welding processes, gases, metallurgy, and defects. Use it as the reference layer before applying a solution pattern.",
            ),
            "ru": (
                "База знаний по сварке | Статьи",
                "Структурные объяснения сварочных процессов, газов, металлургии и дефектов. Используйте как справочный слой перед применением паттерна решения.",
            ),
            "lv": (
                "Metināšanas zināšanu bāze | Raksti",
                "Strukturēti skaidrojumi par metināšanas procesiem, gāzēm, metalurģiju un defektiem. Izmantojiet kā atsauces slāni pirms risinājuma modeļa pielietošanas.",
            ),
        },
    ),
    (
        "blog",
        {
            "en": (
                "Technical Blog | Publications",
                "Chronological welding publications, updates, and author commentary. Topic-based reference material remains in the knowledge base.",
            ),
            "ru": (
                "Технический блог | Публикации",
                "Хронологические публикации, обновления и авторские комментарии по сварке. Справочные материалы по темам остаются в базе знаний.",
            ),
            "lv": (
                "Tehniskais blogs | Publikācijas",
                "Hronoloģiskas metināšanas publikācijas, jaunumi un autora komentāri. Tēmu atsauces materiāli paliek zināšanu bāzē.",
            ),
        },
    ),
    (
        "contact",
        {
            "en": (
                "Contact | Oleg Suvorov",
                "Contact welding engineer Oleg Suvorov. Email, LinkedIn, YouTube.",
            ),
            "ru": (
                "Контакты | Олег Суворов",
                "Связаться с инженером по сварке Олегом Суворовым. Email, LinkedIn, YouTube.",
            ),
            "lv": (
                "Kontakti | Olegs Suvorovs",
                "Sazināties ar metināšanas inženieri Olegu Suvorovu. Email, LinkedIn, YouTube.",
            ),
        },
    ),
]


def seed_seo_metadata(apps, schema_editor):
    SEOMetadata = apps.get_model("pages", "SEOMetadata")
    for page, translations in SEO_METADATA:
        for language, (title, description) in translations.items():
            SEOMetadata.objects.update_or_create(
                page=page,
                language=language,
                defaults={
                    "title": title,
                    "description": description,
                },
            )


def remove_seeded_seo_metadata(apps, schema_editor):
    SEOMetadata = apps.get_model("pages", "SEOMetadata")
    pages = [page for page, _translations in SEO_METADATA]
    SEOMetadata.objects.filter(page__in=pages).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0020_solutions_expertise_site_text_blocks"),
    ]

    operations = [
        migrations.CreateModel(
            name="SEOMetadata",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "page",
                    models.CharField(
                        choices=[
                            ("home", "Home"),
                            ("about", "About"),
                            ("experience", "Experience"),
                            ("expertise", "Expertise"),
                            ("solutions", "Solutions"),
                            ("knowledge", "Knowledge"),
                            ("blog", "Blog"),
                            ("tools", "Tools"),
                            ("contact", "Contact"),
                            ("book", "Book"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "language",
                    models.CharField(
                        choices=[
                            ("en", "English"),
                            ("ru", "Русский"),
                            ("lv", "Latviešu"),
                        ],
                        max_length=5,
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "SEO metadata",
                "verbose_name_plural": "SEO metadata",
                "db_table": "pages_seo_metadata",
                "ordering": ["page", "language"],
            },
        ),
        migrations.AddIndex(
            model_name="seometadata",
            index=models.Index(
                fields=["page", "language"],
                name="pages_seo_m_page_ddd31f_idx",
            ),
        ),
        migrations.AddConstraint(
            model_name="seometadata",
            constraint=models.UniqueConstraint(
                fields=("page", "language"),
                name="unique_seo_metadata_page_language",
            ),
        ),
        migrations.RunPython(seed_seo_metadata, remove_seeded_seo_metadata),
    ]
