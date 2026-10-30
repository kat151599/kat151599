# GOALS_AND_RULES.md — SolAir Portfolio

**Назначение:** публичное портфолио Катерины с реальными кейсами и безопасными интерактивными демонстрациями. Действующий production-домен: `portfolio.solair.vip`. Основной репозиторий сайта — `kat151599/kat151599`, ветка `main`. Рабочий каталог на UNI: `C:\Users\LL\Desktop\my PROJECTS home\SITE_Portfolio`; публичный веб-корень — `docs/`, но точный Caddy route проверяется при каждом выпуске.

## Архитектура
- Публичные страницы: `docs/index.html`, `docs/projects/`, `docs/en/projects/`. Общая дизайн-система: `docs/assets/site.css` и `home.css`.
- Интерактивные независимые стенды: `docs/demos/`. Не подключаются к production-API, БД или рабочим учётным записям.
- Настоящий DEV Vikunja существует отдельно на UNI: `C:\Users\LL\Desktop\my PROJECTS home\Vikunja`. Production Vikunja находится на SERV; не источник для работы над портфолио.
- Приватная независимая копия DEV для портфолио: `SITE_Portfolio/projects/vikunja`. Она исключена из родительского Git и **не должна быть доступна по HTTP**.
- Публичная демонстрация ClientCircuit — скомпилированный оригинальный модифицированный Vue-клиент Vikunja, режим с вымышленными данными, локальным browser storage и CSP `connect-src 'none'`. Это **не** полноценный production-сервер.
- Демонстрация хранится в `docs/demos/clientcircuit-native/`. Рядом публикуются полный соответствующий frontend-исходник, AGPL и уведомления, но **только при наличии прав на распространение модификаций и проверки сторонних лицензий**.
- Доступные UA/EN страницы: `docs/projects/clientcircuit.html`, `docs/en/projects/clientcircuit.html`. Дизайн использует стиль страниц VengMonitor (`industrial-monitoring.html`).
- Предыдущие демо `docs/demos/clientcircuit-admin/` и `docs/demos/clientcircuit/` сохраняются для совместимости и ссылок.

## Текущая работа — CC58P24

| Блок | Цель | Состояние |
| --- | --- | --- |
| B1 | Оригинальный интерфейс Vikunja/Vue | Original modified Vue interface built and publicly running; CC58P30A 44 unit and 23 Edge browser scenarios PASS |
| B2 | Реальные интерактивные сценарии браузерного демо | Kanban, list, CRM and Call Center interactive browser-only scenarios PASS; disabled mailbox remains blocked |
| B3 | Изоляция данных, отсутствие соединения с реальными API | Browser CSP no-egress and isolated fictional storage; Caddy denies four private source routes, source secret scan clean |
| B4 | Независимая копия DEV в `projects/vikunja` | Independent UNI portfolio DEV workspace at verified P30 source commit, original DEV and SERV unchanged |
| B5 | Исходники и права на публикацию | 935-file corresponding frontend source archive and AGPL notice published with user rights confirmation |
| B6 | Публикация UA/EN страниц и Vue-демо, безопасный rollback | CC58P30B Vue demo banner released atomically with verified UK/EN pages and previous assets retained |
| B7 | Публичная приёмка браузера, адаптивности, UX | VengMonitor-style demo banner visible in iframe and standalone; Home, Project and namespaced Reset; 44 unit and 23 browser tests PASS, owner visual check pending |

## Правила изменения
1. Изменять исходники через проверенный UNI-хелпер; после проверки коммитить согласованный результат в GitHub `main` и подтверждать совпадение локальной копии.
2. Не править общий Caddy, SERV, оригинальный UNI DEV и другие приложения ради оформления сайта. Не использовать Docker.
3. Запрещён прямой HTTP-доступ к `projects/vikunja`, `.git`, конфигурации и базе. Перед публикацией проверять текущую активную Caddy-конфигурацию и локальные HTTPS-маршруты.
4. Любая публикация AGPL-модификаций требует доступных соответствующих исходников и права их раскрывать. Скрытые служебные/рабочие доработки и секреты не выкладывать.
5. При сбое выпуска сохранить прежнюю работающую публичную версию и обеспечить откат. Не выдавать staging за публичный релиз и не заявлять PASS без пользовательского результата.
6. В каждой инженерной передаче разделять доказанные результаты, гипотезы и открытые ограничения. Проценты готовности — инженерные оценки, не объективная метрика.

**Следующий шаг:** CC58P24 audit/staging и, при подтверждённых юридических правах и технике, контролируемое размещение нового Vue-кейса и публичная проверка.
