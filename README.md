# Riverside Service Desk

A browser-only learning helpdesk for Gateway Level 2 IT Technical Support (J/618/3687).

- [Week 8 · Peripherals](https://sean-p-clohessy.github.io/riverside-service-desk/#week-8/explore) opens the desk with 12 device references, 15 connection references, six connection checks and eight paired investigations. The [90-minute lesson](https://sean-p-clohessy.github.io/riverside-service-desk/#week-8/lesson) ends with an individual comparison in the session report.
- [Week 7 · Inside the Workstation](https://sean-p-clohessy.github.io/riverside-service-desk/#week-7/dashboard) contains the archived diagram and all 12 original tickets.

[Open the public application](https://sean-p-clohessy.github.io/riverside-service-desk/) · [Source repository](https://github.com/sean-p-clohessy/riverside-service-desk)

## Run locally

Use Node 24 LTS or newer.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Open the address Vite prints, including `/riverside-service-desk/`. Production output is `dist`. There is no backend, database, login, analytics, AI API or runtime external service. All assets are bundled. Hash navigation supports refresh on GitHub Pages.

## Learner workflow

Start or choose a local profile. Open a ticket to assign it. Read the report and specification, inspect the equipment, gather evidence and save notes. Submit a hardware choice, function explanation, evidence-based reasoning and next step. Week 7 unlocks tickets in tiers. All Week 8 requests are available for pairs to choose.

Open **Accessibility** at check-in or during a shift for colour scheme and text size. These preferences are saved in the browser. **Reset display settings** restores Dark and Standard. Choose **Magnify** beside an interactive diagram to enlarge it, pan within the view or select from the labelled parts list.

The best attempt per ticket counts: component identification earns 5/3/1 points on successive attempts, function 3, reasoning 3, next step 2, minus 1 per hint. A ticket resolves when all four checks pass. Written feedback checks key ideas locally; tutors should review the original responses. It is not an official assessment result.

## Local profiles and portability

One local profile opens both weeks. Each week stores its own tickets, notes and score. The Week 7 record retains its original storage key, and its old bookmarks and JSON exports still work. Refresh retains the current week and session.

Use **Local profile & progress** to switch technicians, export or import JSON, reset a shift or delete a profile. Reset and export apply to the selected week. Deleting a profile removes its work across both weeks after confirmation. Import opens the week identified in the file.

The **Session Report** includes all attempts, explanations, outcomes, notes, strengths and review areas. Copy a portfolio summary, export JSON, or use **Print / Save as PDF**.

## Teacher Mode

Default PIN: **2707** in `src/data/config.ts`. Controls unlock all tickets, toggle scoring/hints, randomise within-tier order, reveal answers and reset the current learner. Settings apply locally. Scoring changes affect future submissions. The PIN is public configuration, not security.

## Add future weeks

Ticket content and library data live in `src/data/`; the reusable schema is `src/types.ts`. Register a pack in `scenarioPacks`, then change `activePackId` in `src/data/config.ts`. Stable pack IDs keep progress separate. Select `inspectionMode: 'catalog'` for generic component inspections in future peripheral/network/software packs; Week 7 uses the workstation diagram. Engine, storage and report code are shared.

## Deployment

`.github/workflows/deploy.yml` builds/tests with Node LTS on pushes to `main`, uploads `dist` and deploys using official GitHub Pages actions. **Settings → Pages → Source: GitHub Actions**. Vite base `/riverside-service-desk/` matches the confirmed origin. For another repository use its actual subpath; a root `USERNAME.github.io` repository uses `/`.

See [validation evidence](VALIDATION.md) and [architecture and operational detail](docs/ARCHITECTURE.md). Deployment follows the [Vite Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
