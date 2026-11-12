import {
  CircuitBoard,
  Cpu,
  MemoryStick,
  Zap,
  HardDrive,
  Disc3,
  Gpu,
  Network,
  Fan,
  Monitor,
} from "lucide-react";
import type { ComponentInfo } from "../types.ts";
import DiagramMagnifier from "./DiagramMagnifier.tsx";

export function ComponentIcon({
  component,
  size = 24,
}: {
  component: ComponentInfo;
  size?: number;
}) {
  const icons: Record<string, typeof Cpu> = {
    cpu: Cpu,
    ram: MemoryStick,
    motherboard: CircuitBoard,
    psu: Zap,
    ssd: HardDrive,
    hdd: Disc3,
    gpu: Gpu,
    network: Network,
    "cpu-cooling": Fan,
    "case-cooling": Fan,
  };
  const Icon = icons[component.diagram] ?? Monitor;
  return <Icon size={size} aria-hidden="true" strokeWidth={1.6} />;
}
export default function Workstation({
  components,
  selected,
  onSelect,
  compact = false,
  mode = "workstation",
}: {
  components: ComponentInfo[];
  selected?: string;
  onSelect?: (id: string) => void;
  compact?: boolean;
  mode?: "workstation" | "catalog";
}) {
  if (mode === "catalog")
    return (
      <div
        className="inspection-catalog"
        aria-label="Component inspection catalog"
      >
        {components.map((c) =>
          compact ? (
            <div key={c.id}>
              <ComponentIcon component={c} />
              <span>{c.shortName}</span>
            </div>
          ) : (
            <button
              key={c.id}
              type="button"
              aria-label={`Inspect ${c.shortName}`}
              aria-pressed={selected === c.id}
              className={selected === c.id ? "selected" : ""}
              onClick={() => onSelect?.(c.id)}
            >
              <ComponentIcon component={c} />
              <span>{c.shortName}</span>
            </button>
          ),
        )}
      </div>
    );
  const diagram = (
    <div
      className={`workstation ${compact ? "compact" : ""}`}
      aria-label={
        compact
          ? "Workstation internal layout illustration"
          : "Interactive workstation internal layout"
      }
    >
      <div className="case-caption">
        <span>RIVERSIDE / WORKSTATION</span>
        <span>INTERNAL VIEW</span>
      </div>
      <div className="case-board" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="case-cables" aria-hidden="true" />
      {components.map((c) =>
        compact ? (
          <div key={c.id} className={`pc-part part-${c.diagram}`}>
            <ComponentIcon
              component={c}
              size={c.id === "motherboard" ? 18 : 24}
            />
            <span>{c.shortName}</span>
          </div>
        ) : (
          <button
            key={c.id}
            type="button"
            className={`pc-part part-${c.diagram} ${selected === c.id ? "selected" : ""}`}
            data-diagram-part={c.id}
            aria-label={`Inspect ${c.shortName}`}
            aria-pressed={selected === c.id}
            onClick={() => onSelect?.(c.id)}
          >
            <ComponentIcon
              component={c}
              size={c.id === "motherboard" ? 18 : 24}
            />
            <span>{c.shortName}</span>
          </button>
        ),
      )}
      <div className="case-foot" aria-hidden="true">
        <i />
        <i />
      </div>
    </div>
  );
  if (compact || !onSelect) return diagram;

  const component = components.find(({ id }) => id === selected);
  return (
    <>
      <div className="workstation-tools">
        <DiagramMagnifier
          title="Workstation diagram"
          diagram={diagram}
          selectionLabel="Component"
          items={components.map(({ id, shortName }) => ({
            id,
            label: shortName,
          }))}
          selected={selected}
          onSelect={onSelect}
          details={component && (
            <>
              <h3>{component.name}</h3>
              <p>{component.function}</p>
              <p>{component.need}</p>
            </>
          )}
        />
      </div>
      {diagram}
    </>
  );
}
