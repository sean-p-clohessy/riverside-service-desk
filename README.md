# Riverside Service Desk

A browser-only learning helpdesk for Level 2 Digital Technologies. Twelve complete Week 7 tickets teach workstation components through investigation, evidence, explanations and recommendations. A fictional Riverside College service, supporting Technical Support unit J/618/3687.

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

Start or choose a named local profile. Open a ticket to assign it; read the report and specification, inspect the interactive PC, gather evidence and save notes. Submit component selections, a function explanation, evidence-based reasoning and a next step. Resolve each tier to unlock the next. The library contains ten complete component references.

The best attempt per ticket counts: component identification earns 5/3/1 points on successive attempts, function 3, reasoning 3, next step 2, minus 1 per hint. A ticket resolves when all four checks pass. Written feedback checks key ideas locally; tutors should review the original responses. It is not an official assessment result.

## Local profiles and portability

Progress is stored only in the learner’s browser, separately for each profile under `riverside.service-desk.v1.profile.<id>`. Refresh retains the current shift. Other browsers/devices start independently. Profiles and the teacher PIN are conveniences, not authentication or privacy boundaries on a shared browser.

Use **Local profile & progress** to switch/create technicians, export/import JSON, reset a shift or delete a profile. Reset and deletion require confirmation and affect only the active profile. Conflicting imports offer keep-both or explicit replacement; invalid files are rejected. Export before leaving a shared/managed PC because browser policies may clear storage.

The **Session Report** includes all attempts, explanations, outcomes, notes, strengths and review areas. Copy a portfolio summary, export JSON, or use **Print / Save as PDF**.

## Teacher Mode

Default PIN: **2707** in `src/data/config.ts`. Controls unlock all tickets, toggle scoring/hints, randomise within-tier order, reveal answers and reset the current learner. Settings apply locally. Scoring changes affect future submissions. The PIN is public configuration, not security.

## Add future weeks

Ticket content and library data live in `src/data/`; the reusable schema is `src/types.ts`. Register a pack in `scenarioPacks`, then change `activePackId` in `src/data/config.ts`. Stable pack IDs keep progress separate. Select `inspectionMode: 'catalog'` for generic component inspections in future peripheral/network/software packs; Week 7 uses the workstation diagram. Engine, storage and report code are shared.

## Deployment

`.github/workflows/deploy.yml` builds/tests with Node LTS on pushes to `main`, uploads `dist` and deploys using official GitHub Pages actions. **Settings → Pages → Source: GitHub Actions**. Vite base `/riverside-service-desk/` matches the confirmed origin. For another repository use its actual subpath; a root `USERNAME.github.io` repository uses `/`.

See [validation evidence](VALIDATION.md) and [architecture and operational detail](docs/ARCHITECTURE.md). Deployment follows the [Vite Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
