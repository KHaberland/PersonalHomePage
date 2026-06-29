# План изменения блока Solutions

## Цель

Убрать отдельный смысловой слой `Результаты для бизнеса` из `Expertise` и перенести его внутрь блока `Solutions` как второй слой: `Actions -> Impact`.

## План изменений

1. В `frontend/app/[locale]/page.tsx`:
   - удалить из секции `#expertise` внутренний блок с `competencyBusinessItems`;
   - оставить `Expertise` только как техническую экспертизу: MIG/MAG, TIG, газы, металлургия, качество, безопасность;
   - в секции `#solutions` оставить текущие карточки действий;
   - под ними добавить новый подблок `Impact` со списком результатов:
     - снижение брака и дефектов;
     - снижение затрат;
     - стабильные сварочные процессы;
     - прозрачные KPI;
     - обученная команда;
     - контроль и прослеживаемость.

2. В `frontend/app/[locale]/page.tsx` почистить данные:
   - удалить `competencyBusinessItems`, если он больше нигде не нужен;
   - убрать `getHomeBusinessOutcomes`, `homeBusinessByOrder`, `businessSubtitle`, `businessLead`, если `Impact` будет статическим из переводов;
   - добавить новый массив `solutionImpactItems` с ключами переводов.

3. В переводах `frontend/messages/en.json`, `frontend/messages/ru.json`, `frontend/messages/lv.json`:
   - заменить старые ключи `competenciesBusiness*` или перестать их использовать;
   - добавить ключи:
     - `solutionsActionsTitle`;
     - `solutionsImpactTitle`;
     - `solutionsImpactLead`;
     - `solutionsImpactDefects`;
     - `solutionsImpactCosts`;
     - `solutionsImpactStableProcesses`;
     - `solutionsImpactKpi`;
     - `solutionsImpactTeam`;
     - `solutionsImpactTraceability`.

4. Визуальная структура блока `Solutions`:
   - заголовок: `Решения для производства`;
   - слой 1: `Решения` с карточками Actions;
   - слой 2: `Результаты` с компактными impact-карточками или списком;
   - CTA `/contact` оставить внизу всего блока.

5. Проверить, что навигация не меняется:
   - `Header` уже ведет на `/#solutions`;
   - dropdown `Solutions` остается на action-якорях `solutions-*`;
   - новые impact-пункты не добавлять в верхнее меню.

## Проверка

В PowerShell:

```powershell
Set-Location .\frontend
npm run lint
npm run build
```

Ручная проверка: `/ru`, `/en`, `/lv`, блок `Expertise` без `Результатов для бизнеса`, блок `Solutions` читается как `что делаю -> что это дает`.
