import type {
  Attempt,
  Diagnosis,
  Profile,
  ScenarioPack,
  Ticket,
  TicketProgress,
  ConceptRubric,
} from "../types.ts";

export const emptyDiagnosis = (): Diagnosis => ({
  components: [],
  functionText: "",
  reasoning: "",
  action: "",
});
export const emptyProgress = (): TicketProgress => ({
  assignedAt: new Date().toISOString(),
  notes: "",
  evidence: [],
  hintsUsed: 0,
  draft: emptyDiagnosis(),
  attempts: [],
});
export function createProfile(name: string, pack: ScenarioPack): Profile {
  const now = new Date().toISOString();
  const profile: Profile = {
    schemaVersion: 1,
    id: crypto.randomUUID(),
    name: name.trim(),
    packId: pack.id,
    createdAt: now,
    updatedAt: now,
    shiftStartedAt: now,
    tickets: {},
    order: pack.tickets.map((t) => t.id),
    settings: {
      unlockAll: false,
      scoring: true,
      hints: true,
      order: "sequential",
    },
    inspected: [],
    unlockedTickets: [],
    statistics: { shifts: 1, visits: 1, submissions: 0 },
  };
  return syncProgress(profile, pack);
}
export function resetProfile(profile: Profile, pack: ScenarioPack): Profile {
  const fresh = createProfile(profile.name, pack);
  return {
    ...fresh,
    id: profile.id,
    createdAt: profile.createdAt,
    statistics: {
      shifts: profile.statistics.shifts + 1,
      visits: profile.statistics.visits,
      submissions: 0,
    },
  };
}
export function unlockedIds(profile: Profile, pack: ScenarioPack): string[] {
  return pack.tickets
    .filter(
      (t) =>
        profile.settings.unlockAll ||
        pack.tickets
          .filter((prior) => prior.tier < t.tier)
          .every((prior) => !!profile.tickets[prior.id]?.completedAt),
    )
    .map((t) => t.id);
}
export function syncProgress(profile: Profile, pack: ScenarioPack): Profile {
  return {
    ...profile,
    unlockedTickets: unlockedIds(profile, pack),
    updatedAt: new Date().toISOString(),
  };
}
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function normaliseConcept(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(?:applications?|apps?|programs?|programmes?|software)\b/g,
      "app",
    )
    .replace(/\b(?:connections?|connectors?)\b/g, "connect")
    .replace(/\bslots?\b/g, "slot")
    .replace(/\s+/g, " ")
    .trim();
}
export function conceptChecks(value: string, groups: string[][]): boolean[] {
  // Keep sentence boundaries until negative clauses have been removed.
  const positive = value
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(
      /\b(?:not|never|cannot|doesn't|isn't|can't|don't|no)\b[^.!?;,\n]*?(?=\bbut\b|[.!?;,\n]|$)/g,
      " ",
    );
  const normal = normaliseConcept(positive);
  return groups.map(
    (group) =>
      value.trim().length >= 16 &&
      group.some((term) =>
        new RegExp(
          `\\b${normaliseConcept(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
        ).test(normal),
      ),
  );
}
export function matchesConcepts(value: string, groups: string[][]): boolean {
  return conceptChecks(value, groups).every(Boolean);
}
export function missingIdeas(value: string, rubric: ConceptRubric): string[] {
  const checks = conceptChecks(value, rubric.groups);
  return (rubric.criteria ?? []).filter((_, index) => !checks[index]);
}
export function evaluate(
  ticket: Ticket,
  progress: TicketProgress,
  scoring: boolean,
): Attempt {
  const d = progress.draft;
  const componentCorrect =
    d.components.length === ticket.expected.length &&
    ticket.expected.every((id) => d.components.includes(id));
  const functionCorrect = matchesConcepts(
    d.functionText,
    ticket.functionRubric.groups,
  );
  const reasoningCorrect = matchesConcepts(
    d.reasoning,
    ticket.reasoningRubric.groups,
  );
  const actionCorrect = !!ticket.actions.find((a) => a.id === d.action)
    ?.correct;
  const componentPoints =
    progress.attempts.length === 0 ? 5 : progress.attempts.length === 1 ? 3 : 1;
  const points = scoring
    ? Math.max(
        0,
        (componentCorrect ? componentPoints : 0) +
          (functionCorrect ? 3 : 0) +
          (reasoningCorrect ? 3 : 0) +
          (actionCorrect ? 2 : 0) -
          progress.hintsUsed,
      )
    : 0;
  return {
    ...d,
    components: [...d.components],
    at: new Date().toISOString(),
    componentCorrect,
    functionCorrect,
    reasoningCorrect,
    actionCorrect,
    points,
    resolved:
      componentCorrect && functionCorrect && reasoningCorrect && actionCorrect,
    scoring,
    hintsUsed: progress.hintsUsed,
  };
}
export function submit(profile: Profile, ticket: Ticket): Profile {
  const progress = profile.tickets[ticket.id] ?? emptyProgress();
  if (progress.completedAt) return profile;
  const attempt = evaluate(ticket, progress, profile.settings.scoring);
  return {
    ...profile,
    tickets: {
      ...profile.tickets,
      [ticket.id]: {
        ...progress,
        attempts: [...progress.attempts, attempt],
        completedAt: attempt.resolved ? attempt.at : undefined,
      },
    },
    statistics: {
      ...profile.statistics,
      submissions: profile.statistics.submissions + 1,
    },
  };
}
export function stats(profile: Profile, pack: ScenarioPack) {
  const progress = pack.tickets
    .map((t) => profile.tickets[t.id])
    .filter(Boolean);
  const attempted = progress.filter((p) => p.attempts.length > 0);
  const resolved = progress.filter((p) => p.completedAt).length;
  const first = attempted.filter((p) => p.attempts[0].resolved).length;
  const score = progress.reduce(
    (sum, p) => sum + Math.max(0, ...p.attempts.map((a) => a.points)),
    0,
  );
  return {
    assigned: progress.filter((p) => !p.completedAt).length,
    resolved,
    attempted: attempted.length,
    first,
    accuracy: attempted.length
      ? Math.round((first / attempted.length) * 100)
      : 0,
    score,
    open: pack.tickets.length - resolved,
    hints: progress.reduce((n, p) => n + p.hintsUsed, 0),
    attempts: attempted.reduce((n, p) => n + p.attempts.length, 0),
  };
}
export function componentPerformance(profile: Profile, pack: ScenarioPack) {
  return pack.components.map((component) => {
    const tickets = pack.tickets.filter(
      (t) =>
        t.expected.includes(component.id) &&
        profile.tickets[t.id]?.attempts.length,
    );
    return {
      component,
      attempted: tickets.length,
      resolved: tickets.filter((t) => profile.tickets[t.id].completedAt).length,
      review: tickets.some((t) =>
        profile.tickets[t.id].attempts.some((a) => !a.resolved),
      ),
      strong: tickets.some((t) => profile.tickets[t.id].attempts[0]?.resolved),
    };
  });
}
export function evidenceSummary(profile: Profile, pack: ScenarioPack): string {
  const s = stats(profile, pack);
  const performance = componentPerformance(profile, pack);
  const names = (ids: string[]) =>
    ids
      .map((id) => pack.components.find((c) => c.id === id)?.shortName ?? id)
      .join(", ");
  return [
    "RIVERSIDE COLLEGE IT — LEARNING SESSION REPORT",
    `${pack.subtitle} — ${pack.title}`,
    pack.unit,
    `Technician: ${profile.name}`,
    `Shift started: ${new Date(profile.shiftStartedAt).toLocaleString("en-GB")}`,
    `Tickets attempted: ${s.attempted}/${pack.tickets.length} | Resolved: ${s.resolved} | First-attempt accuracy: ${s.accuracy}% | Score: ${s.score}`,
    "First-attempt accuracy means all four rubric checks passed on the first submission. Scores use the best attempt per ticket.",
    `Components encountered: ${names([...new Set([...profile.inspected, ...pack.tickets.filter((t) => profile.tickets[t.id]?.attempts.length).flatMap((t) => t.expected)])]) || "None yet"}`,
    `Strengths: ${
      performance
        .filter((p) => p.strong)
        .map((p) => p.component.shortName)
        .join(", ") || "Keep investigating to build evidence."
    }`,
    `Review: ${
      performance
        .filter((p) => p.review)
        .map((p) => p.component.shortName)
        .join(", ") || "No review flags recorded."
    }`,
    "Local rubric checks key ideas; a tutor should review the complete written evidence. This is not an official assessment result.",
    ...pack.tickets
      .filter((t) => profile.tickets[t.id]?.attempts.length)
      .flatMap((t) => {
        const p = profile.tickets[t.id];
        return [
          `\n${t.id.toUpperCase()} — ${t.title}`,
          `Outcome: ${p.completedAt ? "Resolved" : "Review required"}`,
          ...p.attempts.flatMap((a, i) => [
            `Attempt ${i + 1}: ${names(a.components)} | ${a.resolved ? "Resolved" : "Review"} | ${a.points} points${a.scoring ? "" : " (scoring off)"}`,
            `Function: ${a.functionText}`,
            `Relevance: ${a.reasoning}`,
            `Next step: ${t.actions.find((x) => x.id === a.action)?.label ?? ""}`,
            `Checks: component ${a.componentCorrect ? "correct" : "review"}; function ${a.functionCorrect ? "met" : "review"}; reasoning ${a.reasoningCorrect ? "met" : "review"}; action ${a.actionCorrect ? "met" : "review"}. Hints: ${a.hintsUsed}`,
          ]),
          `Evidence gathered: ${p.evidence.map((id) => t.evidence.find((e) => e.id === id)?.title).join("; ") || "None"}`,
          `Technician notes: ${p.notes || "None"}`,
        ];
      }),
  ].join("\n");
}
