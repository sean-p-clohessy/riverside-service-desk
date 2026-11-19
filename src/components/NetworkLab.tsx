import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Cable,
  FileText,
  Network,
  Users,
} from "lucide-react";
import type {
  NetworkProgress,
  NetworkTest,
  Profile,
  ScenarioPack,
} from "../types.ts";
import {
  networkComponents,
  networkDestinations,
  networkGuideChecks,
  networkLesson,
  networkLinks,
  networkNodes,
  networkReferences,
} from "../data/week9Network.ts";
import { emptyNetwork, networkResult } from "../lib/network.ts";
import { routeHref } from "../lib/routes.ts";
import NetworkDiagram, { NetworkNodeIcon } from "./NetworkDiagram.tsx";
import DiagramMagnifier from "./DiagramMagnifier.tsx";
import { ComponentIcon } from "./Workstation.tsx";

const activities = [
  { id: "lesson", name: "Lesson & evidence", Icon: FileText },
  { id: "network-guide", name: "Component guide", Icon: BookOpen },
  { id: "network", name: "College network", Icon: Network },
  { id: "queue", name: "Pair investigations", Icon: Users },
];

export default function NetworkLab({
  pack,
  profile,
  view,
  update,
}: {
  pack: ScenarioPack;
  profile: Profile;
  view: string;
  update: (fn: (profile: Profile) => Profile) => void;
}) {
  const [componentId, setComponentId] = useState("network-switch");
  const [nodeId, setNodeId] = useState("switch");
  const [source, setSource] = useState<NetworkTest["source"]>("pc");
  const [from, setFrom] = useState("pc");
  const [to, setTo] = useState("switch");
  const [connection, setConnection] = useState("ethernet");
  const [feedback, setFeedback] = useState("");
  const [guideFeedback, setGuideFeedback] = useState<Record<string, string>>(
    {},
  );
  const page = view === "dashboard" ? "lesson" : view;
  const network = profile.network ?? emptyNetwork();
  const practice = profile.practice ?? { passed: [], comparison: "" };
  const component = networkComponents.find((item) => item.id === componentId)!;
  const node = networkNodes.find((item) => item.id === nodeId)!;
  const nodeComponent = networkComponents.find(
    (item) => item.id === node.component,
  )!;
  const latest = network.tests.at(-1);
  const result = latest && networkResult(latest);
  const currentTest =
    latest &&
    latest.links.length === network.links.length &&
    latest.links.every((id) => network.links.includes(id));
  const highlightedPath = currentTest ? result?.reached : undefined;

  function save(apply: (current: NetworkProgress) => NetworkProgress) {
    update((current) => ({
      ...current,
      network: apply(current.network ?? emptyNetwork()),
    }));
  }
  function inspect(id: string) {
    setComponentId(id);
    update((current) =>
      current.inspected.includes(id)
        ? current
        : {
            ...current,
            inspected: [...current.inspected, id],
          },
    );
  }
  function selectNode(id: string) {
    setNodeId(id);
    const selected = networkNodes.find((item) => item.id === id)!;
    inspect(selected.component);
  }
  function connect(event: React.FormEvent) {
    event.preventDefault();
    const link = networkLinks.find(
      (item) =>
        (item.from === from && item.to === to) ||
        (item.from === to && item.to === from),
    );
    if (!link) {
      setFeedback(
        "For this college layout, connect wired endpoints to the classroom switch, the laptop to the access point, and the router to the modem. Read the link labels below.",
      );
      return;
    }
    if (link.kind !== connection) {
      setFeedback(
        link.kind === "wifi"
          ? "The laptop joins Riverside-Lab through Wi-Fi. Choose Wi-Fi association."
          : link.kind === "provider"
            ? "The modem's line connects to the provider. Choose Provider line."
            : "These two ports use an Ethernet lead. Choose Ethernet (RJ-45).",
      );
      return;
    }
    save((current) => ({
      ...current,
      links: [...new Set([...current.links, link.id])],
    }));
    setFeedback(
      `Connected ${link.label}. Run a resource test to check the full route.`,
    );
  }
  function test(target: NetworkTest["target"]) {
    save((current) => ({
      ...current,
      tests: [
        ...current.tests.filter(
          (entry) => entry.source !== source || entry.target !== target,
        ),
        {
          source,
          target,
          links: [...current.links],
          at: new Date().toISOString(),
        },
      ],
    }));
  }

  return (
    <section className="network-lab">
      <header className="lab-heading">
        <div>
          <h1>
            {page === "network-guide"
              ? "Meet the network components"
              : page === "network"
                ? "Build the college network"
                : "Your 90-minute network shift"}
          </h1>
          <p>
            {page === "network-guide"
              ? "Explore each role, compare specifications and check your understanding."
              : page === "network"
                ? "Connect equipment, trace a route and test what the learner needs to use."
                : "Learn the equipment, investigate with a partner and explain your evidence individually."}
          </p>
        </div>
      </header>
      <nav className="lab-nav" aria-label="Week 9 activities">
        {activities.map(({ id, name, Icon }) => (
          <a
            key={id}
            href={routeHref(pack, id)}
            aria-current={page === id ? "page" : undefined}
          >
            <Icon size={17} />
            {name}
          </a>
        ))}
      </nav>

      {page === "network-guide" && (
        <div className="network-guide-layout">
          <nav
            className="panel network-guide-index"
            aria-label="Network components"
          >
            {networkComponents.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.shortName}
                aria-description={
                  profile.inspected.includes(item.id)
                    ? "Explored this shift"
                    : undefined
                }
                aria-pressed={componentId === item.id}
                onClick={() => inspect(item.id)}
              >
                {item.shortName}
                {profile.inspected.includes(item.id) && (
                  <CheckCircle2 size={15} aria-hidden="true" />
                )}
              </button>
            ))}
          </nav>
          <article className="panel network-guide-detail">
            <span className="lab-device-kind">{component.category}</span>
            <h2>
              <ComponentIcon component={component} size={28} />
              {component.name}
            </h2>
            <h3>Job and importance</h3>
            <p>
              {component.function} {component.need}
            </p>
            <h3>Useful specifications</h3>
            <p>{component.specs}</p>
            <h3>What to check</h3>
            <p>{component.misconception}</p>
            {networkGuideChecks
              .filter((check) => check.component === componentId)
              .map((check) => (
                <fieldset key={check.id} className="network-guide-check">
                  <legend>{check.question}</legend>
                  {check.options.map((option, i) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        const correct = i === check.answer;
                        setGuideFeedback((previous) => ({
                          ...previous,
                          [check.id]: `${correct ? "Correct." : "Review this choice."} ${check.explanation}`,
                        }));
                        if (correct)
                          update((current) => ({
                            ...current,
                            practice: {
                              comparison: current.practice?.comparison ?? "",
                              passed: [
                                ...new Set([
                                  ...(current.practice?.passed ?? []),
                                  check.id,
                                ]),
                              ],
                            },
                          }));
                      }}
                    >
                      {option}
                    </button>
                  ))}
                  <p role="status">
                    {guideFeedback[check.id] ??
                      (practice.passed.includes(check.id)
                        ? "Check passed earlier in this shift."
                        : "")}
                  </p>
                </fieldset>
              ))}
            <p className="small muted">
              {practice.passed.length} of {networkGuideChecks.length} guide
              checks passed.
            </p>
            <a className="button secondary" href={routeHref(pack, "network")}>
              Open college network <ArrowRight size={16} />
            </a>
          </article>
        </div>
      )}

      {page === "network" && (
        <>
          <section
            className="panel network-map-panel"
            aria-label="Interactive college network"
          >
            <div className="section-heading">
              <div>
                <h2>College network</h2>
                <p className="small muted">
                  Solid lines are connected. Dashed lines need a connection. A
                  highlighted path shows the latest test.
                </p>
              </div>
              <DiagramMagnifier
                title="College network"
                diagram={
                  <NetworkDiagram
                    links={network.links}
                    selected={nodeId}
                    onSelect={selectNode}
                    path={highlightedPath}
                  />
                }
                selectionLabel="Network device"
                selected={nodeId}
                items={networkNodes.map((item) => ({
                  id: item.id,
                  label: item.name,
                }))}
                onSelect={selectNode}
                details={
                  <>
                    <h3>{node.name}</h3>
                    <p>{nodeComponent.function}</p>
                  </>
                }
              />
            </div>
            <NetworkDiagram
              links={network.links}
              selected={nodeId}
              onSelect={selectNode}
              path={highlightedPath}
            />
            <div className="network-device-detail" aria-live="polite">
              <NetworkNodeIcon id={nodeId} />
              <div>
                <h3>{node.name}</h3>
                <p>{nodeComponent.function}</p>
              </div>
            </div>
          </section>
          <div className="network-console-grid">
            <section className="panel network-builder">
              <h2>Connect equipment</h2>
              <p>
                The shift starts with four backbone links ready. Add the PC,
                printer, access point and laptop connections.
              </p>
              <form onSubmit={connect}>
                <label className="field">
                  <span>From device</span>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  >
                    {networkNodes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>To device</span>
                  <select value={to} onChange={(e) => setTo(e.target.value)}>
                    {networkNodes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Connection type</span>
                  <select
                    value={connection}
                    onChange={(e) => setConnection(e.target.value)}
                  >
                    <option value="ethernet">Ethernet (RJ-45)</option>
                    <option value="wifi">Wi-Fi association</option>
                    <option value="provider">Provider line</option>
                    <option value="hdmi">HDMI</option>
                  </select>
                </label>
                <button className="button secondary" type="submit">
                  <Cable size={16} />
                  Connect devices
                </button>
              </form>
              <p className="network-live-result" role="status">
                {feedback}
              </p>
              <details>
                <summary>Inspect or disconnect a link</summary>
                <ul className="network-link-list">
                  {networkLinks.map((link) => (
                    <li key={link.id}>
                      <span>
                        {link.label}
                        <small>
                          {network.links.includes(link.id)
                            ? "Connected"
                            : "Disconnected"}
                        </small>
                      </span>
                      {network.links.includes(link.id) && (
                        <button
                          className="button ghost"
                          type="button"
                          aria-label={`Disconnect ${link.label}`}
                          onClick={() => {
                            save((current) => ({
                              ...current,
                              links: current.links.filter(
                                (id) => id !== link.id,
                              ),
                            }));
                            setFeedback(
                              `Disconnected ${link.label}. Compare which destinations still work.`,
                            );
                          }}
                        >
                          Disconnect
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </section>
            <section className="panel network-tests">
              <h2>Test a destination</h2>
              <p>
                Run a local check and an internet check. Disconnect a link and
                compare the results.
              </p>
              <label className="field">
                <span>Test from</span>
                <select
                  value={source}
                  onChange={(e) =>
                    setSource(e.target.value as NetworkTest["source"])
                  }
                >
                  <option value="pc">Classroom PC</option>
                  <option value="laptop">Learner laptop</option>
                </select>
              </label>
              <div className="network-test-buttons">
                {networkDestinations.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    className="button secondary"
                    onClick={() => test(target.id)}
                  >
                    {target.label}
                  </button>
                ))}
              </div>
              <div className="network-live-result" aria-live="polite">
                {latest && result ? (
                  <>
                    <h3>{result.passed ? "Test passed" : "Check required"}</h3>
                    <p className="small muted">
                      {latest.source === "pc"
                        ? "Classroom PC"
                        : "Learner laptop"}{" "}
                      ·{" "}
                      {
                        networkDestinations.find(
                          (target) => target.id === latest.target,
                        )?.label
                      }
                    </p>
                    <p>{result.message}</p>
                    <p className="network-route">{result.names.join(" → ")}</p>
                    <p className="small muted">
                      {currentTest
                        ? "Result saved with the connections used for this test."
                        : "Connections have changed since this recorded result. Run the test again to check the current route."}
                    </p>
                  </>
                ) : (
                  <p>Your test result and route will appear here.</p>
                )}
              </div>
              <a className="button ghost" href={routeHref(pack, "lesson")}>
                Write your individual evidence <ArrowRight size={16} />
              </a>
            </section>
          </div>
        </>
      )}

      {page === "lesson" && (
        <>
          <section className="panel network-agenda">
            <h2>Today’s lesson</h2>
            <ol>
              {networkLesson.map((step) => (
                <li key={step.title}>
                  <span>{step.minutes}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.task}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              className="button secondary"
              href={routeHref(pack, "network-guide")}
            >
              Start with the component guide <ArrowRight size={16} />
            </a>
          </section>
          <section className="panel network-individual">
            <h2>Your individual evidence</h2>
            <p>
              Run the route you want to include last in College network.
              Describe three devices along it, then explain one result from the
              ticket you led. Your writing and test results appear in your Week
              9 Session Report.
            </p>
            <div className="network-writing-grid">
              {network.descriptions.map((description, index) => (
                <div key={index} className="network-description">
                  <label className="field">
                    <span>Device {index + 1}</span>
                    <select
                      value={description.component}
                      onChange={(e) =>
                        save((current) => ({
                          ...current,
                          descriptions: current.descriptions.map((item, i) =>
                            i === index
                              ? { ...item, component: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    >
                      {networkComponents
                        .filter((item) =>
                          networkNodes.some(
                            (node) => node.component === item.id,
                          ),
                        )
                        .map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.shortName}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>What device {index + 1} does on your route</span>
                    <textarea
                      rows={4}
                      maxLength={2000}
                      value={description.text}
                      onChange={(e) =>
                        save((current) => ({
                          ...current,
                          descriptions: current.descriptions.map((item, i) =>
                            i === index
                              ? { ...item, text: e.target.value }
                              : item,
                          ),
                        }))
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
            <label className="field">
              <span>My network explanation</span>
              <textarea
                rows={6}
                maxLength={6000}
                value={practice.comparison}
                onChange={(e) =>
                  update((current) => ({
                    ...current,
                    practice: {
                      passed: current.practice?.passed ?? [],
                      comparison: e.target.value,
                    },
                  }))
                }
                placeholder="My route starts at… I tested… The result showed… In ticket W9-…, I would check… next because…"
              />
            </label>
            <ul className="network-hand-in">
              <li>
                Include one tested route with the start device and destination.
              </li>
              <li>Describe three devices in your own words.</li>
              <li>
                Include the request you led, the evidence you gathered and an
                appropriate next check.
              </li>
              <li>
                Open Session Report, review your work and choose Print / Save as
                PDF. Hand in one report under your own name.
              </li>
            </ul>
            <a className="button primary" href={routeHref(pack, "report")}>
              Open session report <ArrowRight size={16} />
            </a>
          </section>
          <details className="panel network-references">
            <summary>Lesson references</summary>
            <ul>
              {networkReferences.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.title}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </>
      )}
    </section>
  );
}
