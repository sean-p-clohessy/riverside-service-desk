import { test } from "node:test";
import assert from "node:assert/strict";
import { pack } from "../src/data/config.ts";
import {
  createProfile,
  emptyProgress,
  evaluate,
  evidenceSummary,
  matchesConcepts,
  resetProfile,
  stats,
  submit,
  syncProgress,
} from "../src/lib/engine.ts";
import {
  parseImport,
  PROFILE_PREFIX,
  readProfiles,
  saveProfile,
  deleteProfile,
} from "../src/lib/storage.ts";

test("all twelve ticket model answers resolve for 13 points and complete natural progression", () => {
  let learner = createProfile("Sarah", pack);
  assert.equal(learner.unlockedTickets.length, 3);
  for (const t of pack.tickets) {
    assert.ok(
      learner.unlockedTickets.includes(t.id),
      `${t.id} must unlock naturally`,
    );
    learner.tickets[t.id] = {
      ...emptyProgress(),
      draft: {
        components: [...t.expected],
        functionText: t.functionRubric.example,
        reasoning: t.reasoningRubric.example,
        action: t.actions.find((a) => a.correct)!.id,
      },
    };
    learner = syncProgress(submit(learner, t), pack);
    const a = learner.tickets[t.id].attempts[0];
    assert.ok(
      a.componentCorrect &&
        a.functionCorrect &&
        a.reasoningCorrect &&
        a.actionCorrect,
      `${t.id} model answer must meet all checks`,
    );
    assert.equal(a.points, 13);
    assert.ok(a.resolved);
  }
  assert.equal(stats(learner, pack).score, 156);
  assert.equal(stats(learner, pack).accuracy, 100);
  assert.equal(stats(learner, pack).resolved, 12);
  const report = evidenceSummary(learner, pack);
  assert.match(report, /Sarah/);
  assert.match(report, /Resolved: 12/);
  assert.match(report, /GPU, PSU/);
  assert.match(report, /Technician notes/);
});

test("incorrect, hinted and retried answers retain evidence and reduce component points without farming", () => {
  const t = pack.tickets[0];
  let learner = createProfile("Jack", pack);
  learner.tickets[t.id] = {
    ...emptyProgress(),
    draft: {
      components: ["ssd"],
      functionText: "An SSD stores files permanently.",
      reasoning: "I think the drive saves files on shutdown.",
      action: "drive",
    },
  };
  learner = submit(learner, t);
  assert.equal(learner.tickets[t.id].attempts[0].resolved, false);
  assert.equal(stats(learner, pack).resolved, 0);
  learner.tickets[t.id].hintsUsed = 1;
  learner.tickets[t.id].draft = {
    components: ["ram"],
    functionText: t.functionRubric.example,
    reasoning: t.reasoningRubric.example,
    action: "guide",
  };
  learner = submit(learner, t);
  assert.equal(learner.tickets[t.id].attempts[1].points, 10);
  assert.equal(learner.tickets[t.id].attempts.length, 2);
  assert.equal(stats(learner, pack).score, 10);
  assert.equal(stats(learner, pack).accuracy, 0);
  learner = submit(learner, t);
  assert.equal(
    learner.tickets[t.id].attempts.length,
    2,
    "a completed ticket cannot be resubmitted",
  );
  const p = emptyProgress();
  p.draft = { ...learner.tickets[t.id].draft };
  p.attempts = [...learner.tickets[t.id].attempts];
  assert.equal(
    evaluate(t, p, true).points,
    9,
    "third attempt has one component point plus eight other points",
  );
  assert.equal(evaluate(t, p, false).points, 0);
});

test("multi-component tickets require the whole relevant set with no distractors", () => {
  const t = pack.tickets[11],
    p = emptyProgress();
  p.draft = {
    components: ["gpu"],
    functionText: t.functionRubric.example,
    reasoning: t.reasoningRubric.example,
    action: "paired",
  };
  assert.equal(evaluate(t, p, true).componentCorrect, false);
  p.draft.components = ["psu", "gpu"];
  assert.equal(evaluate(t, p, true).resolved, true);
  p.draft.components.push("ram");
  assert.equal(evaluate(t, p, true).componentCorrect, false);
});

test("key-idea checks reject empty, short and negated claims", () => {
  const groups = pack.tickets[0].functionRubric.groups;
  assert.equal(matchesConcepts("", groups), false);
  assert.equal(matchesConcepts("temporary data", groups), false);
  assert.equal(
    matchesConcepts(
      "RAM does not temporarily hold active application data.",
      groups,
    ),
    false,
  );
  assert.equal(
    matchesConcepts(
      "It temporarily holds information for running programs.",
      groups,
    ),
    true,
  );
});

test("export/import validates shape, active pack, allowed values and file size", () => {
  const p = createProfile("Test Technician", pack);
  p.tickets[pack.tickets[0].id] = {
    ...emptyProgress(),
    notes: "<script>not executable</script>",
  };
  const wrap = (profile: unknown) =>
    JSON.stringify({ format: "riverside-progress", version: 1, profile });
  assert.deepEqual(parseImport(wrap(p), pack).tickets, p.tickets);
  assert.throws(() => parseImport("not json", pack), /valid JSON/);
  assert.throws(() => parseImport("{}", pack), /Riverside progress/);
  assert.throws(
    () => parseImport(wrap({ ...p, packId: "different-week" }), pack),
    /active scenario/,
  );
  assert.throws(() => parseImport(wrap({ ...p, statistics: null }), pack));
  assert.throws(() =>
    parseImport(wrap({ ...p, order: ["fake-ticket"] }), pack),
  );
  assert.throws(() =>
    parseImport(wrap({ ...p, inspected: ["__proto__"] }), pack),
  );
  assert.throws(() => parseImport("x".repeat(2_000_001), pack), /2 MB/);
});

test("separate local profiles, refresh reads, reset and delete never modify another profile", () => {
  const data = new Map<string, string>();
  const storage = {
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i],
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
  });
  const sarah = createProfile("Sarah", pack),
    jack = createProfile("Jack", pack);
  sarah.tickets[pack.tickets[0].id] = {
    ...emptyProgress(),
    notes: "Sarah only",
  };
  saveProfile(sarah);
  saveProfile(jack);
  const refreshed = readProfiles(pack).profiles;
  assert.equal(refreshed.length, 2);
  assert.equal(
    refreshed.find((p) => p.id === sarah.id)!.tickets[pack.tickets[0].id].notes,
    "Sarah only",
  );
  assert.equal(
    Object.keys(refreshed.find((p) => p.id === jack.id)!.tickets).length,
    0,
  );
  saveProfile(resetProfile(jack, pack));
  deleteProfile(jack.id);
  assert.equal(data.get(PROFILE_PREFIX + sarah.id), JSON.stringify(sarah));
  assert.equal(readProfiles(pack).profiles.length, 1);
  data.set(PROFILE_PREFIX + "broken", "invalid JSON");
  assert.ok(readProfiles(pack).warning);
  assert.equal(
    data.get(PROFILE_PREFIX + "broken"),
    "invalid JSON",
    "corrupt records are preserved",
  );
});

test("teacher unlocking and scoring controls are scoped to the active learner", () => {
  const a = createProfile("A", pack),
    b = createProfile("B", pack);
  a.settings.unlockAll = true;
  assert.equal(syncProgress(a, pack).unlockedTickets.length, 12);
  assert.equal(syncProgress(b, pack).unlockedTickets.length, 3);
  a.settings.unlockAll = false;
  assert.equal(syncProgress(a, pack).unlockedTickets.length, 3);
  assert.equal(resetProfile(a, pack).settings.unlockAll, false);
});
