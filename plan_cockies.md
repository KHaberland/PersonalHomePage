# План: Cookie Consent Banner и GDPR/ePrivacy compliance

**Проект:** PersonalHomePage (Next.js App Router + Django CMS)
**Файл:** `plan_cockies.md` (имя сохранено по запросу)
**Дата ревизии:** 2026-07-24
**Статус:** Phase A ✅ (2026-07-24); Phase B — не начата

---

## Вердикт ревизии

План в целом **правильный по направлению**: custom consent-модуль, CMS-first, opt-in, не трогать leads/Brevo, SSR-safe client island.

После сверки с репозиторием внесены правки по:

1. **Порядку фаз** — баннер ТЗ ссылается на Cookie Policy; страницу нельзя откладывать «на потом».
2. **Пустому Phase C** — GA/Matomo в коде нет; полный analytics-PR без Measurement ID не нужен.
3. **Конфликту миграций** — уже есть `pages.0041`; §6 противоречил правилу «одна секция / одна задача».
4. **Дублям B6/D1** — «Cookie settings» в footer объединены в одну фазу.
5. **Locale redirects** — middleware нет; редиректы через `next.config.ts` с префиксами `en|ru|lv`.
6. **Privacy** — страница `/privacy` и CMS-контент уже есть (частичный GDPR); ТЗ `/privacy-policy` = alias, не новая страница.
7. **Дизайн** — не вводить произвольный `shadow-lg`; опираться на `card` / `card-cta` / `btn-*`.
8. **Labels plumbing** — явно описать расширение `CommonUiLabels` + `Layout` (сейчас labels только header/footer/nav…).

**Оценка корректности исходного плана:** ~75%. Ниже — исправленная версия.

---

## 0. Принципы (не ломать существующее)

1. **Минимальный diff** — не трогать leads/Brevo API, формы подписки, webhook, admin, кампании.
2. **CMS-first** — тексты баннера, policy-страниц и footer-лейблов → Django Admin (`SiteTextBlock`); `messages/*.json` только SEO fallback.
3. **Client-only consent** — баннер и загрузка скриптов только на клиенте → без hydration errors.
4. **Opt-in по умолчанию** — analytics и marketing = `false` до явного согласия.
5. **Один источник правды** — модуль `cookie-consent` во frontend; любые future third-party loaders — только через него.
6. **Честный Cookie Policy** — не описывать cookies, которых нет (GA/Brevo pixel пока отсутствуют).

---

## 1. Аудит текущего состояния (факт кода)

**Статус аудита:** ✅ выполнен 2026-07-24 (сверка с репозиторием, без изменений кода продукта).

### 1.1. Сводная таблица

| Область | Факт | Вывод |
|---------|------|-------|
| Privacy | `frontend/app/[locale]/privacy/page.tsx` есть; CMS `legal/privacy` (title/body/newsletterSection via `0040`); nav `privacyNav` | ✅ canonical оставить `/privacy` |
| Privacy content | controller, what/why/retention, Brevo DOI; **нет** полного списка GDPR-прав, cookie-consent, Art. 6 | ⚠️ **дополнить**, не создавать с нуля |
| Cookie Policy | `app/[locale]/cookie-policy/page.tsx` есть; CMS `legal/cookie_policy` (0042); nav `cookiePolicyNav` | ✅ stub + таблица inventory |
| Terms of Use | `app/[locale]/terms` — **нет** | ❌ Phase B |
| Consent UI | `components/cookie-consent`, `lib/cookie-consent` | ✅ Phase A |
| Footer legal | `supportNavLinks`: `/`, `/about`, `/contact`, `/privacy` | ⚠️ Cookie Policy + Terms + settings — Phase B |
| GA / Matomo / gtag / `next/script` | в frontend **не найдены**; в `.env.example` нет `NEXT_PUBLIC_GA_*` | gate = инфраструктура, не активный трекинг |
| Brevo | только backend (`BREVO_*` в settings / `.env.example`); API DOI/SMTP/campaigns | клиентских marketing pixels **нет** |
| Newsletter / question forms | `Link href="/privacy"` в `BlogNewsletterBlock`, `BlogArticleQuestionBlock` | **не менять** href |
| Labels | `CommonUiLabels.cookieConsent` ✅; merge из CMS `common/cookie_consent`; передача через Layout → Provider → Banner/Modal/Settings | A3 закрыт |
| i18n | next-intl `^4.8.3`; locales `en|ru|lv`; SEO fallback `cookiePolicyTitle`/`cookiePolicyDescription` в messages | consent-тексты — CMS, 3 языка |
| Redirects | `next.config.ts` — только `images`; **нет** `redirects()`; `middleware.ts` **нет** | locale-aware redirects в next.config |
| Sitemap | `STATIC_PATHS` включает `/privacy`, `/cookie-policy` | ✅ A7 |
| CMS migrations pages | `0042` (cookie consent + cookie policy) применена | следующая `0043` (Phase B) |
| Locale routes (факт) | … + `cookie-policy` | `/terms` — Phase B |
| Third-party media | Cloudinary в `images.remotePatterns` | CDN изображений, не tracking-consent blocker |
| Дизайн-токены | `card` / `card-cta` / `btn-primary` / `btn-secondary` в globals | баннер на них |

