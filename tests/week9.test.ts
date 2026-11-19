import { test } from "node:test";
import assert from "node:assert/strict";
import { coursePacks, pack, scenarioPacks } from "../src/data/config.ts";
import { networkLinks } from "../src/data/week9Network.ts";
import { networkResult } from "../src/lib/network.ts";
import {
  createProfile,
  emptyProgress,
  evaluate,
  evidenceSummary,
  resetProfile,
  startWeek,
} from "../src/lib/engine.ts";
import { parseImport, validateProfile } from "../src/lib/storage.ts";
import { parseRoute } from "../src/lib/routes.ts";
import type { NetworkTest } from "../src/types.ts";

const week9 = scenarioPacks["week9-network"];
const connected = networkLinks.map((link) => link.id);
const check = (
  source: NetworkTest["source"],
  target: NetworkTest["target"],
  removed: string[] = [],
) =>
  networkResult({
    source,
    target,
    links: connected.filter((id) => !removed.includes(id)),
    at: new Date().toISOString(),
  });

test("new shifts land on Week 9 and archived week links still resolve", () => {
  assert.deepEqual(parseRoute(""), { packId: week9.id, view: "lesson" });
  assert.deepEqual(parseRoute("#week-9/network"), {
    packId: week9.id,
    view: "network",
  });
  assert.equal(parseRoute("#week-8/lesson").packId, "week8-peripherals");
  assert.equal(parseRoute("#ticket/w7-001").packId, pack.id);
});

test("local routes stay available when the router or provider connection is absent", () => {
  for (const removed of [["modem-internet"], ["switch-router"]]) {
    assert.equal(check("pc", "printer", removed).passed, true);
    assert.equal(check("pc", "files", removed).passed, true);
    assert.equal(check("pc", "internet", removed).passed, false);
  }
  assert.deepEqual(check("pc", "internet").reached, [
    "pc",
    "switch",
    "router",
    "modem",
    "internet",
  ]);
});

test("Wi-Fi association alone cannot pass local-resource or internet tests", () => {
  const removed = ["ap-switch"];
  assert.equal(check("laptop", "link", removed).passed, true);
  assert.equal(check("laptop", "files", removed).passed, false);
  assert.equal(check("laptop", "internet", removed).passed, false);
  assert.deepEqual(check("laptop", "files", removed).reached, ["laptop", "ap"]);
  assert.equal(check("pc", "files", removed).passed, true);
});

test("Week 9 report and JSON preserve test connections and original writing", () => {
  const learner = createProfile("Sarah", week9);
  learner.network!.tests.push({
    source: "pc",
    target: "printer",
    links: [...connected],
    at: new Date().toISOString(),
  });
  learner.network!.links = connected.filter((id) => id !== "pc-switch");
  learner.network!.descriptions[0].text =
    "The PC interface sends and receives the print data.";
  learner.practice!.comparison =
    "I reached the printer through the switch. I would print a test page next.";
  const imported = parseImport(
    JSON.stringify({
      format: "riverside-progress",
      version: 1,
      profile: learner,
    }),
    coursePacks,
  );
  assert.deepEqual(imported.network, learner.network);
  assert.equal(networkResult(imported.network!.tests[0]).passed, true);
  assert.match(
    evidenceSummary(imported, week9),
    /Classroom PC → Classroom switch → Shared printer/,
  );
  assert.match(
    evidenceSummary(imported, week9),
    /The PC interface sends and receives the print data/,
  );
  assert.match(evidenceSummary(imported, week9), /print a test page next/);
  const malformed = structuredClone(learner);
  malformed.network!.tests[0].links.push("unknown-link");
  assert.throws(() => validateProfile(malformed, week9));
  const duplicate = structuredClone(learner);
  duplicate.network!.tests.push(duplicate.network!.tests[0]);
  assert.throws(() => validateProfile(duplicate, week9));
});

test("network shifts and resets preserve earlier weeks and separate learner work", () => {
  const archived = createProfile("Sarah", pack);
  const before = JSON.stringify(archived);
  const network = startWeek(archived, week9);
  network.network!.descriptions[0].text = "My own description";
  const other = createProfile("Jack", week9);
  assert.equal(other.network!.descriptions[0].text, "");
  assert.equal(JSON.stringify(archived), before);
  assert.equal(resetProfile(network, week9).network!.descriptions[0].text, "");
  assert.equal(network.network!.descriptions[0].text, "My own description");
});

test("all four Week 9 model answers resolve using the displayed criteria", () => {
  const learner = createProfile("Case verifier", week9);
  assert.equal(learner.unlockedTickets.length, 4);
  for (const ticket of week9.tickets) {
    const progress = emptyProgress();
    progress.draft = {
      components: [...ticket.expected],
      functionText: ticket.functionRubric.example,
      reasoning: ticket.reasoningRubric.example,
      action: ticket.actions.find((action) => action.correct)!.id,
    };
    const result = evaluate(ticket, progress, true);
    assert.equal(result.resolved, true, ticket.id);
    assert.equal(result.points, 13, ticket.id);
  }
});
