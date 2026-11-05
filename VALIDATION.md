# Release validation — 5 November 2026

Local validation and the deployed public GitHub Pages application passed the checks below.

**Public application:** https://sean-p-clohessy.github.io/riverside-service-desk/

**Source:** https://github.com/sean-p-clohessy/riverside-service-desk

**Full-workflow baseline:** `eb373e533e17d95b4797152199522ac849aec9cf`.
A final UI follow-up adds direct Reset Shift controls to the startup profile chooser. Its confirmation, cancellation and isolation were separately verified; the learning engine and ticket content remain the tested baseline. The latest published revision is visible in the repository’s [Pages deployment runs](https://github.com/sean-p-clohessy/riverside-service-desk/actions/workflows/deploy.yml).

| Check | Evidence / result |
| --- | --- |
| Clean installation | `npm install` from an empty project, followed by `npm ci` from the committed lockfile; 0 dependency vulnerabilities reported. |
| Automated checks | `npm test`: 7 tests passed. All 12 model answers, tier progression, retries/hints, no score farming, multi-component sets, negated claims, import validation, profile isolation and teacher settings. |
| Production build | `npm run build`: TypeScript and Vite succeeded; `dist` includes bundled JavaScript, styles and favicon. |
| Development runtime | Actual Vite app opened in a task-owned Chromium browser. |
| Complete journeys | All 12 tickets completed through the learner interface, with specification, diagram, both evidence sources, notes and submission. Tiers unlocked naturally. |
| Incorrect / retry / hint | Ticket 1: incorrect SSD response earned 0; one hint plus a correct second attempt earned 10. Earlier attempt retained. |
| Final totals | 12 resolved, 13 submissions, 1 hint, 153 points, 92% first-attempt accuracy. |
| Refresh persistence | Resolved feedback, evidence, draft component/function selections and technician notes survived normal refresh. |
| Separate local profiles | Sarah and Jack on the same browser had separate records, notes, scores and tickets. Jack started at 0 points. |
| Reset / delete | Cancel and confirm tested. Resetting Jack cleared his shift; deleting him removed only his profile. Sarah’s completed record remained unchanged. Direct startup Reset Shift also tested: cancel preserves the score; confirm clears only the chosen profile. |
| Export / import | JSON download completed. Import restored 12 tickets. Keep-both created a distinct ID; explicit replacement restored the original; malformed profile rejected without overwriting. |
| Major pages | Dashboard, Ticket Queue, My Tickets, Component Library, Performance, Session Report, all investigation tabs and profile dialogs inspected. Library contained 10 references; search worked. |
| Report | Original attempts, explanations, feedback, notes, strengths and review areas present. Clipboard summary read back successfully; Chromium generated an A4 print PDF. Print styling visually inspected. |
| Teacher Mode | Invalid and valid PIN; unlock-all; scoring off (correct mixed ticket earned 0); hints off; random order; answer guide; learner reset restoring defaults. |
| Responsive / keyboard | 1440×1000, 1366×768, 1024×768, 768×1024 and 390×844 inspected. No page horizontal overflow. Arrow-key tabs, keyboard component selection, modal Escape and mobile profile access passed. |
| Console | Local browser: 0 errors and 0 warnings. |
| Source hygiene | No runtime localhost URLs, TODO content or remote assets in app source. QA exports and screenshots are ignored and are not shipped. |

Detailed QA screenshots, snapshots, browser scripts, test exports and the print PDF are kept locally under the ignored `output/playwright/` folder. They contain synthetic QA profiles only.

## Live GitHub Pages validation

- [GitHub Actions run 41994590000](https://github.com/sean-p-clohessy/riverside-service-desk/actions/runs/41994590000): build and deployment both succeeded. GitHub Pages was enabled through the API with `build_type: workflow`; there is no manual setting left to change.
- Opened the public URL in two fresh task-owned Chromium browsers with no GitHub authentication. Both initially showed a fresh check-in screen; local development profiles were absent.
- In the first public browser, Sarah completed tickets 1–3 through the actual production interface. Ticket 1 included an incorrect submission, hint and successful retry; CPU and motherboard were correct on attempt 1. Result: **3 resolved, 36 points, 67% first-attempt accuracy**. Tier 2 unlocked; Tier 3 stayed locked.
- Production machine tabs, diagram selection, evidence collection, notes, all six major pages, clipboard evidence summary and JSON download worked. Refreshing a ticket hash and the report hash retained the profile, feedback, notes and score.
- In the independent public browser, Jack remained at **0 points with no assigned or completed tickets** after Sarah’s actions. Only explicitly importing Sarah’s downloaded JSON created her profile there. Her three tickets, 36 points and original notes restored; Jack still had 0 points.
- Verified the production JavaScript, CSS and favicon each returned **HTTP 200**, all under `/riverside-service-desk/`. Normal hash refresh required no URL rewriting. No external application service is used and no learner progress is submitted over the network.
- Repeated desktop/tablet/phone layout and keyboard checks against the public site. No page overflow; keyboard tab and component selection, mobile profile access and modal Escape passed.
- Production browser consoles: **0 errors, 0 warnings**. Network observations contained static GET requests only; no learner-data POST requests or tracking endpoints.

## Limits of the evidence

This was functional and visual browser validation using Chromium, with responsive viewports. It is not a formal accessibility audit, real-learner usability study or claim that browser storage survives a college device policy clearing it. Text rubric checks identify key ideas and cannot replace tutor assessment of technical explanations. The teacher PIN and progress exports are editable local conveniences, not security or tamper-resistant grading.