**Риск регрессии:** `/privacy` в формах и footer не удалять и не переименовывать.

### 1.2. Доказательства (пути)

| Проверка | Результат |
|----------|-----------|
| `Test-Path app\[locale]\privacy\page.tsx` | True |
| `Test-Path app\[locale]\cookie-policy\page.tsx` | True |
| `Test-Path app\[locale]\terms` | False |
| `Test-Path components\cookie-consent` | True |
| `Test-Path lib\cookie-consent` | True |
| `Test-Path middleware.ts` | False |
| Grep `gtag\|googletagmanager\|matomo\|G-[A-Z]` в frontend | нет трекинг-скриптов |
| Grep `href="/privacy"` | 2 файла форм блога |
| `supportNavLinks` | только Privacy из legal |
| pages migrations `004*` | `0040`, `0041` |

### 1.3. Cookie / tracker inventory (сейчас)

| Источник | Browser cookie / script? | Категория для будущего consent |
|----------|--------------------------|--------------------------------|
| next-intl locale routing | возможно locale cookie/preference | Necessary |
| Next.js / hosting | технические | Necessary |
| Django session | только admin backend | out of public banner scope |
| Brevo DOI / email | server-side API, не frontend script | не marketing pixel; описать в Privacy |
| Google Analytics | **не подключён** | Analytics (если появится) |
| Brevo / ads pixels | **не подключены** | Marketing (если появятся) |
| Cloudinary images | image CDN | не блокировать consent-баннером |

### 1.4. Вывод аудита → план

Аудит **подтверждает** исправленный план:
- Phase A нужна полностью (UI + storage + stub Cookie Policy).
- Phase C (реальный GA) **не блокер** — скриптов нет.
- Privacy = extend CMS, не новая страница.
- Следующие миграции: `0042` / `0043`.

---

## 2. Выбор решения

**Статус:** ✅ реализовано (Custom React module, 2026-07-24).

### Рекомендация: **собственный лёгкий модуль** (не SaaS)

| Вариант | Вердикт |
|---------|---------|
| Cookiebot / OneTrust / Osano | ❌ платно, внешний скрипт, лишний для сайта без ad network |
| Klaro | ⚠️ запасной, если custom UI раздуется |
| **Custom React module** | ✅ рекомендуется (~300–450 LOC) |

**Почему custom:** нет GA; нет client Brevo pixel; CMS-migration уже принят; нужен industrial UI и SSR-safe App Router.

**SSR-safe паттерн:**

```
LocaleLayout (server) → labels из CMS
  └─ Layout (server)
       └─ CookieConsentRoot ('use client')
            ├─ mounted? → иначе null
            ├─ CookieBanner (если нет valid consent)
            ├─ CookiePreferencesModal
            └─ ConsentScriptLoader (no-op пока нет GA ID)
```

Первый paint: `null` → после `useSyncExternalStore` на клиенте → баннер/скрипты. Так избегаем hydration mismatch.

### 2.1. Реализованные файлы

| Слой | Путь |
|------|------|
| Core types/storage | `frontend/lib/cookie-consent/` |
| UI | `frontend/components/cookie-consent/` |
| Layout wiring | `frontend/components/Layout.tsx` |
| Labels CMS | migration `pages.0042` → `common/cookie_consent` |
| Stub Cookie Policy | `frontend/app/[locale]/cookie-policy/page.tsx` |
| Script gate (stub) | `ConsentScriptLoader.tsx` — GA/marketing no-op до env ID |

**API:** `getConsent`, `saveConsent`, `acceptAll`, `rejectAll`, `subscribeConsent`, `dispatchOpenPreferences`.

---

## 3. Модель данных согласия

### 3.1. Storage

**Статус:** ✅ реализовано (`frontend/lib/cookie-consent/`, 2026-07-24).

**LocalStorage** ключ `cookie_consent_v1`:

```json
{
  "version": 1,
  "necessary": true,
  "analytics": false,
  "marketing": false,
  "date": "2026-07-24T12:00:00.000Z"
}
```

