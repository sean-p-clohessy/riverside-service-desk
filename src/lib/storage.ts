import type {
  Attempt,
  Diagnosis,
  Profile,
  ScenarioPack,
  TicketProgress,
} from "../types.ts";
import { syncProgress } from "./engine.ts";

export const PROFILE_PREFIX = "riverside.service-desk.v1.profile.";
export const ACTIVE_KEY = "riverside.service-desk.v1.active";
export const originalPackId = "week7-workstation";
export function profileKey(id: string, packId: string) {
  const weekPrefix = packId === originalPackId ? "" : `${packId}.`;
  return `${PROFILE_PREFIX}${weekPrefix}${id}`;
}
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, max = 6000): v is string =>
  typeof v === "string" && v.length <= max;
const integer = (v: unknown, min = 0, max = 100000): v is number =>
  typeof v === "number" && Number.isSafeInteger(v) && v >= min && v <= max;
const date = (v: unknown): v is string =>
  str(v, 40) && Number.isFinite(Date.parse(v));
const strings = (v: unknown, allowed: string[], max = 100): v is string[] =>
  Array.isArray(v) &&
  v.length <= max &&
  new Set(v).size === v.length &&
  v.every((x) => str(x, 100) && allowed.includes(x));

export function validateProfile(value: unknown, pack: ScenarioPack): Profile {
  const fail = (): never => {
    throw new Error(
      "This is not a valid Riverside progress file for the active scenario pack. Nothing has been overwritten.",
    );
  };
  if (!record(value)) return fail();
  const v = value;
  if (
    v.schemaVersion !== 1 ||
    v.packId !== pack.id ||
    !str(v.id, 60) ||
    !/^[a-z0-9-]{20,60}$/i.test(v.id) ||
    !str(v.name, 60) ||
    !v.name.trim() ||
    !date(v.createdAt) ||
    !date(v.updatedAt) ||
    !date(v.shiftStartedAt)
  )
    return fail();
  const componentIds = pack.components.map((c) => c.id),
    ticketIds = pack.tickets.map((t) => t.id);
  if (
    !strings(v.inspected, componentIds) ||
    !strings(v.order, ticketIds) ||
    v.order.length !== ticketIds.length ||
    !strings(v.unlockedTickets, ticketIds)
  )
    return fail();
  if (
    !record(v.settings) ||
    !["unlockAll", "scoring", "hints"].every(
      (k) => typeof (v.settings as Record<string, unknown>)[k] === "boolean",
    ) ||
    !["sequential", "random"].includes(v.settings.order as string)
  )
    return fail();
  if (
    !record(v.statistics) ||
    !integer(v.statistics.shifts, 1) ||
    !integer(v.statistics.visits, 1) ||
    !integer(v.statistics.submissions)
  )
    return fail();
  if (
    !record(v.tickets) ||
    Object.keys(v.tickets).some((id) => !ticketIds.includes(id))
  )
    return fail();
  let practice: Profile["practice"];
  if (pack.practiceIds) {
    if (v.practice === undefined) practice = { passed: [], comparison: "" };
    else if (
      record(v.practice) &&
      strings(v.practice.passed, pack.practiceIds) &&
      str(v.practice.comparison)
    ) {
      practice = {
        passed: [...v.practice.passed],
        comparison: v.practice.comparison,
      };
    } else return fail();
  }
  const readDiagnosis = (d: unknown, actions: string[]): Diagnosis => {
    if (
      !record(d) ||
      !strings(d.components, componentIds, componentIds.length) ||
      !str(d.functionText) ||
      !str(d.reasoning) ||
      !str(d.action, 100) ||
      (d.action !== "" && !actions.includes(d.action))
    )
      return fail();
    return {
      components: [...d.components],
      functionText: d.functionText,
      reasoning: d.reasoning,
      action: d.action,
    };
  };
  const tickets: Record<string, TicketProgress> = {};
  for (const [id, p] of Object.entries(v.tickets)) {
    const ticket = pack.tickets.find((t) => t.id === id)!;
    if (
      !record(p) ||
      !date(p.assignedAt) ||
      !str(p.notes, 12000) ||
      !integer(p.hintsUsed, 0, ticket.hints.length) ||
      !strings(
        p.evidence,
        ticket.evidence.map((e) => e.id),
      ) ||
      !Array.isArray(p.attempts) ||
      p.attempts.length > 500 ||
      (p.completedAt !== undefined && !date(p.completedAt))
    )
      return fail();
    const actions = ticket.actions.map((a) => a.id);
    const attempts: Attempt[] = p.attempts.map((a) => {
      if (
        !record(a) ||
        !date(a.at) ||
        !integer(a.points, 0, 13) ||
        !integer(a.hintsUsed, 0, ticket.hints.length) ||
        ![
          "componentCorrect",
          "functionCorrect",
          "reasoningCorrect",
          "actionCorrect",
          "resolved",
          "scoring",
        ].every((k) => typeof a[k] === "boolean")
      )
        return fail();
      return {
        ...readDiagnosis(a, actions),
        at: a.at,
        points: a.points,
        hintsUsed: a.hintsUsed,
        componentCorrect: a.componentCorrect as boolean,
        functionCorrect: a.functionCorrect as boolean,
        reasoningCorrect: a.reasoningCorrect as boolean,
        actionCorrect: a.actionCorrect as boolean,
        resolved: a.resolved as boolean,
        scoring: a.scoring as boolean,
      };
    });
    tickets[id] = {
      assignedAt: p.assignedAt,
      notes: p.notes,
      hintsUsed: p.hintsUsed,
      evidence: [...p.evidence],
      draft: readDiagnosis(p.draft, actions),
      attempts,
      ...(p.completedAt ? { completedAt: p.completedAt as string } : {}),
    };
  }
  // Copy known fields only. Imported objects never become executable HTML or property paths.
  const profile = syncProgress(
    {
      schemaVersion: 1,
      id: v.id,
      name: v.name.trim(),
      packId: pack.id,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      shiftStartedAt: v.shiftStartedAt,
      tickets,
      order: [...v.order],
      inspected: [...v.inspected],
      ...(practice ? { practice } : {}),
      unlockedTickets: [...v.unlockedTickets],
      settings: {
        unlockAll: v.settings.unlockAll as boolean,
        scoring: v.settings.scoring as boolean,
        hints: v.settings.hints as boolean,
        order: v.settings.order as "sequential" | "random",
      },
      statistics: {
        shifts: v.statistics.shifts,
        visits: v.statistics.visits,
        submissions: v.statistics.submissions,
      },
    },
    pack,
  );
  return { ...profile, updatedAt: v.updatedAt };
}
export function readProfiles(pack: ScenarioPack): {
  profiles: Profile[];
  warning: string;
} {
  const profiles: Profile[] = [];
  let warning = "";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(PROFILE_PREFIX)) continue;
      try {
        const raw: unknown = JSON.parse(localStorage.getItem(key)!);
        // Other scenario packs are left untouched and appear when that pack is active.
        if (record(raw) && raw.packId !== pack.id) continue;
        const p = validateProfile(raw, pack);
        if (key !== profileKey(p.id, p.packId))
          throw new Error("Profile key mismatch");
        profiles.push(p);
      } catch {
        warning =
          "A saved profile could not be read. Its stored data has been left untouched. You can start a different profile or import a valid export.";
      }
    }
  } catch {
    warning =
      "Browser storage is unavailable. This shift can run in memory; export progress before closing this page.";
  }
  return {
    profiles: profiles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    warning,
  };
}
export function readCourseProfiles(packs: readonly ScenarioPack[]) {
  const weeks = packs.map(readProfiles);
  return {
    profiles: weeks
      .flatMap((week) => week.profiles)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    warning: weeks.find((week) => week.warning)?.warning ?? "",
  };
}
export function saveProfile(profile: Profile): boolean {
  try {
    localStorage.setItem(
      profileKey(profile.id, profile.packId),
      JSON.stringify(profile),
    );
    return true;
  } catch {
    return false;
  }
}
export function deleteProfile(id: string, packId = originalPackId) {
  localStorage.removeItem(profileKey(id, packId));
}
export function parseImport(
  text: string,
  packs: ScenarioPack | readonly ScenarioPack[],
): Profile {
  if (text.length > 2_000_000)
    throw new Error("Progress files must be smaller than 2 MB.");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error(
      "This file is not valid JSON. Select a Riverside progress export.",
    );
  }
  if (
    !record(value) ||
    value.format !== "riverside-progress" ||
    value.version !== 1
  )
    throw new Error("Select a Riverside progress export (version 1).");
  const incomingPackId = record(value.profile) ? value.profile.packId : null;
  const pack =
    "id" in packs
      ? packs
      : packs.find((candidate) => candidate.id === incomingPackId);
  if (!pack)
    throw new Error("This progress file is for an unavailable Riverside week.");
  return validateProfile(value.profile, pack);
}
export function exportProgress(profile: Profile) {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          format: "riverside-progress",
          version: 1,
          exportedAt: new Date().toISOString(),
          profile,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `riverside-${profile.packId}-${profile.name.replace(/[^a-z0-9]/gi, "-").slice(0, 40)}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
