import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircuitBoard,
  Clock3,
  ExternalLink,
  FileText,
  Monitor,
  Plug,
  Search,
  Users,
} from "lucide-react";
import type { Profile, ScenarioPack } from "../types.ts";
import { components } from "../data/components.ts";
import {
  gatewayHardwareUnit,
  lessonPlan,
  peripherals,
  portPractice,
  ports,
  priceSnapshotDate,
} from "../data/week8Lab.ts";
import type { Peripheral, PortId } from "../data/week8Lab.ts";
import { routeHref } from "../lib/routes.ts";
import Workstation, { ComponentIcon } from "./Workstation.tsx";
import DiagramMagnifier from "./DiagramMagnifier.tsx";

const media = `${import.meta.env.BASE_URL}media/week8/`;
const price = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
const deskPositions: Record<string, [x: number, y: number]> = {
  webcam: [47, 8],
  monitor: [47, 30],
  speakers: [16, 25],
  printer: [85, 23],
  headset: [13, 53],
  microphone: [83, 54],
  keyboard: [42, 78],
  mouse: [69, 80],
  "external-ssd": [86, 83],
};
const labLinks = [
  { id: "explore", label: "Explore the desk", Icon: Monitor },
  { id: "ports", label: "Ports & connectors", Icon: Plug },
  { id: "inside", label: "Inside the PC", Icon: CircuitBoard },
  { id: "lesson", label: "Lesson & evidence", Icon: FileText },
];

export function DeskPreview() {
  return (
    <img
      className="desk-preview"
      src={`${media}desk.jpg`}
      width={1536}
      height={1024}
      alt="Monitor, webcam, keyboard, mouse, speaker, printer, headset, microphone and portable drive on an IT workbench"
    />
  );
}

function DeskDiagram({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (item: Peripheral) => void;
}) {
  return (
    <div className="desk-interactive" aria-label="Interactive desk illustration">
      <DeskPreview />
      {peripherals
        .filter((item) => item.id in deskPositions)
        .map((item) => {
          const [left, top] = deskPositions[item.id];
          return (
            <button
              type="button"
              className="desk-hotspot"
              key={item.id}
              data-diagram-part={item.id}
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={`Inspect ${item.shortName} on the desk`}
              aria-pressed={selected === item.id}
              onClick={() => onSelect(item)}
            >
              <span className="hotspot-dot" aria-hidden="true" />
              <span className="hotspot-name">{item.shortName}</span>
            </button>
          );
        })}
    </div>
  );
}

function DevicePhoto({
  device,
  className = "",
}: {
  device: Peripheral;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`device-photo ${className}`}
      style={{
        backgroundImage: `url(${media}peripherals.jpg)`,
        backgroundPosition: `${(device.tile % 4) * (100 / 3)}% ${Math.floor(device.tile / 4) * (100 / 3)}%`,
      }}
    />
  );
}

