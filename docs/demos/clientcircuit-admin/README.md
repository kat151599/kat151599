# ClientCircuit — public read-only admin portfolio

Published as static assets under `/demos/clientcircuit-admin/` of `portfolio.solair.vip`; embedded in both Ukrainian and English ClientCircuit project pages.

The design, UI and fictional dataset originate from the separately built ClientCircuit standalone read-only admin demo at `d5a7a698bdd7acec7cbe17a43817725f2bfd28b9` (private `kat151599/vikunja_GTT`). Only two adaptations: relative asset URLs and static `./snapshot.json` instead of the Go read-only endpoint. Text explains this is not the original Vikunja Vue admin UI.

2026-10-29 local-only native Windows integration ACCEPTED: Go test/vet/build zero; SQLite seeded; HTTP GET data passed; POST denied 405; original administrative GET denied 404; SQLite unchanged; local bind only. Built executable SHA256 `439AE913BDD085DA83C03F3E1A8AB2765BCF271773CF9F1F3B4273795D35B7A2`. The public static site deliberately **does not publish or execute the Go binary** and requires no new process, API, SQLite, user account, reverse proxy, shared Caddy edit, or privileged ServiceHub registration.

Exported deterministic fictional dataset: 4 projects, 10 tasks, 5 users, 3 teams, with referential checks. No secrets or real users. Browser code uses textContent for external data, not innerHTML.

The former Kanban browser simulator at `/demos/clientcircuit/kanban.html` and English translation remain available, no files removed. To refresh this public version, review and update the snapshot and assets in the public portfolio repository, then fast-forward the existing site checkout; changes to the private Go demo do not automatically reach this public edition.

**Safety boundaries:** Never publish original DEV data or the private SQLite directory. No Caddy reload, Docker, ports, forwarding, private auth, or changes to other running projects. Use already working portfolio static delivery path.
