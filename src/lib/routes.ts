import type { ScenarioPack } from "../types.ts";
import { activePackId, coursePacks, scenarioPacks } from "../data/config.ts";

export const labViews = ["explore", "ports", "inside", "lesson"];
const deskViews = [
  "dashboard",
  "queue",
  "my-tickets",
  "library",
  "performance",
  "report",
];
export const landingView = (pack: ScenarioPack) =>
  pack.lab === "peripherals" ? "explore" : "dashboard";

export function routeHref(pack: ScenarioPack, view = landingView(pack)) {
  return `#week-${pack.week}/${view}`;
}

export function parseRoute(hash: string): { packId: string; view: string } {
  const path = hash.replace(/^#/, "");
  const week = /^week-(\d+)(?:\/(.*))?$/.exec(path);
  const ticket = /^ticket\/[a-z0-9-]+$/i;
  const selected = week
    ? coursePacks.find((p) => p.week === Number(week[1]))
    : (coursePacks.find((p) =>
        p.tickets.some((t) => `ticket/${t.id}` === path),
      ) ?? (deskViews.includes(path) ? coursePacks[0] : undefined));
  const pack = selected ?? scenarioPacks[activePackId];
  const view = week ? week[2] : path;
  if (
    view &&
    (deskViews.includes(view) ||
      ticket.test(view) ||
      (pack.lab === "peripherals" && labViews.includes(view)))
  ) {
    return { packId: pack.id, view };
  }
  return { packId: pack.id, view: landingView(pack) };
}
