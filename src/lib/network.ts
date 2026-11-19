import type { NetworkProgress, NetworkTest } from "../types.ts";
import {
  networkLinks,
  networkNodes,
  networkStartLinks,
} from "../data/week9Network.ts";

export function emptyNetwork(): NetworkProgress {
  return {
    links: [...networkStartLinks],
    tests: [],
    descriptions: ["network-interface", "network-switch", "network-router"].map(
      (component) => ({ component, text: "" }),
    ),
  };
}

export function networkResult(test: NetworkTest) {
  const destination =
    test.target === "link"
      ? test.source === "pc"
        ? "switch"
        : "ap"
      : test.target;
  const pending: string[][] = [[test.source]];
  const visited = new Set<string>();
  let route: string[] = [];
  while (pending.length) {
    const path = pending.shift()!;
    const last = path.at(-1)!;
    if (last === destination) {
      route = path;
      break;
    }
    if (visited.has(last)) continue;
    visited.add(last);
    for (const link of networkLinks) {
      if (link.from === last) pending.push([...path, link.to]);
      else if (link.to === last) pending.push([...path, link.from]);
    }
  }
  const reached = [test.source as string];
  let missing: (typeof networkLinks)[number] | undefined;
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1],
      b = route[i];
    const link = networkLinks.find(
      (item) =>
        (item.from === a && item.to === b) ||
        (item.from === b && item.to === a),
    )!;
    if (!test.links.includes(link.id)) {
      missing = link;
      break;
    }
    reached.push(b);
  }
  const passed = !missing && reached.at(-1) === destination;
  const names = reached.map(
    (id) => networkNodes.find((node) => node.id === id)!.name,
  );
  const messages = {
    link:
      test.source === "pc"
        ? "Ethernet link detected between this PC and the switch. Test a resource to check access beyond the link."
        : "Laptop associated with Riverside-Lab Wi-Fi. Test a resource to check the access point's uplink.",
    printer:
      "Printer reached and a simulated test page printed. This confirms the route and output in this exercise.",
    files:
      "The authorised class folder opened. This confirms access to this local resource in this exercise.",
    internet:
      "The test website loaded through the router and provider connection in this exercise.",
  };
  return {
    passed,
    route,
    reached,
    names,
    message: passed
      ? messages[test.target]
      : `Connection stops before ${networkNodes.find((node) => node.id === destination)!.name}. Check ${missing?.label ?? "the selected route"}.`,
  };
}

export function networkEvidence(network: NetworkProgress): string[] {
  return network.tests.flatMap((test) => {
    const result = networkResult(test);
    return [
      `${new Date(test.at).toLocaleString("en-GB")} · ${test.source === "pc" ? "Classroom PC" : "Learner laptop"} → ${test.target} · ${result.passed ? "Passed" : "Check required"}`,
      `Route reached: ${result.names.join(" → ")}`,
      `Result: ${result.message}`,
    ];
  });
}
