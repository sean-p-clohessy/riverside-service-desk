# Release validation — 5 November 2026

Local validation passed before the first deployment. Live Pages verification is recorded below once deployment completes.

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
| Reset / delete | Cancel and confirm tested. Resetting Jack cleared his shift; deleting him removed only his profile. Sarah’s completed record remained unchanged. |
| Export / import | JSON download completed. Import restored 12 tickets. Keep-both created a distinct ID; explicit replacement restored the original; malformed profile rejected without overwriting. |
| Major pages | Dashboard, Ticket Queue, My Tickets, Component Library, Performance, Session Report, all investigation tabs and profile dialogs inspected. Library contained 10 references; search worked. |
| Report | Original attempts, explanations, feedback, notes, strengths and review areas present. Clipboard summary read back successfully; Chromium generated an A4 print PDF. Print styling visually inspected. |
| Teacher Mode | Invalid and valid PIN; unlock-all; scoring off (correct mixed ticket earned 0); hints off; random order; answer guide; learner reset restoring defaults. |
| Responsive / keyboard | 1440×1000, 1366×768, 1024×768, 768×1024 and 390×844 inspected. No page horizontal overflow. Arrow-key tabs, keyboard component selection, modal Escape and mobile profile access passed. |
| Console | Local browser: 0 errors and 0 warnings. |
| Source hygiene | No runtime localhost URLs, TODO content or remote assets in app source. QA exports and screenshots are ignored and are not shipped. |

Detailed QA screenshots, snapshots, browser scripts, test exports and the print PDF are kept locally under the ignored `output/playwright/` folder. They contain synthetic QA profiles only.

## Limits of the evidence

This was functional and visual browser validation using Chromium, with responsive viewports. It is not a formal accessibility audit, real-learner usability study or claim that browser storage survives a college device policy clearing it. Text rubric checks identify key ideas and cannot replace tutor assessment of technical explanations. The teacher PIN and progress exports are editable local conveniences, not security or tamper-resistant grading.