| Правило | Значение |
|---------|----------|
| TTL | 12 месяцев от `date`; expired → баннер снова |
| PII | не хранить |
| Cookie-дубль | **не нужен на MVP** (нет SSR-зависимости от consent) |
| Version bump | при смене категорий (`version: 2`) сбрасывать старый consent |

### 3.2. API модуля

**Статус:** ✅ реализовано в `storage.ts` / `events.ts` / `context.tsx` (вместе с §3.1).

| Функция | Назначение |
|---------|------------|
| `getConsent()` | read + TTL + version check |
| `saveConsent(partial)` | сохранить выбор |
| `acceptAll()` / `rejectAll()` | shortcuts |
| `hasConsentChoice()` | баннер показывать или нет |
| `openPreferences()` / `dispatchOpenPreferences()` | event/context для footer и Cookie Policy |
| `subscribeConsent(cb)` | для script loaders |

---

## 4. URL и маршруты

| ТЗ | Решение | Примечание |
|----|---------|------------|
| `/cookie-policy` | **новая** `app/[locale]/cookie-policy/page.tsx` | CMS `legal/cookie_policy` |
| `/privacy-policy` | **redirect 308** → `/privacy` | locale-aware |
| `/privacy` | **canonical**, дополнить GDPR-блок | уже используется формами |
| Terms of Use | **новая** `/terms` | CMS `legal/terms`, минимальный seed |

**Redirects в `next.config.ts` (пример):**

```ts
async redirects() {
  return [
    {
      source: '/:locale(en|ru|lv)/privacy-policy',
      destination: '/:locale/privacy',
      permanent: true,
    },
  ];
}
```

Sitemap: добавить `/cookie-policy`, `/terms`.
`ia.ts`: отдельный `legalNavLinks` (не смешивать с `primaryNavLinks`).

---

## 5. Фазы разработки (исправленный порядок)

### Phase A — Consent UI + storage + stub Cookie Policy — ~1 PR

**Цель:** баннер и preferences работают; ссылка «Cookie Policy» не 404; analytics ещё не подключаем.

| # | Задача | Файлы / зона |
|---|--------|----------------|
| A1 | Модуль consent ✅ | `frontend/lib/cookie-consent/` (`types`, `default-labels`, `storage`, `events`, `context`) |
| A2 | UI баннера + modal ✅ | `frontend/components/cookie-consent/*` (Banner + PreferencesModal) |
| A3 | Root + labels plumbing ✅ | `CookieConsentRoot`; расширить `CommonUiLabels` (`cookieConsent`); передать из `Layout`; labels в Provider + `CookieSettingsButton` из context |
| A4 | CMS migration **0042** ✅ | `common/cookie_consent/*` + nav labels (`cookiePolicyNav`, …) |
| A5 | **Минимальная** страница `/cookie-policy` ✅ | паттерн как `privacy/page.tsx` + seed title/body (честная таблица) |
| A6 | SEO fallback ✅ | `messages/{en,ru,lv}.json` — title/description для cookie-policy |
| A7 | Sitemap ✅ | `/cookie-policy` в `STATIC_PATHS` |

**Тексты баннера (EN primary, RU/LV в CMS)** — по ТЗ:
- body + Accept all / Reject all / Manage preferences
- ссылка на Cookie Policy
- modal: Necessary (always on), Analytics OFF, Marketing OFF

**Дизайн:**
- `fixed bottom-0`, контейнер `card` или `card-cta`, **не** full-screen blocking overlay
- кнопки `btn-primary` / `btn-secondary`
- mobile: stack
- modal: `aria-modal`, focus trap; ESC закрывает modal, **не** считает согласие данным
- без произвольного тяжёлого shadow — как у существующих card

**Acceptance A:**
- [x] Incognito → баннер
- [x] Reject/Accept → LocalStorage, баннер скрыт после reload
- [x] Manage preferences → toggles + Save
- [x] Ссылка Cookie Policy открывается (en/ru/lv)
- [x] Нет hydration warnings (SSR-safe: `mounted` + `useSyncExternalStore`)
- [x] Leads/forms/privacy links не затронуты
- [x] `npm run test` (storage + events) — OK
- [x] `npm run build` — OK

---

### Phase B — Legal pack + footer — ~1 PR

**Цель:** закрыть ТЗ §6–8 (Terms, footer, расширение Privacy, смена настроек).

