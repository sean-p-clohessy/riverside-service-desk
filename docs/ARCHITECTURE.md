# Riverside Service Desk

A fictional Riverside College helpdesk for Level 2 IT Technical Support (J/618/3687). Week 7 covers internal hardware. Week 8 links peripherals and ports to internal hardware through device inspection, connection checks and paired investigations.

## Run

Use Node 24 LTS or newer and npm.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Vite prints the local address including `/riverside-service-desk/`. Production output is `dist/`. Navigation uses URL hashes, so refreshing a ticket or report works on GitHub Pages without rewrites. All icons, diagrams, scripts and styles are bundled locally. There are no runtime API calls, remote fonts, accounts, analytics, paid services or AI services.

## Learning workflow

Start a named local technician profile. Open a ticket to assign it, read the request and specification, select components in the internal-PC diagram, gather evidence, and record notes. Submit the component selection, a function explanation, ticket reasoning and a structured next step. All twelve tickets have complete content, clues, rubrics and feedback. Resolve a tier’s three tickets to unlock the next tier.

Scoring per attempt: component 5 points on attempt 1, 3 on attempt 2, 1 on later attempts; function 3; reasoning 3; next step 2; minus 1 for each hint already used. Scores cannot fall below zero. **Only the best attempt per ticket counts**, preventing retry farming. A ticket resolves when all four checks pass. First-attempt accuracy is the proportion of attempted tickets that met all four checks on their first submission. A retry remains useful evidence and does not prevent completion.

Written feedback uses transparent key-idea rules, not AI or a claim of human marking. Alternative valid wording can need revision. Tutors should review the full original responses and notes in the report; passing these checks is not an official assessment result. Guidance and examples are in the ticket data.

## Local progress and privacy

Each learner keeps one ID across weeks. Week 7 keeps the original `riverside.service-desk.v1.profile.<id>` key. Later weeks use `riverside.service-desk.v1.profile.<pack-id>.<id>`. Opening another week prepares a new record when needed. Each record holds the week’s drafts, notes, evidence, attempts, scores and settings. Week 8 also keeps completed connection checks and the comparison response. Learner records stay in browser storage.

The active profile ID is kept in `sessionStorage` so refreshing the same tab resumes the shift. A fresh tab/start offers saved profiles. Multiple profiles on a shared browser are conveniences, **not private or authenticated accounts**. Two browsers/devices have independent storage. If two people need to work at the same time on the same computer, use separate browser profiles. Tabs on the same browser synchronise local changes. Private browsing, managed college policies or clearing site data can remove progress; export a JSON backup before leaving.

Use **Local profile & progress** to switch technicians, export or import the selected week, reset a shift or delete a profile. Reset clears the selected week. Delete clears the selected learner’s records in both weeks. Imports validate version 1 JSON against the pack named in the file and prompt before replacing existing work in that week. Both operations provide an export option before confirmation.

The Session Report retains every submitted attempt and its feedback, the next step, gathered evidence and notes. Use **Copy Evidence Summary**, **Export Progress**, or **Print / Save as PDF** (browser print). The plain-text summary is selectable if clipboard access is blocked.

## Teacher Mode

Default local PIN: **2707**, configured in `src/data/config.ts`. This is public configuration and a convenience lock, **not security**. Teacher Mode can unlock all tickets, toggle scoring or hints, randomise order within tiers, show an answer guide and reset the active learner. Scoring changes affect future attempts; previous scores remain evidence. Learner-specific settings persist. Answer visibility closes on refresh/profile switch. Reset restores default settings.

## Content architecture

- `src/types.ts`: reusable scenario pack, component, machine, ticket, rubric and progress schemas.
- `src/data/config.ts`: pack registry, active pack ID, teacher PIN and tier descriptions.
- `src/data/week7Tickets.ts`: all twelve tickets, machine specifications, evidence, correct component sets, function/reasoning key-idea groups, action choices, hints and feedback.
- `src/data/components.ts`: the complete ten-component reference library.
- `src/data/week8Lab.ts`: peripheral, port, practice and lesson content, with links to UK price sources.
- `src/data/week8Tickets.ts`: paired investigations and their rubrics.
- `src/lib/engine.ts`: progression, rubric checks, scoring, reporting and statistics.
- `src/lib/storage.ts`: local persistence and validated export/import.
- `src/components/`: ticket workflow, report and keyboard-accessible workstation.

