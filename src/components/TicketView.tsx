import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  FileSearch,
  Lightbulb,
  LockKeyhole,
  MessageSquare,
  Monitor,
  NotebookPen,
  Send,
  User,
  Check,
  AlertCircle,
} from "lucide-react";
import type {
  Diagnosis,
  Profile,
  ScenarioPack,
  Ticket,
  TicketProgress,
} from "../types.ts";
import { emptyProgress, submit, missingIdeas } from "../lib/engine.ts";
import Workstation, { ComponentIcon } from "./Workstation.tsx";

type Props = {
  ticket: Ticket;
  pack: ScenarioPack;
  profile: Profile;
  update: (fn: (p: Profile) => Profile) => void;
  back: () => void;
  next: () => void;
  teacher: boolean;
  showAnswers: boolean;
};
const tabs = [
  { name: "User Report", Icon: MessageSquare },
  { name: "Machine", Icon: Monitor },
  { name: "Inspect Workstation", Icon: FileSearch },
  { name: "Evidence", Icon: LockKeyhole },
  { name: "Technician Notes", Icon: NotebookPen },
];
export default function TicketView({
  ticket,
  pack,
  profile,
  update,
  back,
  next,
  teacher,
  showAnswers,
}: Props) {
  const p = profile.tickets[ticket.id] ?? emptyProgress();
  const [tab, setTab] = useState("User Report"),
    [part, setPart] = useState<string>(),
    [editing, setEditing] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const attempt = p.attempts.at(-1);
  const showFeedback = !!attempt && !editing;
  const selected = pack.components.find((c) => c.id === part);
  useEffect(() => {
    setTab("User Report");
    setPart(undefined);
    setEditing(false);
  }, [ticket.id]);
  function change(fn: (progress: TicketProgress) => TicketProgress) {
    update((current) => ({
      ...current,
      tickets: {
        ...current.tickets,
        [ticket.id]: fn(current.tickets[ticket.id] ?? emptyProgress()),
      },
    }));
  }
  function draft(values: Partial<Diagnosis>) {
    change((v) => ({ ...v, draft: { ...v.draft, ...values } }));
  }
  function send(e: React.FormEvent) {
    e.preventDefault();
    update((current) => submit(current, ticket));
    setEditing(false);
    setTimeout(() => feedbackRef.current?.focus(), 0);
  }
  return (
    <section>
      <button className="back-link" onClick={back}>
        <ArrowLeft size={16} />
        Ticket Queue
      </button>
      <div className="ticket-title">
        <div>
          <div className="eyebrow">
            <span className="mono">{ticket.id.toUpperCase()}</span>
            <span> / </span>TIER {ticket.tier} ·{" "}
            {pack.tiers[ticket.tier - 1].name.toUpperCase()}
          </div>
          <h1>{ticket.title}</h1>
          <p>{ticket.summary}</p>
        </div>
        <div className="ticket-badges">
          <span className={`badge ${p.completedAt ? "green" : "cyan"}`}>
            {p.completedAt ? "Resolved" : "Assigned to you"}
          </span>
          <span
            className={`priority priority-${ticket.priority.toLowerCase()}`}
          >
            {ticket.priority} priority
          </span>
        </div>
      </div>
      <div className="ticket-layout">
        <div className="investigation-column">
          <div className="panel investigation">
            <div
              className="tabs"
              role="tablist"
              aria-label="Ticket investigation"
            >
              {tabs.map(({ name, Icon }, i) => (
                <button
                  key={name}
                  id={`tab-${i}`}
                  role="tab"
                  aria-selected={tab === name}
                  aria-controls="investigation-panel"
                  tabIndex={tab === name ? 0 : -1}
                  onClick={() => setTab(name)}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const index =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? tabs.length - 1
                            : (i +
                                (e.key === "ArrowRight" ? 1 : -1) +
                                tabs.length) %
                              tabs.length;
                      setTab(tabs[index].name);
                      document.getElementById(`tab-${index}`)?.focus();
                    }
                  }}
                >
                  <Icon size={15} />
                  <span>
                    {name === "Inspect Workstation" &&
                    pack.inspectionMode === "catalog"
                      ? "Inspect Components"
                      : name}
                  </span>
                  {name === "Evidence" && (
                    <span className="tab-count">{p.evidence.length}</span>
                  )}
                </button>
              ))}
            </div>
            <div
              id="investigation-panel"
              role="tabpanel"
              aria-labelledby={`tab-${tabs.findIndex((t) => t.name === tab)}`}
              tabIndex={0}
              className="tab-content"
            >
              {tab === "User Report" && (
                <>
                  <div className="section-heading">
                    <h2>Original request</h2>
                    <span className="mono small muted">SERVICE PORTAL</span>
                  </div>
                  <div className="requester">
                    <div className="avatar">
                      <User size={20} />
                    </div>
                    <div>
                      <strong>{ticket.user}</strong>
                      <span>
                        {ticket.department} · {ticket.location}
                      </span>
                    </div>
                  </div>
                  <blockquote>{ticket.report}</blockquote>
                  <div className="ticket-meta">
                    <div>
                      <span>Asset ID</span>
                      <strong className="mono">{ticket.machine.asset}</strong>
                    </div>
                    <div>
                      <span>Request type</span>
                      <strong>Hardware support</strong>
                    </div>
                  </div>
                  <div className="info-strip">
                    <FileSearch size={18} />
                    <span>
                      Check the machine, inspect the components and gather
                      evidence before submitting.
                    </span>
                  </div>
                  <button
                    className="button secondary"
                    onClick={() => setTab("Machine")}
                  >
                    View machine specification
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              {tab === "Machine" && (
                <>
                  <div className="section-heading">
                    <h2>Machine specification</h2>
                    <span className="badge cyan mono">
                      {ticket.machine.asset}
                    </span>
                  </div>
                  <p>{ticket.machine.model}</p>
                  <dl className="machine-spec">
                    {[
                      ["Asset number", ticket.machine.asset],
                      ["CPU", ticket.machine.cpu],
                      ["RAM", ticket.machine.ram],
                      ["Storage", ticket.machine.storage],
                      ["GPU", ticket.machine.gpu],
                      ["PSU", ticket.machine.psu],
                      ["Operating system", ticket.machine.os],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="small muted">
                    The internal view is a simplified learning diagram. Actual
                    component positions and specifications vary.
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => setTab("Inspect Workstation")}
                  >
                    Inspect workstation
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              {tab === "Inspect Workstation" && (
                <>
                  <h2>
                    {pack.inspectionMode === "catalog"
                      ? "Inspect the components"
                      : "Inside the workstation"}
                  </h2>
                  <p className="small muted">
                    Select a labelled component to inspect its role. Use Tab to
                    reach components.
                  </p>
                  <Workstation
                    mode={pack.inspectionMode}
                    components={pack.components}
                    selected={part}
                    onSelect={(id) => {
                      setPart(id);
                      update((current) => ({
                        ...current,
                        inspected: [...new Set([...current.inspected, id])],
                      }));
                    }}
                  />
                  {selected ? (
                    <div className="component-detail" aria-live="polite">
                      <span className="eyebrow">{selected.category}</span>
                      <h3>
                        <ComponentIcon component={selected} />
                        {selected.name}
                      </h3>
                      <p>{selected.function}</p>
                      <p className="small muted">
                        <strong>Primary function:</strong> {selected.need}
                      </p>
                    </div>
                  ) : (
                    <div className="component-detail muted">
                      Select a component to see its name and primary function.
                    </div>
                  )}
                </>
              )}
              {tab === "Evidence" && (
                <>
                  <div className="section-heading">
                    <h2>Evidence desk</h2>
                    <span className="small muted">
                      {p.evidence.length} / {ticket.evidence.length} gathered
                    </span>
                  </div>
                  <p className="small muted">
                    Open each source to add it to your investigation. Use the
                    details to support your reasoning.
                  </p>
                  <div className="evidence-list">
                    {ticket.evidence.map((e) => {
                      const gathered = p.evidence.includes(e.id);
                      return (
                        <article
                          key={e.id}
                          className={`evidence-source ${gathered ? "gathered" : ""}`}
                        >
                          <div className="section-heading">
                            <h3>
                              {gathered ? (
                                <CheckCircle2 size={18} />
                              ) : (
                                <FileSearch size={18} />
                              )}
                              {e.title}
                            </h3>
                            {gathered && (
                              <span className="badge green">Gathered</span>
                            )}
                          </div>
                          {gathered ? (
                            <p>{e.body}</p>
                          ) : (
                            <button
                              className="button secondary"
                              onClick={() =>
                                change((v) => ({
                                  ...v,
                                  evidence: [...new Set([...v.evidence, e.id])],
                                }))
                              }
                            >
                              Gather evidence
                              <ArrowRight size={15} />
                            </button>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
              {tab === "Technician Notes" && (
                <>
                  <h2>Your investigation notes</h2>
                  <p className="small muted">
                    Record observations, useful specifications and why you ruled
                    out other components. Notes save automatically.
                  </p>
                  <label className="field">
                    <span>Technician notes</span>
                    <textarea
                      rows={12}
                      maxLength={12000}
                      value={p.notes}
                      onChange={(e) =>
                        change((v) => ({ ...v, notes: e.target.value }))
                      }
                      placeholder="What did you observe? Which evidence supports your recommendation?"
                    />
                  </label>
                  <p className="save-caption">
                    <Check size={14} />
                    Notes included in your local session report.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="panel ticket-checklist">
            <span className="eyebrow">INVESTIGATION CHECKLIST</span>
            <div>
              <span>
                <CheckCircle2 size={15} />
                Read the user report
              </span>
              <span>
                {p.evidence.length === ticket.evidence.length ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Circle size={15} />
                )}
                Gather evidence ({p.evidence.length}/{ticket.evidence.length})
              </span>
              <span>
                {p.notes ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                Record your reasoning
              </span>
            </div>
          </div>
        </div>
        <aside className="diagnosis-column">
          <div className="panel diagnosis">
            <div className="diagnosis-head">
              <span className="eyebrow">TECHNICIAN WORKSPACE</span>
              <h2>{p.completedAt ? "Ticket resolved" : "Your diagnosis"}</h2>
              <p className="small muted">
                Attempt{" "}
                {p.completedAt
                  ? p.attempts.length
                  : p.attempts.length + (editing || !attempt ? 1 : 0)}{" "}
                ·{" "}
                {profile.settings.scoring
                  ? "Up to 13 points before retries / hints"
                  : "Scoring off — focus on your evidence"}
              </p>
            </div>
            {showFeedback ? (
              <div
                className="feedback"
                ref={feedbackRef}
                tabIndex={-1}
                aria-label="Diagnosis feedback"
              >
                <div
                  className={`feedback-heading ${attempt.resolved ? "success" : "review"}`}
                >
                  {attempt.resolved ? (
                    <CheckCircle2 size={28} />
                  ) : (
                    <AlertCircle size={28} />
                  )}
                  <div>
                    <h3>
                      {attempt.resolved
                        ? "Good work. Ticket resolved."
                        : "A useful start. Review the evidence."}
                    </h3>
                    <span>
                      {attempt.points} points this attempt ·{" "}
                      {Math.max(...p.attempts.map((a) => a.points))} ticket best
                    </span>
                  </div>
                </div>
                {[
                  {
                    title: "Component identification",
                    correct: attempt.componentCorrect,
                    text: attempt.componentCorrect
                      ? "Your component selection matches this request."
                      : ticket.hints[0],
                  },
                  {
                    title: "Function explanation",
                    correct: attempt.functionCorrect,
                    text: attempt.functionCorrect
                      ? "The key function ideas are present."
                      : ticket.functionRubric.guidance,
                    example:
                      !attempt.functionCorrect && attempt.componentCorrect
                        ? ticket.functionRubric.example
                        : undefined,
                  },
                  {
                    title: "Ticket reasoning",
                    correct: attempt.reasoningCorrect,
                    text: attempt.reasoningCorrect
                      ? "Your reasoning includes the relevant key ideas."
                      : ticket.reasoningRubric.guidance,
                    missing: !attempt.reasoningCorrect
                      ? missingIdeas(attempt.reasoning, ticket.reasoningRubric)
                      : [],
                    example:
                      !attempt.reasoningCorrect && attempt.componentCorrect
                        ? ticket.reasoningRubric.example
                        : undefined,
                  },
                  {
                    title: "Recommended next step",
                    correct: attempt.actionCorrect,
                    text: ticket.actions.find((a) => a.id === attempt.action)
                      ?.feedback,
                  },
                ].map((row) => (
                  <div className="feedback-row" key={row.title}>
                    <div>
                      {row.correct ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <AlertCircle size={17} />
                      )}
                      <strong>{row.title}</strong>
                      <span
                        className={`badge ${row.correct ? "green" : "gold"}`}
                      >
                        {row.correct ? "Correct" : "Review"}
                      </span>
                    </div>
                    <p>{row.text}</p>
                    {row.missing?.length ? (
                      <div className="feedback-coaching">
                        <strong>To improve your answer:</strong>
                        <ul>
                          {row.missing.map((idea) => (
                            <li key={idea}>{idea}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {row.example && (
                      <details className="feedback-example">
                        <summary>See one example</summary>
                        <p>{row.example}</p>
                        <p>You can explain the same idea in your own words.</p>
                      </details>
                    )}
                  </div>
                ))}
                {attempt.resolved ? (
                  <>
                    <p className="resolution">{ticket.resolution}</p>
                    <button className="button primary full" onClick={next}>
                      Continue shift
                      <ArrowRight size={17} />
                    </button>
                  </>
                ) : (
                  <>
                    <p className="small muted">
                      Your earlier attempt stays in the report. Component points
                      are 3 on attempt 2, then 1; other rubric points remain
                      available.
                    </p>
                    <button
                      className="button primary full"
                      onClick={() => setEditing(true)}
                    >
                      Review and Retry
                      <ArrowRight size={17} />
                    </button>
                    <button
                      className="button ghost full"
                      onClick={() => setTab("Evidence")}
                    >
                      Return to evidence
                    </button>
                  </>
                )}
                <p className="small muted rubric-note">
                  Feedback checks key ideas rather than every possible wording.
                  Check the component library, revise clearly, and ask your
                  tutor if valid wording needs review.
                </p>
              </div>
            ) : (
              <form onSubmit={send} className="diagnosis-form">
                <fieldset>
                  <legend>
                    1 <span>Component(s) involved</span>
                  </legend>
                  <p className="small muted">
                    Select all components that your diagnosis needs.
                  </p>
                  <div className="component-choices">
                    {pack.components.map((c) => (
                      <label
                        className={`component-choice ${p.draft.components.includes(c.id) ? "checked" : ""}`}
                        key={c.id}
                      >
                        <input
                          type="checkbox"
                          checked={p.draft.components.includes(c.id)}
                          onChange={(e) =>
                            draft({
                              components: e.target.checked
                                ? [...p.draft.components, c.id]
                                : p.draft.components.filter(
                                    (id) => id !== c.id,
                                  ),
                            })
                          }
                        />
                        <span>{c.shortName}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label className="field">
                  <span>
                    <b>2</b> What does this component do?
                  </span>
                  <textarea
                    required
                    minLength={16}
                    maxLength={6000}
                    rows={3}
                    value={p.draft.functionText}
                    onChange={(e) => draft({ functionText: e.target.value })}
                    placeholder="Describe its main function in your own words…"
                  />
                </label>
                <label className="field">
                  <span>
                    <b>3</b> Why is it relevant to this ticket?
                  </span>
                  <textarea
                    required
                    minLength={16}
                    maxLength={6000}
                    rows={3}
                    value={p.draft.reasoning}
                    onChange={(e) => draft({ reasoning: e.target.value })}
                    placeholder="This component fits because the user…"
                  />
                  <span className="reasoning-prompt">
                    Use these ideas to explain your decision:
                  </span>
                  <ul className="reasoning-criteria">
                    {(
                      ticket.reasoningRubric.criteria ?? [
                        ticket.reasoningRubric.guidance,
                      ]
                    ).map((idea) => (
                      <li key={idea}>{idea}</li>
                    ))}
                  </ul>
                </label>
                <fieldset>
                  <legend>
                    4 <span>Recommended next step</span>
                  </legend>
                  <div className="action-choices">
                    {ticket.actions.map((a) => (
                      <label
                        key={a.id}
                        className={p.draft.action === a.id ? "checked" : ""}
                      >
                        <input
                          required
                          type="radio"
                          name="next-action"
                          value={a.id}
                          checked={p.draft.action === a.id}
                          onChange={() => draft({ action: a.id })}
                        />
                        <span>{a.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <p className="small muted">
                  Written checks look for key ideas. Full responses remain
                  available for tutor review.
                </p>
                <button
                  className="button primary full"
                  type="submit"
                  disabled={!p.draft.components.length}
                >
                  <Send size={16} />
                  Submit Diagnosis
                </button>
              </form>
            )}
          </div>
          {!p.completedAt && profile.settings.hints && (
            <section className="panel hint-panel">
              <h3>
                <Lightbulb size={18} />
                Need a pointer?
              </h3>
              {ticket.hints.slice(0, p.hintsUsed).map((hint, i) => (
                <p key={hint}>
                  <strong>Hint {i + 1}:</strong> {hint}
                </p>
              ))}
              <p className="small muted">
                Each hint reduces the next attempt’s score by 1. It’s fine to
                use help.
              </p>
              <button
                className="button secondary full"
                disabled={p.hintsUsed >= ticket.hints.length}
                onClick={() =>
                  change((v) => ({
                    ...v,
                    hintsUsed: Math.min(ticket.hints.length, v.hintsUsed + 1),
                  }))
                }
              >
                {p.hintsUsed >= ticket.hints.length
                  ? "All hints shown"
                  : `Reveal hint ${p.hintsUsed + 1}`}
              </button>
            </section>
          )}
          {teacher && showAnswers && (
            <section className="panel teacher-answers">
              <div className="eyebrow">TEACHER VIEW · ANSWER GUIDE</div>
              <h3>
                {ticket.expected
                  .map(
                    (id) => pack.components.find((c) => c.id === id)?.shortName,
                  )
                  .join(" + ")}
              </h3>
              <p>
                <strong>Function:</strong> {ticket.functionRubric.example}
              </p>
              <p>
                <strong>Reasoning:</strong> {ticket.reasoningRubric.example}
              </p>
              <p>
                <strong>Next step:</strong>{" "}
                {ticket.actions.find((a) => a.correct)?.label}
              </p>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}