| # | Задача |
|---|--------|
| B1 | Страница `/terms` + CMS `legal/terms` |
| B2 | CMS migration **0043**: terms + дополнение `legal/privacy` (Art. 6, права GDPR, cookies/consent) |
| B3 | Углубить Cookie Policy (таблица, срок 12 мес., как изменить настройки) |
| B4 | Footer: Privacy · Cookie Policy · Terms · **Cookie settings** (открывает modal через `openPreferences`) |
| B5 | Redirect `/privacy-policy` → `/privacy` (locale-aware) |
| B6 | Sitemap `/terms`; metadata keys |

**Privacy — дополнить существующий CMS**, не переписывать Brevo-секцию:
- legal basis (consent / legitimate interest / contract — по факту форм)
- права: access, rectification, erasure, restriction, portability, objection, complaint
- упоминание cookie consent + ссылка на `/cookie-policy`
- контакт (уже есть → `/contact`)

**Acceptance B:**
- [ ] Footer: 3 legal links + Cookie settings
- [ ] `/terms`, `/cookie-policy`, `/privacy` на 3 языках
- [ ] `/en/privacy-policy` → `/en/privacy`
- [ ] Формы по-прежнему ведут на `/privacy`

---

### Phase C — Script gate (тонкий, можно отложить) — 0–0.5 PR

**Цель:** инфраструктура «не грузить до согласия».
**Не делать полноценный GA**, пока нет `NEXT_PUBLIC_GA_MEASUREMENT_ID` в production.

| # | Задача |
|---|--------|
| C1 | `ConsentScriptLoader` — уже можно заложить stub в Phase A |
| C2 | При появлении GA ID: `frontend/lib/analytics/google-analytics.ts` + env в `.env.example` |
| C3 | Marketing stub (пустой) — до Brevo pixel / ads |
| C4 | Optional: `usePathname` page_view только при `analytics=true` |

**Правило:**

```ts
if (consent.analytics && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
  loadGoogleAnalytics();
}
// marketing — только когда появится реальный pixel
```

**Acceptance C** (когда появится ID):
- [ ] Reject → нет запросов к google-analytics / GTM
- [ ] Accept + ID → GA грузится
- [ ] Withdraw analytics → документировать: reload или удаление `_ga` (backlog)

> Если GA не планируется в ближайший месяц — **Phase C не открывать отдельным PR**; оставить stub-хук из A.

---

### Phase D — QA checklist (не отдельный feature-PR)

| # | Задача |
|---|--------|
| D1 | Manual matrix §9 |
| D2 | Короткая секция в README или комментарий в Cookie Policy: фактический cookie inventory |
| D3 | `npm run build` + визуальная проверка mobile |

«Cookie settings» в footer — **уже Phase B**, не D.

---

## 6. CMS migrations (согласовано с правилами)

| Migration | Scope | Phase |
|-----------|-------|-------|
| `0042_cookie_consent_ui_and_cookie_policy.py` | `common/cookie_consent/*`, nav keys, `legal/cookie_policy` (минимальный body) | A |
| `0043_legal_terms_and_privacy_gdpr.py` | `legal/terms`, дополнение `legal/privacy`, расширение cookie_policy body | B |

Не объединять A+B в одну миграцию: разные PR и разные «крупные секции» (cms-migration.mdc).

**Ключи `common/cookie_consent` (минимум):**
`bannerText`, `acceptAll`, `rejectAll`, `managePreferences`, `cookiePolicyLink`,
`necessaryTitle`, `necessaryDesc`, `necessaryAlwaysActive`,
`analyticsTitle`, `analyticsDesc`, `marketingTitle`, `marketingDesc`,
`savePreferences`, `cookieSettings` (footer trigger).

---

## 7. Интеграция с сервисами

| Сервис | Client cookies сейчас? | Действие |
|--------|------------------------|----------|
| Google Analytics | нет | gate + env; не грузить без consent |
| Matomo | нет | тот же analytics-gate при появлении |
| Brevo email API | нет (server) | описать в Privacy/Cookie Policy как processor, не browser cookie |
| Brevo marketing pixel | нет | marketing-категория зарезервирована |
| next-intl locale | возможна cookie/local preference | категория **Necessary** |
| Cloudinary images | CDN, не tracking consent | не блокировать |
| Django admin session | только `/admin` | out of scope banner |

**Newsletter / contact forms:** не требуют marketing-consent (другая правовая основа); privacy note → `/privacy` оставить.

---

## 8. Дизайн-spec