function SocketShape({ id }: { id: PortId }) {
  const contacts: Partial<Record<PortId, number>> = {
    vga: 15,
    dvi: 24,
    rj45: 8,
    rj11: 4,
  };
  return (
    <span className={`socket-figure socket-${id}`} aria-hidden="true">
      {id === "wifi" || id === "bluetooth" ? (
        <span className="wireless-symbol">
          {id === "wifi" ? "Wi-Fi" : "BT"}
        </span>
      ) : (
        <span className="socket-body">
          <span className="socket-inset">
            {contacts[id] ? (
              <span className="socket-pins">
                {Array.from({ length: contacts[id]! }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
            ) : (
              <i className="socket-tongue" />
            )}
          </span>
        </span>
      )}
      {id === "thunderbolt" && <span className="socket-mark">⚡</span>}
    </span>
  );
}

type Props = {
  pack: ScenarioPack;
  profile: Profile;
  view: string;
  update: (apply: (profile: Profile) => Profile) => void;
  navigate: (view: string) => void;
};

export default function PeripheralLab({
  pack,
  profile,
  view,
  update,
  navigate,
}: Props) {
  const [deviceId, setDeviceId] = useState("monitor");
  const [partId, setPartId] = useState("gpu");
  const [portId, setPortId] = useState<PortId>("hdmi");
  const [search, setSearch] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const detail = useRef<HTMLElement>(null);
  const portDetail = useRef<HTMLElement>(null);
  const device = peripherals.find((item) => item.id === deviceId)!;
  const inside = components.find((item) => item.id === partId)!;
  const related = components.find((item) => item.id === device.inside)!;
  const port = ports.find((item) => item.id === portId)!;
  const page = view === "dashboard" ? "explore" : view;
  const practice = profile.practice ?? { passed: [], comparison: "" };
  const seen = peripherals.filter((item) =>
    profile.inspected.includes(item.id),
  ).length;
  const internalSeen = components.filter((item) =>
    profile.inspected.includes(item.id),
  ).length;
  const filtered = peripherals.filter((item) =>
    `${item.name} ${item.category} ${item.connections.join(" ")}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  function record(...ids: string[]) {
    update((current) => {
      if (ids.every((id) => current.inspected.includes(id))) return current;
      return {
        ...current,
        inspected: [...new Set([...current.inspected, ...ids])],
      };
    });
  }
  function focusPanel(ref: typeof detail) {
    requestAnimationFrame(() => {
      const panel = ref.current;
      if (!panel) return;
      const bounds = panel.getBoundingClientRect();
      if (bounds.top < 0 || bounds.top > window.innerHeight - 120)
        panel.scrollIntoView({ block: "start" });
      panel.focus({ preventScroll: true });
    });
  }
  function inspect(item: Peripheral, moveFocus = true) {
    setDeviceId(item.id);
    record(item.id);
    if (moveFocus) focusPanel(detail);
  }
  function trace(item: Peripheral) {
    setDeviceId(item.id);
    setPartId(item.inside);
    record(item.id, item.inside);
    navigate("inside");
  }
  function openPort(id: PortId) {
    setPortId(id);
    navigate("ports");
  }
  function savePractice(
    apply: (
      current: NonNullable<Profile["practice"]>,
    ) => NonNullable<Profile["practice"]>,
  ) {
    update((current) => {
      const previous = current.practice ?? { passed: [], comparison: "" };
      const next = apply(previous);
      return next === previous ? current : { ...current, practice: next };
    });
  }
  function checkAnswer(id: string, chosen: number, correct: number) {
    setAnswers((previous) => ({ ...previous, [id]: chosen }));
    if (chosen === correct)
      savePractice((current) =>
        current.passed.includes(id)
          ? current
          : { ...current, passed: [...current.passed, id] },
      );
  }

  return (
    <section className="peripheral-lab">
      <header className="lab-heading">
        <div>
          <h1>
            {page === "explore"
              ? "Explore the peripherals desk"
              : page === "ports"
                ? "Ports and connectors"
                : page === "inside"
                  ? "Inside the PC"
                  : "Your 90-minute shift"}
          </h1>
          <p>
            {page === "explore"
              ? "Choose a device to see what it does, how it connects and which part of the PC uses it."
              : page === "ports"
                ? "Match the plug to the socket, then check what the connection can carry."
                : page === "inside"
                  ? "Follow a peripheral into the workstation, then inspect any component in the case."
                  : "Explore on your own, work two requests with a partner and write an individual comparison."}
          </p>
        </div>
        <div
          className="lab-progress"
          aria-label={`${seen} of ${peripherals.length} peripherals explored`}
        >
          <span>
            <strong>
              {seen}/{peripherals.length}
            </strong>{" "}
            devices explored
          </span>
          <progress value={seen} max={peripherals.length} />
        </div>
      </header>
      <nav className="lab-nav" aria-label="Week 8 activities">
        {labLinks.map(({ id, label, Icon }) => (
          <a
            href={routeHref(pack, id)}
            key={id}
            aria-current={page === id ? "page" : undefined}
          >
            <Icon size={17} />
            {label}
          </a>
        ))}
        <a href={routeHref(pack, "queue")}>
          <Users size={17} />
          Pair tickets
          <ArrowRight size={15} className="lab-nav-arrow" />
        </a>
      </nav>

      {page === "explore" && (
        <div className="lab-explore-grid">
          <div className="lab-desk">
            <div className="workstation-tools">
              <DiagramMagnifier
                title="Peripheral desk"
                diagram={
                  <DeskDiagram
                    selected={deviceId}
                    onSelect={(item) => inspect(item, false)}
                  />
                }
                selectionLabel="Peripheral"
                items={peripherals.map(({ id, shortName }) => ({
                  id,
                  label: shortName,
                }))}
                selected={deviceId}
                onSelect={(id) =>
                  inspect(peripherals.find((item) => item.id === id)!, false)
                }
                details={
                  <>
                    <h3>{device.shortName}</h3>
                    <p>{device.look}</p>
                    <p>{device.function}</p>
                  </>
                }
              />
            </div>
            <DeskDiagram selected={deviceId} onSelect={inspect} />
          </div>
          <section
            ref={detail}
            tabIndex={-1}
            className="panel lab-detail"
            aria-labelledby="lab-device-title"
          >
            <div className="lab-detail-hero">
              <div>
                <span className="lab-device-kind">
                  {device.category} · Outside the PC
                </span>
                <h2 id="lab-device-title">{device.shortName}</h2>
                <p>{device.look}</p>
              </div>
              <DevicePhoto device={device} />
            </div>
            <div className="lab-detail-content">
              <div>
                <h3>Job and importance</h3>
                <p>
                  {device.function} {device.need}
                </p>
              </div>
              <div>
                <h3>How it connects</h3>
                <p>{device.connect}</p>
                <div className="lab-port-chips">
                  {device.connections.map((id) => (
                    <button type="button" key={id} onClick={() => openPort(id)}>
                      {ports.find((item) => item.id === id)!.name}
                      <ChevronRight size={13} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3>Performance</h3>
                <p>{device.specs}</p>
              </div>
              <div className="lab-price">
                <div>
                  <h3>Example UK cost</h3>
                  <strong>{price.format(device.price.gbp)}</strong>
                </div>
                <p>
                  {device.price.model} · {device.price.source}. {device.cost}
                </p>
                <a href={device.price.url} target="_blank" rel="noreferrer">
                  Price source
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="lab-trace">
                <h3>Inside the PC · {related.shortName}</h3>
                <p>{device.relationship}</p>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => trace(device)}
                >
                  Trace to the PC <ArrowRight size={15} />
                </button>
              </div>
              <div>
                <h3>Test it</h3>
                <p>{device.test}</p>
              </div>
              <details className="lab-misconception">
                <summary>Common mix-up</summary>
                <p>{device.misconception}</p>
              </details>
              <div className="lab-detail-footer">
                <small>
                  Price sources consulted {priceSnapshotDate}. Prices can
                  change.
                </small>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    inspect(
                      peripherals[
                        (peripherals.indexOf(device) + 1) % peripherals.length
                      ],
                    )
                  }
                >
                  Next device <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
          <section
            className="lab-device-catalog"
            aria-labelledby="lab-devices-title"
          >
            <div className="lab-catalog-heading">
              <h2 id="lab-devices-title">All peripherals</h2>
              <label className="lab-search">
                <Search size={16} aria-hidden="true" />
                <input
                  aria-label="Search peripherals"
                  placeholder="Device, type or port"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>
            <div className="lab-device-grid">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lab-device"
                  aria-pressed={deviceId === item.id}
                  onClick={() => inspect(item)}
                >
                  <DevicePhoto device={item} />
                  <span className="device-tile-label">
                    <strong>{item.shortName}</strong>
                    <small>{item.category}</small>
                  </span>
                  {profile.inspected.includes(item.id) && (
                    <Check
                      className="device-seen"
                      size={17}
                      aria-label="Explored"
                    />
                  )}
                </button>
              ))}
            </div>
            {!filtered.length && (
              <p className="muted">No peripherals match your search.</p>
            )}
          </section>
        </div>
      )}

      {page === "ports" && (
        <>
          <div className="lab-ports-layout">
            <section aria-labelledby="socket-library">
              <div className="lab-catalog-heading">
                <h2 id="socket-library">Connection library</h2>
                <DiagramMagnifier
                  title="Port diagram"
                  diagram={
                    <div className="socket-enlarged">
                      <SocketShape id={port.id} />
                    </div>
                  }
                  selectionLabel="Port or connector"
                  items={ports.map(({ id, name }) => ({ id, label: name }))}
                  selected={portId}
                  onSelect={setPortId}
                  details={
                    <>
                      <h3>{port.name}</h3>
                      <p>{port.shape}</p>
                      <p>{port.use}</p>
                    </>
                  }
                />
              </div>
              <p className="lab-vocabulary">
                A port is a socket on the equipment. A cable’s connector is the
                plug that fits it.
              </p>
              <div className="lab-socket-grid">
                {ports.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="lab-socket"
                    aria-pressed={portId === item.id}
                    onClick={() => {
                      setPortId(item.id);
                      focusPanel(portDetail);
                    }}
                  >
                    <SocketShape id={item.id} />
                    <strong>{item.name}</strong>
                    <small>{item.type}</small>
                  </button>
                ))}
              </div>
            </section>
            <section
              ref={portDetail}
              tabIndex={-1}
              className="panel lab-port-detail"
              aria-labelledby="selected-socket-title"
            >
              <SocketShape id={port.id} />
              <h2 id="selected-socket-title">{port.name}</h2>
              <p className="lab-device-kind">{port.type}</p>
              <h3>Recognise it</h3>
              <p>{port.shape}</p>
              <h3>What it connects</h3>
              <p>{port.use}</p>
              <h3>What to check</h3>
              <p>{port.check}</p>
              {"source" in port && (
                <a href={port.source} target="_blank" rel="noreferrer">
                  Technical reference <ExternalLink size={13} />
                </a>
              )}
              <p className="small muted">
                Shapes are simplified. Read the label on the actual device.
              </p>
            </section>
          </div>
          <section className="lab-practice" aria-labelledby="connection-checks">
            <div className="lab-catalog-heading">
              <div>
                <h2 id="connection-checks">Connection checks</h2>
                <p>Choose the connection or check you would use.</p>
              </div>
              <span className="lab-count">
                {practice.passed.length}/{portPractice.length} passed
              </span>
            </div>
            <div className="lab-practice-grid">
              {portPractice.map((check) => (
                <article key={check.id} className="panel lab-question">
                  <h3>{check.situation}</h3>
                  <div className="lab-answer-list">
                    {check.choices.map((choice, index) => (
                      <button
                        key={choice}
                        type="button"
                        aria-pressed={answers[check.id] === index}
                        onClick={() =>
                          checkAnswer(check.id, index, check.correct)
                        }
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                  {answers[check.id] !== undefined ? (
                    <p
                      role="status"
                      className={
                        answers[check.id] === check.correct
                          ? "lab-answer-correct"
                          : "lab-answer-review"
                      }
                    >
                      <strong>
                        {answers[check.id] === check.correct
                          ? "Correct. "
                          : "Review this choice. "}
                      </strong>
                      {check.explanation}
                    </p>
                  ) : practice.passed.includes(check.id) ? (
                    <p className="lab-answer-correct">
                      <Check size={14} /> Passed previously
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {page === "inside" && (
        <>
          <section
            className="panel lab-signal"
            aria-labelledby="lab-signal-title"
          >
            <div className="lab-catalog-heading">
              <h2 id="lab-signal-title">Trace a connection</h2>
              <label>
                Peripheral{" "}
                <select
                  value={device.id}
                  onChange={(event) => {
                    const next = peripherals.find(
                      (item) => item.id === event.target.value,
                    )!;
                    setDeviceId(next.id);
                    setPartId(next.inside);
                    record(next.id, next.inside);
                  }}
                >
                  {peripherals.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.shortName}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="lab-signal-grid">
              <div>
                <DevicePhoto device={device} />
                <span>Outside the case</span>
                <strong>{device.shortName}</strong>
                <p>{device.function}</p>
              </div>
              <div>
                <Plug size={27} />
                <span>Connection</span>
                <strong>
                  {
                    ports.find((item) => item.id === device.connections[0])!
                      .name
                  }
                </strong>
                <p>{device.connect}</p>
              </div>
              <div>
                <ComponentIcon component={related} size={30} />
                <span>Inside the case</span>
                <strong>{related.shortName}</strong>
                <p>{device.relationship}</p>
              </div>
            </div>
          </section>
          <div className="lab-inside-grid">
            <section
              className="panel lab-pc"
              aria-label="Inspect internal hardware"
            >
              <div className="lab-catalog-heading">
                <h2>Inspect the workstation</h2>
                <span className="lab-count">
                  {internalSeen}/{components.length} explored
                </span>
              </div>
              <Workstation
                components={components}
                selected={partId}
                onSelect={(id) => {
                  setPartId(id);
                  record(id);
                }}
              />
            </section>
            <section className="panel lab-port-detail" aria-live="polite">
              <span className="lab-device-kind">Internal component</span>
              <h2>{inside.shortName}</h2>
              <h3>Job and importance</h3>
              <p>
                {inside.function} {inside.need}
              </p>
              <h3>Performance and specifications</h3>
              <p>{inside.specs}</p>
              <h3>Common mix-up</h3>
              <p>{inside.misconception}</p>
              <div className="lab-inside-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setPartId(device.inside);
                    record(device.inside);
                  }}
                >
                  Highlight the {device.shortName.toLowerCase()} link
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => navigate("explore")}
                >
                  <ArrowLeft size={15} /> Back to the desk
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {page === "lesson" && (
        <div className="lab-lesson-grid">
          <section className="panel lab-agenda" aria-labelledby="agenda-title">
            <h2 id="agenda-title">
              <Clock3 size={19} /> Lesson sequence
            </h2>
            <ol>
              {lessonPlan.map((step) => (
                <li key={step.minutes}>
                  <span>{step.minutes}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.task}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="small muted">
              Supports hardware description for assessment criterion 3.1.{" "}
              <a href={gatewayHardwareUnit} target="_blank" rel="noreferrer">
                Gateway IT Technical Support unit <ExternalLink size={13} />
              </a>
            </p>
          </section>
          <section
            className="panel lab-comparison"
            aria-labelledby="comparison-title"
          >
            <h2 id="comparison-title">Individual comparison</h2>
            <p>
              Choose one peripheral and one internal component you explored. Use
              your own words.
            </p>
            <p>
              On the Riverside desktop, peripherals connect from outside the
              case. A laptop can build in the same functions, such as its
              keyboard and camera.
            </p>
            <ul>
              <li>Where is each part, and what does it do?</li>
              <li>What connects them or lets them work together?</li>
              <li>
                Which performance specification matters for the user’s task?
                Give a UK price example for the peripheral.
              </li>
              <li>What would you test to check that it works?</li>
            </ul>
            <label className="field">
              <span>Your comparison</span>
              <textarea
                value={practice.comparison}
                rows={8}
                maxLength={6000}
                onChange={(event) =>
                  savePractice((current) => ({
                    ...current,
                    comparison: event.target.value,
                  }))
                }
              />
            </label>
            <p className="small muted">
              Your comparison appears in your Week 8 session report.
            </p>
            <div className="lab-lesson-actions">
              <a className="button secondary" href={routeHref(pack, "queue")}>
                <Users size={16} /> Open pair tickets
              </a>
              <a className="button primary" href={routeHref(pack, "report")}>
                <FileText size={16} /> Open session report
              </a>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
