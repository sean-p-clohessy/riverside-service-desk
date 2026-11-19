import {
  Cable,
  Globe,
  Laptop,
  Monitor,
  Printer,
  Router,
  Server,
  Wifi,
  Network,
} from "lucide-react";
import { networkLinks, networkNodes } from "../data/week9Network.ts";

export function NetworkNodeIcon({
  id,
  size = 23,
}: {
  id: string;
  size?: number;
}) {
  const icons = {
    pc: Monitor,
    laptop: Laptop,
    ap: Wifi,
    switch: Network,
    printer: Printer,
    files: Server,
    router: Router,
    modem: Cable,
    internet: Globe,
  };
  const Icon = icons[id as keyof typeof icons] ?? Network;
  return <Icon size={size} aria-hidden="true" />;
}

export default function NetworkDiagram({
  links,
  selected,
  onSelect,
  path = [],
}: {
  links: readonly string[];
  selected?: string;
  onSelect?: (id: string) => void;
  path?: string[];
}) {
  return (
    <div
      className="network-diagram-region"
      role="region"
      aria-label="College network diagram"
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="network-floorplan">
        <svg
          viewBox="0 0 1000 440"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="network-wires"
        >
          {networkLinks.map((link) => {
            const from = networkNodes.find((node) => node.id === link.from)!;
            const to = networkNodes.find((node) => node.id === link.to)!;
            const a = path.indexOf(link.from),
              b = path.indexOf(link.to);
            const traced = a >= 0 && b >= 0 && Math.abs(a - b) === 1;
            return (
              <line
                key={link.id}
                x1={from.x * 10}
                y1={from.y * 4.4}
                x2={to.x * 10}
                y2={to.y * 4.4}
                className={`${links.includes(link.id) ? "connected" : "disconnected"} ${traced ? "traced" : ""}`}
              />
            );
          })}
        </svg>
        {networkNodes.map((node) => {
          const contents = (
            <>
              <NetworkNodeIcon id={node.id} />
              <strong>{node.name}</strong>
              <span>{node.port}</span>
            </>
          );
          const className = `network-node ${selected === node.id ? "selected" : ""} ${path.includes(node.id) ? "on-route" : ""}`;
          const style = { left: `${node.x}%`, top: `${node.y}%` };
          return onSelect ? (
            <button
              key={node.id}
              type="button"
              className={className}
              style={style}
              aria-label={`Inspect ${node.name.toLowerCase()}`}
              aria-pressed={selected === node.id}
              data-diagram-part={node.id}
              onClick={() => onSelect(node.id)}
            >
              {contents}
            </button>
          ) : (
            <div key={node.id} className={className} style={style}>
              {contents}
            </div>
          );
        })}
        <span className="network-map-caption">
          RIVERSIDE / TEACHING NETWORK
        </span>
      </div>
    </div>
  );
}
