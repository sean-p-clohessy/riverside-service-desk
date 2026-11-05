import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Headset,
  LayoutDashboard,
  ListFilter,
  LockKeyhole,
  LogOut,
  Menu,
  Monitor,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Ticket as TicketIcon,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { Profile } from "./types.ts";
import { pack, teacherPin } from "./data/config.ts";
import {
  componentPerformance,
  createProfile,
  emptyProgress,
  resetProfile,
  shuffle,
  stats,
  syncProgress,
} from "./lib/engine.ts";
import {
  ACTIVE_KEY,
  deleteProfile,
  exportProgress,
  parseImport,
  PROFILE_PREFIX,
  readProfiles,
  saveProfile,
} from "./lib/storage.ts";
import Workstation, { ComponentIcon } from "./components/Workstation.tsx";
import TicketView from "./components/TicketView.tsx";
import Report from "./components/Report.tsx";

const navItems = [
  { id: "dashboard", name: "Dashboard", Icon: LayoutDashboard },
  { id: "queue", name: "Ticket Queue", Icon: ClipboardList },
  { id: "my-tickets", name: "My Tickets", Icon: TicketIcon },
  { id: "library", name: "Component Library", Icon: BookOpen },
  { id: "performance", name: "Performance", Icon: Activity },
  { id: "report", name: "Session Report", Icon: FileText },
];
function currentView() {
  const hash = window.location.hash.slice(1);
  return navItems.some((n) => n.id === hash) ||
    /^ticket\/[a-z0-9-]+$/i.test(hash)
    ? hash
    : "dashboard";
}
function sessionId() {
  try {
    return sessionStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}
function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <div className="modal-heading">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          onClick={close}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand ${small ? "small-brand" : ""}`}>
      <div className="brand-mark">
        R<span />
      </div>
      <div>
        <strong>RIVERSIDE</strong>
        <span>{small ? "COLLEGE IT" : "SERVICE DESK"}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [initial] = useState(() => readProfiles(pack));
  const [profiles, setProfiles] = useState<Profile[]>(initial.profiles);
  const [profile, setProfile] = useState<Profile | null>(
    () => initial.profiles.find((p) => p.id === sessionId()) ?? null,
  );
  const profileRef = useRef(profile);
  const [warning, setWarning] = useState(initial.warning),
    [notice, setNotice] = useState("");
  const [view, setView] = useState(currentView),
    [menu, setMenu] = useState(false),
    [name, setName] = useState(""),
    [nameError, setNameError] = useState("");
  const [manage, setManage] = useState(false),
    [confirm, setConfirm] = useState<"reset" | "delete" | null>(null);
  const [teacherModal, setTeacherModal] = useState(false),
    [teacher, setTeacher] = useState(false),
    [pin, setPin] = useState(""),
    [pinError, setPinError] = useState(""),
    [showAnswers, setShowAnswers] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    incoming: Profile;
    existing: Profile;
  } | null>(null);
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [librarySearch, setLibrarySearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null),
    mainRef = useRef<HTMLElement>(null);
  const firstNavigation = useRef(true);

  useEffect(() => {
    const onHash = () => {
      setView(currentView());
      setMenu(false);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (firstNavigation.current) {
      firstNavigation.current = false;
      return;
    }
    mainRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [view]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const storageChanged = (e: StorageEvent) => {
      if (e.key && !e.key.startsWith(PROFILE_PREFIX)) return;
      const result = readProfiles(pack);
      setProfiles(result.profiles);
      const active = profileRef.current;
      if (active) {
        const fresh = result.profiles.find((p) => p.id === active.id) ?? null;
        profileRef.current = fresh;
        setProfile(fresh);
      }
      if (result.warning) setWarning(result.warning);
    };
    window.addEventListener("storage", storageChanged);
    return () => window.removeEventListener("storage", storageChanged);
  }, []);

  function navigate(to: string) {
    if (window.location.hash === "#" + to) {
      setView(to);
      setMenu(false);
    } else window.location.hash = to;
  }
  function store(value: Profile) {
    const next = syncProgress(value, pack);
    const saved = saveProfile(next);
    if (!saved)
      setWarning(
        "Your latest changes could not be saved in browser storage. Keep this page open and export progress now to preserve your work.",
      );
    profileRef.current = next;
    setProfile(next);
    setProfiles((current) => [
      next,
      ...current.filter((p) => p.id !== next.id),
    ]);
    try {
      sessionStorage.setItem(ACTIVE_KEY, next.id);
    } catch {
      /* In-memory operation is still usable. */
    }
  }
  function update(fn: (current: Profile) => Profile) {
    if (profileRef.current) store(fn(profileRef.current));
  }
  function begin(p: Profile) {
    store({
      ...p,
      statistics: { ...p.statistics, visits: p.statistics.visits + 1 },
    });
    setTeacher(false);
    setShowAnswers(false);
    setManage(false);
    navigate("dashboard");
  }
  function start(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Enter a technician name.");
      return;
    }
    if (
      profiles.some(
        (p) => p.name.toLocaleLowerCase() === trimmed.toLocaleLowerCase(),
      )
    ) {
      setNameError(
        "That technician already has a local profile. Choose it above, or use a different name.",
      );
      return;
    }
    begin(createProfile(trimmed, pack));
    setName("");
    setNameError("");
  }
  function signOut() {
    profileRef.current = null;
    setProfile(null);
    setTeacher(false);
    setShowAnswers(false);
    setManage(false);
    try {
      sessionStorage.removeItem(ACTIVE_KEY);
    } catch {
      /* optional */
    }
    navigate("dashboard");
  }
  function openTicket(id: string) {
    const active = profileRef.current;
    if (!active?.unlockedTickets.includes(id)) return;
    if (!active.tickets[id])
      update((p) => ({
        ...p,
        tickets: { ...p.tickets, [id]: emptyProgress() },
      }));
    navigate("ticket/" + id);
  }
  function performConfirm() {
    if (!profile) return;
    if (confirm === "reset") {
      store(resetProfile(profile, pack));
      setTeacher(false);
      setShowAnswers(false);
      navigate("dashboard");
      setNotice("Current shift reset. Other local profiles were kept.");
    } else {
      try {
        deleteProfile(profile.id);
        setProfiles((p) => p.filter((x) => x.id !== profile.id));
        signOut();
        setNotice("Local profile deleted from this browser.");
      } catch {
        setNotice(
          "The browser did not allow profile deletion. No other profiles were changed.",
        );
      }
    }
    setConfirm(null);
    setManage(false);
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 2_000_000)
        throw new Error("Progress files must be smaller than 2 MB.");
      const incoming = parseImport(await file.text(), pack);
      const existing = profiles.find(
        (p) =>
          p.id === incoming.id ||
          p.name.toLowerCase() === incoming.name.toLowerCase(),
      );
      if (existing) setPendingImport({ incoming, existing });
      else {
        begin(incoming);
        setNotice("Progress imported into this browser.");
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The file could not be imported.",
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  }
  function finishImport(replace: boolean) {
    if (!pendingImport) return;
    const { incoming, existing } = pendingImport;
    if (replace) begin({ ...incoming, id: existing.id, name: existing.name });
    else {
      let suffix = 1,
        importedName = incoming.name.slice(0, 45) + " (import)";
      while (
        profiles.some(
          (p) => p.name.toLowerCase() === importedName.toLowerCase(),
        )
      )
        importedName = incoming.name.slice(0, 43) + ` (import ${++suffix})`;
      begin({ ...incoming, id: crypto.randomUUID(), name: importedName });
    }
    setPendingImport(null);
    setNotice("Progress imported. Keep the original JSON file as a backup.");
  }
  const s = profile ? stats(profile, pack) : null;
  const sorted = profile
    ? [...pack.tickets].sort(
        (a, b) =>
          a.tier - b.tier ||
          profile.order.indexOf(a.id) - profile.order.indexOf(b.id),
      )
    : pack.tickets;
  const ticket = view.startsWith("ticket/")
    ? pack.tickets.find((t) => t.id === view.split("/")[1])
    : undefined;
  const status = (id: string) =>
    profile?.tickets[id]?.completedAt
      ? "Resolved"
      : !profile?.unlockedTickets.includes(id)
        ? "Locked"
        : profile?.tickets[id]
          ? "Assigned"
          : "Open";

  function ticketTable(ids?: string[], limit?: number) {
    const list = sorted
      .filter(
        (t) =>
          (!ids || ids.includes(t.id)) &&
          (limit !== undefined ||
            filter === "all" ||
            status(t.id).toLowerCase() === filter) &&
          (limit !== undefined ||
            `${t.title} ${t.id} ${t.department} ${t.machine.asset}`
              .toLowerCase()
              .includes(search.toLowerCase())),
      )
      .slice(0, limit);
    return (
      <div className="table-scroll">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket / request</th>
              <th>Department</th>
              <th>Priority</th>
              <th>Status</th>
              <th>
                <span className="sr-only">Open ticket</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr
                key={t.id}
                className={status(t.id) === "Locked" ? "locked-row" : ""}
              >
                <td>
                  <div className="table-ticket-id mono">
                    {t.id.toUpperCase()} <span>· TIER {t.tier}</span>
                  </div>
                  <button
                    className="ticket-link"
                    disabled={status(t.id) === "Locked"}
                    onClick={() => openTicket(t.id)}
                  >
                    {t.title}
                  </button>
                  <div className="table-detail">
                    {t.user} · {t.machine.asset}
                  </div>
                </td>
                <td>{t.department}</td>
                <td>
                  <span
                    className={`priority priority-${t.priority.toLowerCase()}`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status status-${status(t.id).toLowerCase()}`}
                  >
                    {status(t.id) === "Locked" ? (
                      <LockKeyhole size={12} />
                    ) : status(t.id) === "Resolved" ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <span className="status-dot" />
                    )}
                    {status(t.id)}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
                    aria-label={`Open ${t.id.toUpperCase()}`}
                    disabled={status(t.id) === "Locked"}
                    onClick={() => openTicket(t.id)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <div className="empty">
            {limit !== undefined && s?.resolved === pack.tickets.length
              ? "All requests resolved. Your session report is ready."
              : "No tickets match. Try a different search or filter."}
          </div>
        )}
      </div>
    );
  }

  const shared = (
    <>
      <input
        ref={fileRef}
        className="sr-only"
        type="file"
        accept="application/json,.json"
        aria-label="Import progress JSON file"
        onChange={(e) => void importFile(e.target.files?.[0])}
      />
      {notice && (
        <div role="status" className="toast">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setNotice("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {pendingImport && (
        <Modal
          title="A local profile already exists"
          close={() => setPendingImport(null)}
        >
          <p>
            The file belongs to <strong>{pendingImport.incoming.name}</strong>.
            This browser already has{" "}
            <strong>{pendingImport.existing.name}</strong> with{" "}
            {stats(pendingImport.existing, pack).resolved} resolved tickets.
          </p>
          <p>
            Keep both to create a separate imported profile. Replacing uses the
            file’s progress and overwrites only this existing local profile.
          </p>
          <div className="modal-actions">
            <button
              className="button primary"
              onClick={() => finishImport(false)}
            >
              Keep both profiles
            </button>
            <button
              className="button danger"
              onClick={() => finishImport(true)}
            >
              Replace existing profile
            </button>
            <button
              className="button secondary"
              onClick={() => setPendingImport(null)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );

  if (!profile || !s)
    return (
      <div className="start-page">
        {shared}
        <div className="start-top">
          <Brand />
          <span className="local-label">
            <ShieldCheck size={15} />
            LOCAL PROGRESS · NO ACCOUNT NEEDED
          </span>
        </div>
        <main className="start-layout">
          <div className="start-story">
            <div className="eyebrow">
              <span className="live-dot" />
              TECHNICAL SUPPORT / LEVEL 2
            </div>
            <h1>
              Welcome to
              <br />
              Riverside College IT<span className="pink">.</span>
            </h1>
            <p className="start-intro">
              Real requests. Useful evidence.
              <br />
              Your first shift starts here.
            </p>
            <div className="start-pack">
              <span className="pack-number">
                {String(pack.week).padStart(2, "0")}
              </span>
              <div>
                <span className="eyebrow">THIS WEEK’S ASSIGNMENT</span>
                <h2>{pack.title}</h2>
                <p>
                  {pack.tickets.length} tickets · {pack.tiers.length} skill
                  tiers · your own pace
                </p>
              </div>
            </div>
            <Workstation
              mode={pack.inspectionMode}
              components={pack.components}
              compact
            />
            <p className="small muted fictional">
              A fictional service desk for learning. No real systems are
              changed.
            </p>
          </div>
          <div className="start-form-column">
            <section className="panel start-panel">
              <div className="eyebrow">TECHNICIAN CHECK-IN</div>
              <h2>
                {profiles.length
                  ? "Who’s starting a shift?"
                  : "Start your first shift"}
              </h2>
              <p className="muted">
                Your work stays in this browser. Pick up where you left off, or
                start as a new technician.
              </p>
              {warning && (
                <div className="warning" role="alert">
                  {warning}
                </div>
              )}
              {profiles.length > 0 && (
                <div className="profile-list">
                  {profiles.map((p) => (
                    <button key={p.id} onClick={() => begin(p)}>
                      <span className="avatar">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          {stats(p, pack).resolved} tickets completed ·{" "}
                          {stats(p, pack).score} points
                        </small>
                      </span>
                      <ChevronRight size={18} />
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={start}>
                <h3>
                  <Plus size={17} />
                  Start New Technician
                </h3>
                <label className="field">
                  <span>Technician name</span>
                  <input
                    autoComplete="off"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameError("");
                    }}
                    placeholder="Your name"
                    aria-describedby={nameError ? "name-error" : undefined}
                  />
                </label>
                {nameError && (
                  <p className="error" id="name-error" role="alert">
                    {nameError}
                  </p>
                )}
                <button type="submit" className="button primary full">
                  Start Shift
                  <ArrowRight size={17} />
                </button>
              </form>
              <button
                className="button ghost full"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={16} />
                Import Progress
              </button>
              <p className="privacy-note">
                <ShieldCheck size={16} />
                <span>
                  Profiles are a convenience, not a secure sign-in. Other people
                  using this browser can open them. Use export to keep a copy,
                  especially on shared PCs.
                </span>
              </p>
            </section>
            <div className="start-footer">
              <span>RIVERSIDE / IT OPERATIONS</span>
              <span>WEEK {String(pack.week).padStart(2, "0")}</span>
            </div>
          </div>
        </main>
      </div>
    );

  return (
    <div className="app-shell">
      {shared}
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to main content
      </a>
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <Brand />
        <div className="workspace-label">
          TECHNICIAN WORKSPACE
          <button
            className="icon-button mobile-close"
            onClick={() => setMenu(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {navItems.map(({ id, name: label, Icon }) => (
            <a
              key={id}
              href={"#" + id}
              onClick={() => setMenu(false)}
              className={
                view === id || (id === "queue" && ticket) ? "active" : ""
              }
              aria-current={
                view === id || (id === "queue" && ticket) ? "page" : undefined
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === "queue" && <span className="nav-count">{s.open}</span>}
            </a>
          ))}
        </nav>
        <div className="sidebar-pack">
          <div className="eyebrow">ACTIVE SCENARIO</div>
          <div className="sidebar-pack-number">
            WEEK <strong>{String(pack.week).padStart(2, "0")}</strong>
          </div>
          <strong>{pack.title}</strong>
          <span>Level 2 · Technical Support</span>
          <div className="progress-track">
            <span
              style={{ width: `${(s.resolved / pack.tickets.length) * 100}%` }}
            />
          </div>
          <span>
            {s.resolved} of {pack.tickets.length} tickets resolved
          </span>
        </div>
        <div className="sidebar-bottom">
          <button
            onClick={() => {
              setTeacherModal(true);
              setPin("");
              setPinError("");
            }}
          >
            <Settings2 size={16} />
            Teacher Mode{teacher && <span className="badge purple">On</span>}
          </button>
          <button onClick={() => setManage(true)}>
            <UserRound size={16} />
            Local profile & progress
          </button>
          <div className="local-save">
            <ShieldCheck size={14} />
            <span>
              {warning
                ? "Storage needs attention"
                : "Progress saved on this browser"}
            </span>
          </div>
        </div>
      </aside>
      <div className="app-body">
        <header className="topbar">
          <div>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <span className="college-name">
              Riverside College <b>IT</b>
            </span>
            <span className="topbar-separator" />
            <span className="topbar-context">Service Desk</span>
          </div>
          <div className="topbar-right">
            <span className="top-score">
              <Zap size={15} />
              <strong>{s.score}</strong> <span>pts</span>
            </span>
            <span className="top-resolved">
              <CheckCircle2 size={15} />
              <strong>
                {s.resolved}/{pack.tickets.length}
              </strong>
            </span>
            <span className="session-status">
              <span className="live-dot" />
              {s.resolved === pack.tickets.length
                ? "Shift complete"
                : "On shift"}
            </span>
            <button className="user-menu" onClick={() => setManage(true)}>
              <span className="avatar">
                {profile.name.slice(0, 2).toUpperCase()}
              </span>
              <span>{profile.name}</span>
            </button>
          </div>
        </header>
        {warning && (
          <div className="warning storage-warning" role="alert">
            {warning}
            <button
              className="button secondary"
              onClick={() => exportProgress(profile)}
            >
              Export Progress
            </button>
          </div>
        )}
        {(profile.settings.unlockAll ||
          !profile.settings.scoring ||
          !profile.settings.hints) && (
          <div className="override-banner">
            <Settings2 size={14} />
            Teacher settings:{" "}
            {profile.settings.unlockAll && "all tickets unlocked · "}
            {!profile.settings.scoring && "scoring off · "}
            {!profile.settings.hints && "hints disabled"}
          </div>
        )}
        <main
          ref={mainRef}
          id="main-content"
          className="main-content"
          tabIndex={-1}
        >
          {view === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    SHIFT CONSOLE <span className="slash">/</span> WEEK{" "}
                    {String(pack.week).padStart(2, "0")}
                  </div>
                  <h1>
                    Welcome, {profile.name.split(" ")[0]}
                    <span className="pink">.</span>
                  </h1>
                  <p>
                    There’s a workstation behind every request. Let’s get to
                    work.
                  </p>
                </div>
                <span className="date-label">
                  <Clock3 size={15} />
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="stats-grid">
                {[
                  {
                    label: "Open Tickets",
                    value: s.open,
                    Icon: ClipboardList,
                    tone: "cyan",
                    detail: "Unresolved in this pack",
                  },
                  {
                    label: "Assigned Tickets",
                    value: s.assigned,
                    Icon: TicketIcon,
                    tone: "purple",
                    detail: "Your active investigations",
                  },
                  {
                    label: "Resolved Tickets",
                    value: s.resolved,
                    Icon: CheckCircle2,
                    tone: "green",
                    detail: `of ${pack.tickets.length} this shift`,
                  },
                  {
                    label: "First-attempt Accuracy",
                    value: s.attempted ? `${s.accuracy}%` : "—",
                    Icon: Activity,
                    tone: "pink",
                    detail: s.attempted
                      ? `${s.first} of ${s.attempted} first submissions`
                      : "Submit a diagnosis to begin",
                  },
                  {
                    label: "Current Score",
                    value: s.score,
                    Icon: Zap,
                    tone: "gold",
                    detail: "Best attempt per ticket",
                  },
                ].map(({ label, value, Icon, tone, detail }) => (
                  <div className="stat panel" key={label}>
                    <span>
                      {label}
                      <Icon className={tone} size={17} />
                    </span>
                    <strong>{value}</strong>
                    <small>{detail}</small>
                  </div>
                ))}
              </div>
              <div className="dashboard-grid">
                <section className="panel brief">
                  <div className="brief-content">
                    <div className="eyebrow">
                      <span className="pink-marker" />
                      TODAY’S BRIEF
                    </div>
                    <h2>{pack.title}</h2>
                    <p>{pack.brief}</p>
                    <div className="brief-tags">
                      <span>
                        <Monitor size={14} />
                        Hardware fundamentals
                      </span>
                      <span>
                        <Headset size={14} />
                        Junior technician
                      </span>
                    </div>
                    <button
                      className="button primary"
                      onClick={() => {
                        setFilter("all");
                        setSearch("");
                        navigate("queue");
                      }}
                    >
                      Open Ticket Queue
                      <ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="brief-visual">
                    <Workstation
                      mode={pack.inspectionMode}
                      components={pack.components}
                      compact
                    />
                    <span className="visual-caption">
                      FIG. {String(pack.week).padStart(2, "0")} / INTERNAL
                      SYSTEMS
                    </span>
                  </div>
                </section>
                <section className="panel shift-progress">
                  <div className="section-heading">
                    <h3>Shift progress</h3>
                    <span className="badge cyan">
                      WEEK {String(pack.week).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="progress-ring">
                    <svg viewBox="0 0 140 140" aria-hidden="true">
                      <circle cx="70" cy="70" r="58" />
                      <circle
                        cx="70"
                        cy="70"
                        r="58"
                        className="ring-value"
                        strokeDasharray={`${(s.resolved / pack.tickets.length) * 364.4} 364.4`}
                      />
                    </svg>
                    <div>
                      <strong>
                        {Math.round((s.resolved / pack.tickets.length) * 100)}
                        <small>%</small>
                      </strong>
                      <span>COMPLETE</span>
                    </div>
                  </div>
                  <p>
                    {s.resolved === pack.tickets.length
                      ? "All tickets resolved. Review your report."
                      : `${pack.tickets.length - s.resolved} more requests to investigate.`}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => navigate("report")}
                  >
                    View session report
                    <ArrowRight size={15} />
                  </button>
                </section>
              </div>
              <div className="dashboard-lower">
                <section className="panel dashboard-queue">
                  <div className="panel-header">
                    <div>
                      <h2>Your next tickets</h2>
                      <p className="small muted">
                        Start with the unlocked requests.
                      </p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => {
                        setFilter("all");
                        setSearch("");
                        navigate("queue");
                      }}
                    >
                      View queue
                      <ArrowRight size={15} />
                    </button>
                  </div>
                  {ticketTable(
                    sorted
                      .filter(
                        (t) =>
                          profile.unlockedTickets.includes(t.id) &&
                          !profile.tickets[t.id]?.completedAt,
                      )
                      .map((t) => t.id),
                    3,
                  )}
                </section>
                <section className="panel skill-path">
                  <div className="panel-header">
                    <h2>Your skill path</h2>
                  </div>
                  <ol>
                    {pack.tiers.map((tier, i) => {
                      const tierTickets = pack.tickets.filter(
                        (t) => t.tier === i + 1,
                      );
                      const count = tierTickets.filter(
                        (t) => profile.tickets[t.id]?.completedAt,
                      ).length;
                      const unlocked = tierTickets.some((t) =>
                        profile.unlockedTickets.includes(t.id),
                      );
                      return (
                        <li
                          key={tier.name}
                          className={
                            count === tierTickets.length
                              ? "done"
                              : unlocked
                                ? "current"
                                : ""
                          }
                        >
                          <span className="tier-number">
                            {count === tierTickets.length ? (
                              <Check size={16} />
                            ) : (
                              i + 1
                            )}
                          </span>
                          <div>
                            <strong>{tier.name}</strong>
                            <span>
                              {count}/{tierTickets.length} resolved
                            </span>
                          </div>
                          {!unlocked && <LockKeyhole size={13} />}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              </div>
              <div className="quiet-footer">
                <ShieldCheck size={14} />
                <span>
                  Your shift is saved locally. Use Export Progress before moving
                  to another computer.
                </span>
                <button
                  className="text-button"
                  onClick={() => exportProgress(profile)}
                >
                  Export
                  <Download size={13} />
                </button>
              </div>
            </>
          )}
          {(view === "queue" || view === "my-tickets") && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    SERVICE OPERATIONS / WEEK{" "}
                    {String(pack.week).padStart(2, "0")}
                  </div>
                  <h1>{view === "queue" ? "Ticket Queue" : "My Tickets"}</h1>
                  <p>
                    {view === "queue"
                      ? "Investigate the request. Gather evidence. Make a supported decision."
                      : "Your assigned and resolved requests, all in one place."}
                  </p>
                </div>
                <span className="badge cyan">
                  {view === "queue"
                    ? `${profile.unlockedTickets.length} unlocked`
                    : `${Object.keys(profile.tickets).length} assigned this shift`}
                </span>
              </div>
              <div className="tier-strip">
                {pack.tiers.map((t, i) => (
                  <div key={t.name}>
                    <span className="eyebrow">TIER {i + 1}</span>
                    <strong>{t.name}</strong>
                    <span>{t.description}</span>
                  </div>
                ))}
              </div>
              <div className="panel">
                <div className="queue-toolbar">
                  <label className="search-box">
                    <Search size={17} />
                    <input
                      aria-label="Search tickets"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search ticket, department or asset…"
                    />
                  </label>
                  <label className="filter-label">
                    <ListFilter size={16} />
                    <select
                      aria-label="Filter ticket status"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All statuses</option>
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="resolved">Resolved</option>
                      <option value="locked">Locked</option>
                    </select>
                  </label>
                </div>
                {ticketTable(
                  view === "my-tickets"
                    ? Object.keys(profile.tickets)
                    : undefined,
                )}
              </div>
              <p className="small muted unlock-explanation">
                <LockKeyhole size={14} />
                Resolve all tickets in a tier to unlock the next. Open a ticket
                to assign it to yourself. First-attempt accuracy checks all four
                parts of your diagnosis.
              </p>
            </>
          )}
          {view === "library" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">TECHNICIAN REFERENCE</div>
                  <h1>Component Library</h1>
                  <p>Know what’s inside. Understand what it does.</p>
                </div>
                <label className="search-box">
                  <Search size={17} />
                  <input
                    aria-label="Search components"
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    placeholder="Find a component…"
                  />
                </label>
              </div>
              <div className="library-grid">
                {pack.components
                  .filter((c) =>
                    `${c.name} ${c.shortName} ${c.category}`
                      .toLowerCase()
                      .includes(librarySearch.toLowerCase()),
                  )
                  .map((c) => (
                    <article key={c.id} className="panel library-card">
                      <div className="library-card-head">
                        <div className="component-icon">
                          <ComponentIcon component={c} size={30} />
                        </div>
                        <span className="eyebrow">{c.category}</span>
                      </div>
                      <h2>{c.shortName}</h2>
                      <span className="full-component-name">{c.name}</span>
                      <p>{c.function}</p>
                      <h3>Why a computer needs it</h3>
                      <p>{c.need}</p>
                      <h3>Useful specifications</h3>
                      <p>{c.specs}</p>
                      <div className="misconception">
                        <span>COMMON MISCONCEPTION</span>
                        <p>{c.misconception}</p>
                      </div>
                    </article>
                  ))}
              </div>
              {!pack.components.some((c) =>
                `${c.name} ${c.shortName} ${c.category}`
                  .toLowerCase()
                  .includes(librarySearch.toLowerCase()),
              ) && (
                <div className="panel empty">
                  No components match your search.
                </div>
              )}
            </>
          )}
          {view === "performance" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">LEARNING INSIGHTS</div>
                  <h1>Performance</h1>
                  <p>Use your evidence to decide what to practise next.</p>
                </div>
                <button
                  className="button secondary"
                  onClick={() => navigate("report")}
                >
                  Open Session Report
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="performance-summary">
                <div className="panel padded">
                  <span className="eyebrow">FIRST-ATTEMPT ACCURACY</span>
                  <strong className="big-number">
                    {s.attempted ? s.accuracy + "%" : "—"}
                  </strong>
                  <p>
                    {s.first} of {s.attempted} attempted tickets met all four
                    checks on the first submission.
                  </p>
                </div>
                <div className="panel padded">
                  <h2>How points work</h2>
                  <dl className="scoring-rules">
                    <div>
                      <dt>Component identification</dt>
                      <dd>5 → 3 → 1</dd>
                    </div>
                    <div>
                      <dt>Function explanation</dt>
                      <dd>+3</dd>
                    </div>
                    <div>
                      <dt>Ticket reasoning</dt>
                      <dd>+3</dd>
                    </div>
                    <div>
                      <dt>Appropriate next step</dt>
                      <dd>+2</dd>
                    </div>
                    <div>
                      <dt>Each hint used</dt>
                      <dd>−1</dd>
                    </div>
                  </dl>
                  <p className="small muted">
                    Component points reduce after each retry. Best attempt per
                    ticket counts; scores never go below zero. Maximum for this
                    pack: {pack.tickets.length * 13} points. Scoring-off
                    submissions earn no points.
                  </p>
                </div>
              </div>
              <section className="panel">
                <div className="panel-header">
                  <h2>Component confidence</h2>
                  <span className="small muted">Based on ticket evidence</span>
                </div>
                <div className="confidence-list">
                  {componentPerformance(profile, pack).map(
                    ({ component, attempted, resolved, review, strong }) => (
                      <div key={component.id}>
                        <ComponentIcon component={component} size={22} />
                        <div>
                          <strong>{component.shortName}</strong>
                          <span>
                            {attempted
                              ? `${resolved}/${attempted} relevant tickets resolved`
                              : "No ticket evidence yet"}
                          </span>
                        </div>
                        <span
                          className={`badge ${review ? "gold" : strong ? "green" : "neutral"}`}
                        >
                          {review
                            ? "Practise / review"
                            : strong
                              ? "First-attempt strength"
                              : attempted
                                ? "In progress"
                                : "Not yet assessed"}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </section>
              <p className="small muted">
                A review flag remembers revisions and helps plan practice. It
                does not remove a resolved ticket. The network card is reference
                content in this pack and has no assessed ticket.
              </p>
            </>
          )}
          {view === "report" && (
            <Report profile={profile} pack={pack} notify={setNotice} />
          )}
          {view.startsWith("ticket/") &&
            (ticket && profile.unlockedTickets.includes(ticket.id) ? (
              <TicketView
                key={ticket.id}
                ticket={ticket}
                profile={profile}
                pack={pack}
                update={update}
                teacher={teacher}
                showAnswers={showAnswers}
                back={() => navigate("queue")}
                next={() => {
                  const next = sorted.find(
                    (t) =>
                      profile.unlockedTickets.includes(t.id) &&
                      !profile.tickets[t.id]?.completedAt,
                  );
                  if (next) openTicket(next.id);
                  else
                    navigate(
                      s.resolved === pack.tickets.length ? "report" : "queue",
                    );
                }}
              />
            ) : (
              <div className="panel empty">
                <LockKeyhole size={30} />
                <h1>Ticket unavailable</h1>
                <p>
                  Return to the queue and resolve the earlier tiers to unlock
                  this request.
                </p>
                <button
                  className="button primary"
                  onClick={() => navigate("queue")}
                >
                  Open Ticket Queue
                </button>
              </div>
            ))}
        </main>
        <footer className="app-footer">
          <span>RIVERSIDE SERVICE DESK</span>
          <span>LEARNING ENVIRONMENT · LOCAL PROGRESS</span>
        </footer>
      </div>
      {manage && (
        <Modal title="Local profile & progress" close={() => setManage(false)}>
          <div className="profile-summary">
            <span className="avatar">
              {profile.name.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h3>{profile.name}</h3>
              <p>
                {s.resolved} tickets resolved · {s.score} points
              </p>
            </div>
          </div>
          <p className="small muted">
            Saved only in this browser. These profiles are not secure accounts.
            Shared or managed computers may clear browser data.
          </p>
          <div className="management-actions">
            <button
              className="button secondary"
              onClick={() => exportProgress(profile)}
            >
              <Download size={17} />
              Export Progress
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setManage(false);
                fileRef.current?.click();
              }}
            >
              <Upload size={17} />
              Import Progress
            </button>
            <button className="button secondary" onClick={signOut}>
              <Users size={17} />
              Switch / Start New Technician
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setManage(false);
                setConfirm("reset");
              }}
            >
              <RotateCcw size={17} />
              Reset Current Shift
            </button>
            <button
              className="button danger"
              onClick={() => {
                setManage(false);
                setConfirm("delete");
              }}
            >
              <Trash2 size={17} />
              Delete Local Profile
            </button>
          </div>
        </Modal>
      )}
      {confirm && (
        <Modal
          title={
            confirm === "reset"
              ? "Reset current shift?"
              : "Delete local profile?"
          }
          close={() => setConfirm(null)}
        >
          <p>
            {confirm === "reset"
              ? `This clears ${profile.name}’s ticket progress, notes, attempts, score and teacher settings for the current shift. The profile remains.`
              : `This removes ${profile.name} and their saved shift from this browser.`}{" "}
            Other technician profiles will be kept.
          </p>
          <p>Export a copy first if you want to keep this work.</p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => exportProgress(profile)}
            >
              <Download size={16} />
              Export first
            </button>
            <button
              className="button secondary"
              onClick={() => setConfirm(null)}
            >
              Cancel
            </button>
            <button className="button danger" onClick={performConfirm}>
              {confirm === "reset"
                ? "Confirm Reset Shift"
                : "Confirm Delete Profile"}
            </button>
          </div>
        </Modal>
      )}
      {teacherModal && (
        <Modal title="Teacher Mode" close={() => setTeacherModal(false)}>
          {!teacher ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pin === teacherPin) {
                  setTeacher(true);
                  setPinError("");
                  setPin("");
                } else setPinError("PIN not recognised. Try again.");
              }}
            >
              <p>
                Local teaching controls for this learner’s browser. This PIN is
                a convenience lock, not genuine security.
              </p>
              <label className="field">
                <span>Teacher PIN</span>
                <input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </label>
              {pinError && (
                <p className="error" role="alert">
                  {pinError}
                </p>
              )}
              <button className="button primary full" type="submit">
                Open teacher controls
              </button>
            </form>
          ) : (
            <>
              <p className="small muted">
                Changes apply to <strong>{profile.name}</strong> on this
                browser. No information is sent to a teacher dashboard.
              </p>
              <div className="teacher-controls">
                {[
                  {
                    key: "unlockAll" as const,
                    label: "Unlock all tickets",
                    hint: "Skip tier locks for this local shift.",
                  },
                  {
                    key: "scoring" as const,
                    label: "Enable scoring",
                    hint: "New submissions earn points when enabled.",
                  },
                  {
                    key: "hints" as const,
                    label: "Enable hints",
                    hint: "Allow learners to reveal ticket clues.",
                  },
                ].map((c) => (
                  <label key={c.key} className="switch-row">
                    <span>
                      <strong>{c.label}</strong>
                      <small>{c.hint}</small>
                    </span>
                    <input
                      type="checkbox"
                      role="switch"
                      checked={profile.settings[c.key]}
                      onChange={(e) =>
                        update((p) => ({
                          ...p,
                          settings: {
                            ...p.settings,
                            [c.key]: e.target.checked,
                          },
                        }))
                      }
                    />
                  </label>
                ))}
                <label className="switch-row">
                  <span>
                    <strong>View answers</strong>
                    <small>
                      Show the answer guide inside tickets while Teacher Mode is
                      open.
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={showAnswers}
                    onChange={(e) => setShowAnswers(e.target.checked)}
                  />
                </label>
                <label className="field">
                  <span>Ticket order within each tier</span>
                  <select
                    value={profile.settings.order}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        settings: {
                          ...p.settings,
                          order: e.target.value as "sequential" | "random",
                        },
                        order:
                          e.target.value === "random"
                            ? shuffle(pack.tickets.map((t) => t.id))
                            : pack.tickets.map((t) => t.id),
                      }))
                    }
                  >
                    <option value="sequential">Sequential</option>
                    <option value="random">Random</option>
                  </select>
                </label>
                <button
                  className="button danger full"
                  onClick={() => {
                    setTeacherModal(false);
                    setConfirm("reset");
                  }}
                >
                  <RotateCcw size={16} />
                  Reset current learner
                </button>
                <button
                  className="button secondary full"
                  onClick={() => {
                    setTeacher(false);
                    setShowAnswers(false);
                    setTeacherModal(false);
                  }}
                >
                  <LogOut size={16} />
                  Close Teacher Mode
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