| Элемент | Решение |
|---------|---------|
| Banner | `fixed bottom-0 inset-x-0 z-50 p-4`; внутри `card` / `card-cta`, `max-w-4xl mx-auto` |
| Primary | `btn-primary` — Accept all |
| Secondary | `btn-secondary` — Reject all, Manage |
| Modal | overlay `bg-black/50` + `card`; без «dashboard»-шума |
| Toggles | native checkbox / простой switch в стиле `input-industrial` |
| Necessary | disabled + caption «Always active» |
| i18n | только CMS/labels props, без хардкода RU/LV в компонентах (EN fallback ок) |

---

## 9. Тестирование

| Сценарий | Ожидание |
|----------|----------|
| New user (incognito) | Banner |
| Reject all | consent saved; analytics/marketing false; нет third-party scripts |
| Accept all | analytics+marketing true; GA только если ID задан |
| Manage → Save | partial consent |
| Cookie settings (footer) | modal с текущими toggles |
| TTL > 12 months | баннер снова |
| `/ru`, `/lv` | CMS texts |
| Mobile 375px | читаемо, кнопки stack |
| View source | нет GA script в SSR HTML |
| Console | нет hydration errors |
| Regression | `/privacy`, subscribe, contact inquiry работают |

Автотесты: optional unit на TTL/`acceptAll`; Playwright — не блокер MVP.

---

## 10. Порядок PR

```
PR1 = Phase A  (consent UI + storage + stub cookie-policy + CMS 0042)
PR2 = Phase B  (terms + privacy GDPR + footer legal + redirects + CMS 0043)
PR3 = Phase C  (только когда есть реальный GA/Matomo ID)
```

QA matrix — в конце PR2 (или коротко в PR1 для banner-only).

---

## 11. Риски

| Риск | Mitigation |
|------|------------|
| Hydration mismatch | mount-gate; initial `null` |
| Баннер → 404 Cookie Policy | stub page в Phase A |
| Дубль privacy URL | redirect + canonical `/privacy` |
| Сломать forms | не менять `/privacy` href |
| GA до consent | env empty; loader gated |
| CMS пуст | минимальный EN fallback в component |
| Раздутый PR | A/B раздельно; C отложен |
| Юридический текст | seed в CMS; финальная вычитка владельцем сайта |

---

## 12. Out of scope

- Cookiebot / OneTrust / iubenda
- Django `ConsentLog` (Phase E)
- IAB TCF 2.x
- Изменение leads/Brevo backend
- Принудительный подключение GA «для галочки»
- Переименование `/privacy` → `/privacy-policy` как primary

---

## 13. Backlog (Phase E)

- [ ] Server-side ConsentLog (proof of consent)
- [ ] Удаление `_ga*` при отзыве analytics без reload
- [ ] Google Consent Mode v2 (если Ads)
- [ ] Matomo adapter
- [ ] Cookie Policy auto-table из конфига категорий

---

## 14. Команды проверки

```powershell
Set-Location "D:\Work_Cursor\PersonalHomePage\backend"
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py test apps.pages

Set-Location "D:\Work_Cursor\PersonalHomePage\frontend"
npm run lint
npm run build
```

Ручная проверка: DevTools → Local Storage → `cookie_consent_v1`; Network → `google-analytics` / `googletagmanager` (должно быть пусто до Accept).

---

## 15. Оценка трудозатрат (после ревизии)

| Phase | Оценка | Комментарий |
|-------|--------|-------------|
| A — Consent + stub Cookie Policy | 5–7 ч | +labels plumbing |
| B — Legal pack + footer | 3–5 ч | Privacy = extend CMS |
| C — Real GA gate | 1–2 ч | только при наличии ID |
| QA | 1–2 ч | в составе A/B |
| **Итого до production-ready без GA** | **~9–14 ч** | |
| **+ GA** | **+1–2 ч** | |

---

## 16. Что изменено относительно первой версии плана

| Было | Стало |
|------|-------|
| Cookie Policy только в Phase B | stub `/cookie-policy` в Phase A (ссылка баннера) |
| Phase C как обязательный PR с GA | stub в A; полный C — по появлению ID |
| Phase D с Cookie settings | Cookie settings → Phase B |
| Одна миграция A+B (§6) | `0042` (A) + `0043` (B) |
| Миграция «0042» без учёта 0041 | учтена актуальная цепочка pages |
| Redirect «middleware или next.config» | только `next.config.ts`, locale-aware |
| Privacy «создать» по смыслу ТЗ | **дополнить** существующую `/privacy` |
| `shadow-lg` в design-spec | существующие card/btn токены |
| Labels не описаны | `CommonUiLabels.cookieConsent` + Layout |
| Cookie Policy с вымышленными analytics_id/brevo_id | честный inventory + «planned if enabled» |

---

*Реализация — по PR1→PR2; PR3 не открывать без реального analytics ID. Backend leads не менять.*
