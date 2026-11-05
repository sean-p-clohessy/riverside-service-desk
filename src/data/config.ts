import type { ScenarioPack } from "../types.ts";
import { components } from "./components.ts";
import { week7Tickets } from "./week7Tickets.ts";
import { reasoningCriteria } from "./reasoningGuidance.ts";

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
};
// Register a future pack above, then change this key. UI, progress, library and rubric share the schema.
export const activePackId = "week7-workstation";
export const pack = scenarioPacks[activePackId];
