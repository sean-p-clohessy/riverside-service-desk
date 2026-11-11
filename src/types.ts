export type ComponentId = string;
export interface ComponentInfo {
  id: ComponentId;
  name: string;
  shortName: string;
  category: string;
  function: string;
  need: string;
  specs: string;
  misconception: string;
  diagram: string;
}
export interface Machine {
  asset: string;
  model: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  psu: string;
  os: string;
  connections?: string;
}
export interface ConceptRubric {
  groups: string[][];
  criteria?: string[];
  guidance: string;
  example: string;
}
export interface Ticket {
  id: string;
  number: number;
  title: string;
  summary: string;
  tier: number;
  user: string;
  department: string;
  location: string;
  priority: "Low" | "Normal" | "High";
  report: string;
  machine: Machine;
  evidence: { id: string; title: string; body: string }[];
  expected: ComponentId[];
  functionRubric: ConceptRubric;
  reasoningRubric: ConceptRubric;
  actions: { id: string; label: string; correct: boolean; feedback: string }[];
  hints: string[];
  resolution: string;
}
export interface ScenarioPack {
  id: string;
  version: number;
  week: number;
  title: string;
  subtitle: string;
  unit: string;
  brief: string;
  tiers: { name: string; description: string }[];
  inspectionMode?: "workstation" | "catalog";
  lab?: "peripherals";
  components: ComponentInfo[];
  tickets: Ticket[];
  practiceIds?: string[];
}
export interface Diagnosis {
  components: ComponentId[];
  functionText: string;
  reasoning: string;
  action: string;
}
export interface Attempt extends Diagnosis {
  at: string;
  componentCorrect: boolean;
  functionCorrect: boolean;
  reasoningCorrect: boolean;
  actionCorrect: boolean;
  points: number;
  resolved: boolean;
  scoring: boolean;
  hintsUsed: number;
}
export interface TicketProgress {
  assignedAt: string;
  notes: string;
  evidence: string[];
  hintsUsed: number;
  draft: Diagnosis;
  attempts: Attempt[];
  completedAt?: string;
}
export interface TeacherSettings {
  unlockAll: boolean;
  scoring: boolean;
  hints: boolean;
  order: "sequential" | "random";
}
export interface Profile {
  schemaVersion: 1;
  id: string;
  name: string;
  packId: string;
  createdAt: string;
  updatedAt: string;
  shiftStartedAt: string;
  tickets: Record<string, TicketProgress>;
  order: string[];
  settings: TeacherSettings;
  inspected: string[];
  practice?: { passed: string[]; comparison: string };
  unlockedTickets: string[];
  statistics: { shifts: number; visits: number; submissions: number };
}
