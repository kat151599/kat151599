# Solar Demo — Independent Educational Simulator

This is a **new standalone public demonstration**, NOT a copy of the company's production CP Generator. The UI, sample equipment catalog, simplified solar arithmetic, fictional regional zones, pricing assumptions and HTML report format have been created specifically for this educational portfolio example.

### Functional visitor workflow
- Five sections: proposal, settings, HTML designs, field codes and saved drafts.
- Fictional solar panels, batteries, regions, tariffs and prices.
- Simplified educational calculations, clearly identified as estimates unsuitable for engineering decisions.
- Recalculation when inputs change; form validation with bounded quantities.
- Two independent, script-free HTML layouts generated locally. Visitor downloads their own report.
- Saved local drafts, history, copy/delete, portable JSON export and local JSON import.
- No API calls, server-side processing, accounts, credentials, real client records or production data.
- No third-party fonts, scripts or trackers. The browser receives only static site files.

### Privacy and security
Everything executes in the visitor's browser. Data is stored in localStorage under `portfolio-solar-demo-v2` and can be cleared from the UI; generated JSON and HTML stay on the visitor's computer. **Visitors should use fictional input only**. Do not insert real client or confidential company data.

The public JavaScript implements only an independent teaching model. It does not reproduce the private server's calculations, templates, financial policy, database, industrial settings or workflow APIs. Source code for the production solution is not published here.

### Architecture
`index.html` + `styles.css` + `app.js` — independent static-only simulator. No backend or build pipeline needed.

### Publication boundary
This repository contains a separately developed educational simulator. Production source code and private deployment scripts are excluded from this public snapshot.
