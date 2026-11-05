import { test } from "node:test";
import assert from "node:assert/strict";
import { pack } from "../src/data/config.ts";
import { matchesConcepts, missingIdeas } from "../src/lib/engine.ts";
test("ticket 1 accepts ordinary Level 2 reasoning without demanding application names", () => {
  const rubric = pack.tickets[0].reasoningRubric;
  for (const text of [
    "It holds the data she is currently using.",
    "RAM holds temporary data for her programmes.",
    "She has several apps open at once.",
    "The RAM is not permanent storage. It holds the data the applications are currently using.",
  ])
    assert.equal(matchesConcepts(text, rubric.groups), true, text);
  for (const text of [
    "RAM is the best part of the computer.",
    "It stores all her files permanently.",
    "RAM does not hold the data the applications are currently using.",
  ])
    assert.equal(matchesConcepts(text, rubric.groups), false, text);
  assert.equal(missingIdeas("She has applications.", rubric).length, 1);
});
test("a negative sentence cannot erase a following correct explanation", () => {
  assert.equal(
    matchesConcepts(
      "It is not permanent storage. RAM temporarily holds active application data.",
      pack.tickets[0].functionRubric.groups,
    ),
    true,
  );
});
test("every reasoning rule has a learner-readable explanation for each required idea", () => {
  for (const t of pack.tickets)
    assert.equal(
      t.reasoningRubric.criteria?.length,
      t.reasoningRubric.groups.length,
      t.id,
    );
});
