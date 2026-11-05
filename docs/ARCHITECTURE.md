# Riverside Service Desk

A fictional Riverside College IT helpdesk for Level 2 Technical Support learners. Week 7, **Inside the Workstation**, supports component identification, explanation and reasoned recommendations for unit J/618/3687. It is a learning resource, not an official assessment or college service.

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

Each profile has a generated ID, name and separate `localStorage` record under `riverside.service-desk.v1.profile.<id>`. Records contain drafts, notes, collected evidence, attempts, scores, completed and unlocked tickets, teacher settings, component encounters and statistics. Nothing writes learner progress to GitHub or another service. GitHub serves static files and may retain its normal hosting request logs; the application adds no tracking.

The active profile ID is kept in `sessionStorage` so refreshing the same tab resumes the shift. A fresh tab/start offers saved profiles. Multiple profiles on a shared browser are conveniences, **not private or authenticated accounts**. Two browsers/devices have independent storage. If two people need to work at the same time on the same computer, use separate browser profiles. Tabs on the same browser synchronise local changes. Private browsing, managed college policies or clearing site data can remove progress; export a JSON backup before leaving.

Use **Local profile & progress** for switch/new technician, export, import, reset and deletion. Reset clears only the active shift. Delete removes only the selected local profile. Both require confirmation and offer export first. Imports validate the file format, active pack, known fields, IDs, allowed values and size (2 MB maximum). An ID/name conflict asks whether to keep both or explicitly replace the existing profile. Invalid files cannot overwrite stored data. Corrupt local records are left untouched, with a visible warning. A storage/quota failure is shown and an in-memory shift remains exportable.

The Session Report retains every submitted attempt and its feedback, the next step, gathered evidence and notes. Use **Copy Evidence Summary**, **Export Progress**, or **Print / Save as PDF** (browser print). The plain-text summary is selectable if clipboard access is blocked.

## Teacher Mode

Default local PIN: **2707**, configured in `src/data/config.ts`. This is public configuration and a convenience lock, **not security**. Teacher Mode can unlock all tickets, toggle scoring or hints, randomise order within tiers, show an answer guide and reset the active learner. Scoring changes affect future attempts; previous scores remain evidence. Learner-specific settings persist. Answer visibility closes on refresh/profile switch. Reset restores default settings.

## Content architecture

- `src/types.ts`: reusable scenario pack, component, machine, ticket, rubric and progress schemas.
- `src/data/config.ts`: pack registry, active pack ID, teacher PIN and tier descriptions.
- `src/data/week7Tickets.ts`: all twelve tickets, machine specifications, evidence, correct component sets, function/reasoning key-idea groups, action choices, hints and feedback.
- `src/data/components.ts`: the complete ten-component reference library.
- `src/lib/engine.ts`: progression, rubric checks, scoring, reporting and statistics.
- `src/lib/storage.ts`: local persistence and validated export/import.
- `src/components/`: ticket workflow, report and keyboard-accessible workstation.

Register another `ScenarioPack` in `scenarioPacks` and change `activePackId`. IDs must be stable and unique. Give future packs their own IDs so saved shifts remain separate; the app leaves inactive pack data untouched. Every text-rubric group needs at least one matching term, and every group must match. Add a model answer in each rubric and test it. The workstation is a simplified identification view rather than an exact hardware simulation. Future weeks can reuse the report/evidence/submission workflow and register pack-specific inspection content.

## GitHub Pages

The project uses GitHub Actions in `.github/workflows/deploy.yml`, triggered by pushes to `main` or manual dispatch. It installs Node LTS, runs `npm ci`, tests, builds, configures Pages, uploads `dist` and deploys using official GitHub actions. Repository **Settings → Pages → Build and deployment → Source** must be **GitHub Actions**. The deployment requires repository Pages permission and Actions enabled.

`vite.config.ts` uses `/riverside-service-desk/`, corresponding to this project’s origin repository. If moving to a different repository, use `/<actual-repository-name>/`; a `USERNAME.github.io` root repository uses `/`. Keep hash navigation. No server, database or environment secrets are required.

Deployment guidance follows the [Vite Pages guide](https://vite.dev/guide/static-deploy.html#github-pages) and [GitHub’s custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). See `VALIDATION.md` for the checks performed for this release.
