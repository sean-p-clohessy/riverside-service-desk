import type { ScenarioPack } from "../types.ts";
import { components } from "./components.ts";
import { week7Tickets } from "./week7Tickets.ts";
import { reasoningCriteria } from "./reasoningGuidance.ts";
import { peripherals, portPractice } from "./week8Lab.ts";
import { week8Tickets } from "./week8Tickets.ts";
import { networkComponents, networkGuideChecks } from "./week9Network.ts";
import { week9Tickets } from "./week9Tickets.ts";

export const teacherPin = "2707"; // Local convenience control. Public source; NOT authentication.
export const scenarioPacks: Record<string, ScenarioPack> = {
  "week7-workstation": {
    id: "week7-workstation",
    version: 1,
    week: 7,
    title: "Inside the Workstation",
    subtitle: "Week 7",
    unit: "Gateway Qualifications · Level 2 Technical Support · J/618/3687",
    inspectionMode: "workstation",
    brief:
      "Your first shift focuses on understanding what is inside a workstation. Investigate tickets, inspect system information and identify the components involved.",
    tiers: [
      {
        name: "Identify",
        description: "Recognise the component and its role.",
      },
      {
        name: "Explain",
        description: "Connect the component’s purpose to the request.",
      },
      {
        name: "Recommend",
        description: "Choose a suitable next step using the evidence.",
      },
      {
        name: "Mixed",
        description: "Compare plausible components and justify your decision.",
      },
    ],
    components,
    tickets: week7Tickets.map((ticket, index) => ({
      ...ticket,
      reasoningRubric: {
        ...ticket.reasoningRubric,
        criteria: reasoningCriteria[index],
      },
    })),
  },
  "week8-peripherals": {
    id: "week8-peripherals",
    version: 1,
    week: 8,
    title: "Peripherals",
    subtitle: "Week 8",
    unit: "Gateway Qualifications · Level 2 IT Technical Support · J/618/3687",
    inspectionMode: "catalog",
    lab: "peripherals",
    brief:
      "Explore the devices on a desk, follow their connections into the PC and solve requests that need both external and internal hardware.",
    tiers: [
      {
        name: "Pair investigations",
        description:
          "Choose two requests. Swap technician and verifier roles between tickets.",
      },
    ],
    components: [...components, ...peripherals],
    tickets: week8Tickets,
    practiceIds: portPractice.map((check) => check.id),
  },
  "week9-network": {
    id: "week9-network",
    version: 1,
    week: 9,
    title: "Networking components and connections",
    subtitle: "Week 9",
    unit: "Gateway Qualifications · Level 2 IT Technical Support · J/618/3687",
    inspectionMode: "catalog",
    lab: "network",
    brief:
      "Explore the college network, connect devices and test local resources and internet access. Investigate in pairs, then write your own evidence report.",
    tiers: [
      {
        name: "Network investigations",
        description:
          "Choose two requests and swap technician and verifier roles.",
      },
    ],
    components: networkComponents,
    tickets: week9Tickets,
    practiceIds: networkGuideChecks.map((check) => check.id),
  },
};
export const activePackId = "week9-network";
export const coursePacks = Object.values(scenarioPacks);
export const pack = scenarioPacks["week7-workstation"];
