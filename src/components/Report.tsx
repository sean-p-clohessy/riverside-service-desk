import {
  ClipboardCopy,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { Profile, ScenarioPack } from "../types.ts";
import { componentPerformance, evidenceSummary, stats } from "../lib/engine.ts";
import { exportProgress } from "../lib/storage.ts";

export default function Report({
  profile,
  pack,
  notify,
}: {
  profile: Profile;
  pack: ScenarioPack;
  notify: (message: string) => void;
}) {
  const s = stats(profile, pack),
    performance = componentPerformance(profile, pack);
  const names = (ids: string[]) =>
    ids
      .map((id) => pack.components.find((c) => c.id === id)?.shortName)
      .join(", ");
  const encountered = [
    ...new Set([
      ...profile.inspected,
      ...pack.tickets
        .filter((t) => profile.tickets[t.id]?.attempts.length)
        .flatMap((t) => t.expected),
    ]),
  ];
  async function copy() {
    try {
      await navigator.clipboard.writeText(evidenceSummary(profile, pack));
      notify("Evidence summary copied to the clipboard.");
    } catch {
      notify(
        "Clipboard access was unavailable. Use the selectable text summary at the bottom of this report.",
      );
    }
  }
  return (
    <section className="report">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SHIFT RECORD</div>
          <h1>Session Report</h1>
          <p>Your investigation evidence, ready for review.</p>
        </div>
        <div className="button-group no-print">
          <button className="button secondary" onClick={copy}>
            <ClipboardCopy size={16} />
            Copy Evidence Summary
          </button>
          <button
            className="button secondary"
            onClick={() => exportProgress(profile)}
          >
            <Download size={16} />
            Export Progress
          </button>
          <button className="button primary" onClick={() => window.print()}>
            <Printer size={16} />
            Print / Save as PDF
          </button>
        </div>
      </div>
      <div className="panel report-cover">
        <div>
          <div className="eyebrow">RIVERSIDE COLLEGE IT</div>
          <h2>{profile.name}</h2>
          <p>
            {pack.subtitle} — {pack.title}
          </p>
          <p className="small">{pack.unit}</p>
        </div>
        <div className="report-dates">
          <span>Shift started</span>
          <strong>
            {new Date(profile.shiftStartedAt).toLocaleString("en-GB")}
          </strong>
          <span>Progress status</span>
          <strong>
            {s.resolved === pack.tickets.length
              ? "Shift complete"
              : "Shift in progress"}
          </strong>
        </div>
      </div>
      <div className="stats-grid report-stats">
        {[
          ["Tickets attempted", `${s.attempted} / ${pack.tickets.length}`],
          ["Tickets resolved", s.resolved],
          ["First-attempt accuracy", `${s.accuracy}%`],
          ["Total score", s.score],
        ].map(([label, value]) => (
          <div className="stat panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <p className="small muted">
        First-attempt accuracy: all four rubric checks met on the first
        submission. Total score uses the best attempt for each ticket.
        Scoring-off submissions earn 0 points.
      </p>
      <div className="report-columns">
        <section className="panel padded">
          <h3>
            <CheckCircle2 size={18} />
            Strengths
          </h3>
          <p>
            {performance
              .filter((p) => p.strong)
              .map((p) => p.component.shortName)
              .join(", ") ||
              "Resolve a ticket on your first attempt to record a strength."}
          </p>
          <h4>Components encountered</h4>
          <p>
            {names(encountered) ||
              "None yet. Inspect the workstation or investigate a ticket."}
          </p>
        </section>
        <section className="panel padded">
          <h3>
            <AlertCircle size={18} />
            Components requiring review
          </h3>
          <p>
            {performance
              .filter((p) => p.review)
              .map((p) => p.component.shortName)
              .join(", ") || "No review flags recorded yet."}
          </p>
          <p className="small muted">
            A review flag records any attempt needing revision, even when you
            later resolve the ticket. Use it to plan revision.
          </p>
        </section>
      </div>
      <div className="section-heading">
        <h2>Ticket evidence</h2>
        <span className="small muted">
          {s.attempts} submissions · {s.hints} hints used
        </span>
      </div>
      {!s.attempted && (
        <div className="panel empty">
          No submissions yet. Investigate a ticket to start your evidence
          record.
        </div>
      )}
      {pack.tickets
        .filter((t) => profile.tickets[t.id]?.attempts.length)
        .map((t) => {
          const p = profile.tickets[t.id];
          return (
            <article className="panel evidence-record" key={t.id}>
              <div className="section-heading">
                <h3>
                  <span className="mono">{t.id.toUpperCase()}</span> {t.title}
                </h3>
                <span className={`badge ${p.completedAt ? "green" : "gold"}`}>
                  {p.completedAt ? "Resolved" : "Review required"}
                </span>
              </div>
              {p.attempts.map((a, i) => (
                <section className="attempt-record" key={a.at + i}>
                  <h4>
                    Attempt {i + 1} · {a.points} points
                    {!a.scoring && " · scoring off"} ·{" "}
                    {a.resolved ? "Resolved" : "Review"}
                  </h4>
                  <dl>
                    <dt>Selected components</dt>
                    <dd>{names(a.components)}</dd>
                    <dt>Function explanation</dt>
                    <dd>{a.functionText}</dd>
                    <dt>Ticket reasoning</dt>
                    <dd>{a.reasoning}</dd>
                    <dt>Recommended next step</dt>
                    <dd>{t.actions.find((x) => x.id === a.action)?.label}</dd>
                    <dt>Feedback checks</dt>
                    <dd>
                      Component: {a.componentCorrect ? "Correct" : "Review"} ·
                      Function: {a.functionCorrect ? "Met" : "Review"} ·
                      Reasoning: {a.reasoningCorrect ? "Met" : "Review"} · Next
                      step: {a.actionCorrect ? "Met" : "Review"} · Hints:{" "}
                      {a.hintsUsed}
                    </dd>
                  </dl>
                </section>
              ))}
              <div className="record-notes">
                <strong>Evidence gathered</strong>
                <p>
                  {p.evidence
                    .map((id) => t.evidence.find((e) => e.id === id)?.title)
                    .join(" · ") || "None recorded"}
                </p>
                <strong>Technician notes</strong>
                <p>{p.notes || "No notes recorded."}</p>
              </div>
            </article>
          );
        })}
      <p className="small muted">
        Feedback checks key ideas against a local rubric. A tutor should review
        the full written evidence. This learning report is not an official
        assessment result. Progress is stored in this browser and is not
        submitted to the college.
      </p>
      <details className="panel padded no-print">
        <summary>Selectable plain-text evidence summary</summary>
        <textarea
          className="text-summary"
          readOnly
          aria-label="Plain-text evidence summary"
          value={evidenceSummary(profile, pack)}
        />
      </details>
    </section>
  );
}