Register another `ScenarioPack` in `scenarioPacks` and change `activePackId`. IDs must be stable and unique. Give future packs their own IDs so saved shifts remain separate; the app leaves inactive pack data untouched. Every text-rubric group needs at least one matching term, and every group must match. Add a model answer in each rubric and test it. The workstation is a simplified identification view rather than an exact hardware simulation. Future weeks can reuse the report/evidence/submission workflow and register pack-specific inspection content.

## GitHub Pages

The project uses GitHub Actions in `.github/workflows/deploy.yml`, triggered by pushes to `main` or manual dispatch. It installs Node LTS, runs `npm ci`, tests, builds, configures Pages, uploads `dist` and deploys using official GitHub actions. Repository **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. The deployment requires repository Pages permission and Actions enabled.

`vite.config.ts` uses `/riverside-service-desk/`, corresponding to this project’s origin repository. If moving to a different repository, use `/<actual-repository-name>/`; a `USERNAME.github.io` root repository uses `/`. Keep hash navigation. No server, database or environment secrets are required.

Deployment guidance follows the [Vite Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub’s custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). See `VALIDATION.md` for the checks performed for this release.

## Week 8 illustrations

The built-in ImageGen tool produced both illustrations. The site ships JPEG copies. The device pictures illustrate the equipment types, and each price links to a named product example.

### Desk image

Saved in [public/media/week8/desk.jpg](../public/media/week8/desk.jpg).

> Create a photorealistic educational illustration for an interactive British college IT service desk, landscape 3:2. Orthographic near top-down view, angled just enough to see the monitor screen, tidy midnight-navy workbench, well-lit neutral grey gear, gentle teal reflections, overhead soft lighting, crisp authentic shapes, premium product photography. Include exactly these distinct objects with lots of empty dark space between them so each is an obvious selectable target: a black 24-inch monitor showing a blank deep teal screen centred in upper-middle around (48%,32%); one small clip-on webcam centred on its top edge around (48%,10%); a full-size wired keyboard below the display around (43%,72%); a wired optical mouse to the keyboard's right around (69%,74%); black padded wired over-ear headset with boom microphone to the left around (14%,51%); one compact stereo computer speaker around (19%,22%); a short desktop USB condenser microphone on a small stand around (83%,55%); a compact matte-black home inkjet printer with a white sheet at the far right around (85%,23%); a small grey external portable SSD near (82%,81%). Objects have clean silhouette boundaries and generous gaps. Show dark desk surface edge to edge, no hands, no people, no extra electronics, no laptop, no PC tower, no visible brands, no printed or screen text, no logos, no markings, no interface, no numbered pins or overlays. Balanced product-photo composition, all gear fully within image edges.

### Peripheral reference images

Saved in [public/media/week8/peripherals.jpg](../public/media/week8/peripherals.jpg).

> A single square sprite atlas of exactly 16 distinct generic computer hardware product photographs, strict 4 columns by 4 rows equal cells, 4x4, centered objects each fully contained in their square with at least 12% empty padding on every side, all backgrounds exactly flat dark midnight navy #111925 across the entire image, no grid marks, no borders, no text, no logos, no people, no labels, no extra items. Consistent premium British IT lab catalogue studio lighting, neutral black/grey objects with clean accurate silhouettes, slight 3/4 view, low soft shadows, true product forms; screens show only solid dark blue. Order left to right: ROW 1 full-size wired keyboard, wired optical mouse, flatbed document scanner with lid slightly open, desktop USB condenser microphone with small stand. ROW 2 clip-on webcam with lens, compact inkjet printer with blank sheet, 24-inch desktop monitor on stand, pair of small stereo PC speakers. ROW 3 flat widescreen smart TV with feet, desktop touchscreen on angled stand, over-ear USB headset with boom microphone, small rectangular portable USB solid-state drive. ROW 4 USB hub, USB flash drive, wired games joystick, low-profile external optical DVD drive. Critical: strict equally sized 4-by-4 tile layout, each object centered at x=12.5/37.5/62.5/87.5% and y=12.5/37.5/62.5/87.5%, clear visual separation with 12% padding. Device bodies should be well lit and legible on navy.
