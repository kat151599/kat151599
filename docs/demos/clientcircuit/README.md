# ClientCircuit — standalone portfolio simulator

An independent educational browser-only demonstration designed for a **business-solutions** case study. It is not a fork, theme or copy of the production Vikunja / GTT Call Center interfaces.

## Brand and visuals
- Name: **ClientCircuit** (working portfolio-demo identity).
- Original linked-contact circuit emblem in `logo.svg` — not a Vikunja or employer logo.
- Separate midnight-blue, indigo, cyan and warm-amber palette. No employer branding.

## Visitor workflow
- Browse fictional leads, filter/search and inspect their provenance and history.
- Generate a fictional website inquiry (no real submission).
- Assign an owner, log a mock call and add a note.
- Move the lead from new → contacted → qualified → converted.
- Preserve a unified client timeline and simulated CRM record on conversion.
- Replay a fictional ingest event without creating a second lead.
- Reset everything and switch between Ukrainian and English.

No backend, analytics, fonts, external assets, tokens, database, user accounts, outbound requests or production data. State lives in memory only and resets on page refresh.

## Source grounding and limitations
The private production project includes Vikunja-derived CRM client profiles and task history, a Call Center integration, source/ingest-method separation, provenance, audit events, idempotent lead identity, and a client-history conversion design. Its architecture documentation distinguishes implemented components, runtime-verified behavior and deferred website ingestion/deployment.

This demo is **not** proof that external website forms are deployed end-to-end. All contact events, calls and conversions in this public demo are explicitly simulated.

Production software builds on the open-source **Vikunja** project and an adapted Call Center component (derived from **Open Cold Dialer**). Attribution and license obligations for those components remain separate from this original simulator. Production source and all related infrastructure/private configurations remain outside the public portfolio.
