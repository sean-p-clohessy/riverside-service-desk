import { test } from "node:test";
import assert from "node:assert/strict";
import { coursePacks, pack, scenarioPacks } from "../src/data/config.ts";
import { peripherals, ports, portPractice } from "../src/data/week8Lab.ts";
import {
  createProfile,
  emptyProgress,
  evaluate,
  evidenceSummary,
  resetProfile,
  startWeek,
  submit,
} from "../src/lib/engine.ts";
import {
  deleteProfile,
  parseImport,
  PROFILE_PREFIX,
  profileKey,
  readCourseProfiles,
  saveProfile,
} from "../src/lib/storage.ts";
import { parseRoute, routeHref } from "../src/lib/routes.ts";

const week8 = scenarioPacks["week8-peripherals"];
const exportJson = (profile: unknown) =>
  JSON.stringify({ format: "riverside-progress", version: 1, profile });

test("Week 8 can be opened directly and existing Week 7 bookmarks resolve to the archive", () => {
  assert.deepEqual(parseRoute(""), { packId: week8.id, view: "explore" });
  assert.deepEqual(parseRoute("#dashboard"), {
    packId: pack.id,
    view: "dashboard",
  });
  assert.deepEqual(parseRoute("#ticket/w7-001"), {
    packId: pack.id,
    view: "ticket/w7-001",
  });
  assert.deepEqual(parseRoute(routeHref(week8, "ports")), {
    packId: week8.id,
    view: "ports",
  });
  assert.deepEqual(parseRoute(routeHref(week8, "ticket/w8-005")), {
    packId: week8.id,
    view: "ticket/w8-005",
  });
});

test("every Week 8 request is open and needs a valid peripheral and internal component", () => {
  const learner = createProfile("Case verifier", week8);
  const deviceIds = new Set(peripherals.map((device) => device.id));
  const portIds = new Set(ports.map((port) => port.id));
  for (const device of peripherals) {
    assert.ok(
      week8.components.some(
        (part) => part.id === device.inside && !deviceIds.has(part.id),
      ),
      device.id,
    );
    assert.ok(
      device.connections.every((port) => portIds.has(port)),
      device.id,
    );
    assert.ok(
      device.price.gbp > 0 && device.price.url.startsWith("https://"),
      device.id,
    );
  }
  for (const ticket of week8.tickets) {
    assert.ok(learner.unlockedTickets.includes(ticket.id));
    assert.equal(ticket.expected.length, 2);
    assert.ok(
      deviceIds.has(ticket.expected[0]) && !deviceIds.has(ticket.expected[1]),
    );
    const progress = emptyProgress();
    progress.draft = {
      components: [...ticket.expected],
      functionText: ticket.functionRubric.example,
      reasoning: ticket.reasoningRubric.example,
      action: ticket.actions.find((action) => action.correct)!.id,
    };
    assert.equal(evaluate(ticket, progress, true).points, 13, ticket.id);
    assert.equal(evaluate(ticket, progress, true).resolved, true, ticket.id);
    progress.draft.components.pop();
    assert.equal(evaluate(ticket, progress, true).resolved, false, ticket.id);
  }
  const first = week8.tickets[0];
  const progress = emptyProgress();
  progress.draft.functionText = "The GPU shows the picture.";
  assert.equal(evaluate(first, progress, true).functionCorrect, false);
  progress.draft.functionText =
    "The screen shows the picture the graphics card sends.";
  assert.equal(evaluate(first, progress, true).functionCorrect, true);
});

test("starting, saving and resetting Week 8 preserves the legacy Week 7 record byte for byte", () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      get length() {
        return storage.size;
      },
      key: (index: number) => [...storage.keys()][index] ?? null,
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    },
  });
  const ticket = pack.tickets[0];
  const old = createProfile("Returning technician", pack);
  old.tickets[ticket.id] = {
    ...emptyProgress(),
    notes: "Original Week 7 notes",
    draft: {
      components: ["ram"],
      functionText: ticket.functionRubric.example,
      reasoning: ticket.reasoningRubric.example,
      action: ticket.actions.find((action) => action.correct)!.id,
    },
  };
  const archived = submit(old, ticket);
  const originalBytes = JSON.stringify(archived);
  storage.set(PROFILE_PREFIX + archived.id, originalBytes);
  const fresh = startWeek(archived, week8);
  assert.equal(fresh.id, archived.id);
  assert.deepEqual(fresh.tickets, {});
  const practiced = {
    ...fresh,
    inspected: ["monitor", "gpu"],
    practice: {
      passed: [portPractice[0].id],
      comparison: "The monitor shows the image from the graphics hardware.",
    },
  };
  assert.ok(saveProfile(practiced));
  const reloaded = readCourseProfiles(coursePacks);
  assert.equal(reloaded.warning, "");
  assert.deepEqual(
    reloaded.profiles.find((record) => record.packId === week8.id)?.practice,
    practiced.practice,
  );
  assert.equal(
    reloaded.profiles.find((record) => record.packId === pack.id)?.tickets[
      ticket.id
    ].notes,
    "Original Week 7 notes",
  );
  assert.match(evidenceSummary(practiced, week8), /Connection checks: 1\/6/);
  saveProfile(resetProfile(practiced, week8));
  deleteProfile(practiced.id, week8.id);
  assert.equal(storage.get(profileKey(archived.id, pack.id)), originalBytes);
  assert.equal(storage.size, 1);
  assert.equal(parseImport(exportJson(archived), coursePacks).packId, pack.id);
  assert.deepEqual(
    parseImport(exportJson(practiced), coursePacks).practice,
    practiced.practice,
  );
  assert.throws(() =>
    parseImport(
      exportJson({
        ...practiced,
        practice: { ...practiced.practice, passed: ["unknown"] },
      }),
      coursePacks,
    ),
  );
});
