"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { TestSession, Question } from "@/types";
import { getQuestionById, SUBJECT_COLORS } from "@/lib/questions";

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function saveSession(s: TestSession) {
  localStorage.setItem("emle_active_session", JSON.stringify(s));
}

// ══════════════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

// ── Top progress bar ───────────────────────────────────────────
function ProgressBar({ current, total, answered }: { current: number; total: number; answered: number }) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--blue)" }} />
    </div>
  );
}

// ── Countdown timer (timed mode) ───────────────────────────────
function Timer({ remaining, total }: { remaining: number; total: number }) {
  const pct = total > 0 ? remaining / total : 1;
  const color = pct > 0.4 ? "var(--green)" : pct > 0.15 ? "var(--amber)" : "var(--red)";
  const urgent = pct <= 0.15;
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: `${color}15`, border: `1.5px solid ${color}40` }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      <span className={`font-mono font-black text-sm ${urgent ? "animate-blink" : ""}`} style={{ color }}>
        {fmtTime(remaining)}
      </span>
    </div>
  );
}

// ── Option button ──────────────────────────────────────────────
interface OptionProps {
  id: string; text: string; chosen: string | null;
  correctId: string; revealed: boolean; onSelect: (id: string) => void;
}
function OptionButton({ id, text, chosen, correctId, revealed, onSelect }: OptionProps) {
  const isChosen  = chosen === id;
  const isCorrect = id === correctId;

  let bg = "var(--bg-card)", border = "var(--border)", color = "var(--text-mid)", icon = null;

  if (revealed) {
    if (isCorrect) {
      bg = "rgba(16,185,129,.07)"; border = "#10B981"; color = "#059669";
      icon = <span className="w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center font-black flex-shrink-0">✓</span>;
    } else if (isChosen && !isCorrect) {
      bg = "rgba(239,68,68,.06)"; border = "#EF4444"; color = "#DC2626";
      icon = <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-black flex-shrink-0">✗</span>;
    } else {
      color = "var(--text-muted)";
    }
  } else if (isChosen) {
    bg = "var(--blue-soft)"; border = "var(--blue)"; color = "var(--blue)";
  }

  return (
    <button onClick={() => !revealed && onSelect(id)}
      className="w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: bg, borderColor: border, color,
        cursor: revealed ? "default" : "pointer",
        transform: !revealed && !chosen ? undefined : "none",
      }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ background: revealed && isCorrect ? "#10B981" : revealed && isChosen ? "#EF4444" : isChosen ? "var(--blue)" : "var(--border)", color: (revealed || isChosen) ? "#fff" : "var(--text-muted)" }}>
        {id}
      </div>
      <span className="text-sm leading-relaxed flex-1">{text}</span>
      {icon}
    </button>
  );
}

// ── Explanation panel ──────────────────────────────────────────
function ExplanationPanel({ question, chosen }: { question: Question; chosen: string }) {
  const correct = chosen === question.correctId;
  const [tab, setTab] = useState<"explanation" | "keypoint">("explanation");

  return (
    <div className="rounded-2xl overflow-hidden border-2 mt-6 animate-fade-up"
      style={{ borderColor: correct ? "#10B981" : "#EF4444" }}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3" style={{ background: correct ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)" }}>
        <span className="text-xl">{correct ? "✅" : "❌"}</span>
        <div className="flex-1">
          <div className="font-black text-sm" style={{ color: correct ? "#059669" : "#DC2626" }}>
            {correct ? "Correct!" : "Incorrect"} — {question.explanationTitle}
          </div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {question.subject} · {question.system} · {question.topic}
          </div>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: question.difficulty === "Easy" ? "rgba(16,185,129,.15)" : question.difficulty === "Medium" ? "rgba(245,158,11,.15)" : "rgba(239,68,68,.15)", color: question.difficulty === "Easy" ? "#059669" : question.difficulty === "Medium" ? "#D97706" : "#DC2626" }}>
          {question.difficulty}
        </span>
      </div>

      {/* Tab nav */}
      <div className="flex border-b" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        {(["explanation", "keypoint"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 text-xs font-bold cursor-pointer border-b-2 transition-all"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "transparent", borderColor: tab === t ? "var(--blue)" : "transparent", color: tab === t ? "var(--blue)" : "var(--text-muted)" }}>
            {t === "explanation" ? "💡 Full Explanation" : "⭐ Key Point"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5" style={{ background: "var(--bg-card)" }}>
        {tab === "explanation" ? (
          <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-mid)" }}>
            {question.explanation.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={i} style={{ color: "var(--text)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                : <span key={i}>{part}</span>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(0,87,255,.06)", border: "1px solid rgba(0,87,255,.15)" }}>
            <span className="text-lg flex-shrink-0">💎</span>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--text)" }}>{question.keyPoint}</p>
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mt-4">
          {question.tags.map(tag => (
            <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "var(--border)", color: "var(--text-muted)" }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Results screen ─────────────────────────────────────────────
function ResultsScreen({ session, questions, onReview, onNew }: {
  session: TestSession; questions: Question[];
  onReview: () => void; onNew: () => void;
}) {
  const correct = questions.filter(q => session.answers[q.id] === q.correctId).length;
  const total   = questions.length;
  const pct     = Math.round((correct / total) * 100);
  const timeSecs = session.endTime ? Math.round((session.endTime - session.startTime) / 1000) : 0;

  const passed = pct >= 60;
  const color  = pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)";

  const bySubject: Record<string, { c: number; t: number }> = {};
  questions.forEach(q => {
    if (!bySubject[q.subject]) bySubject[q.subject] = { c: 0, t: 0 };
    bySubject[q.subject].t++;
    if (session.answers[q.id] === q.correctId) bySubject[q.subject].c++;
  });

  return (
    <div className="max-w-[720px] mx-auto px-6 pt-[88px] pb-20">
      {/* Score circle */}
      <div className="card p-8 text-center mb-6">
        <div className="text-4xl mb-3">{pct >= 80 ? "🏆" : pct >= 60 ? "✅" : "📚"}</div>
        <div className="font-black mb-1" style={{ fontSize: "64px", lineHeight: 1, color }}>
          {pct}<span style={{ fontSize: "28px" }}>%</span>
        </div>
        <div className="font-bold text-lg mb-1">{correct} / {total} Correct</div>
        <div className="text-sm font-semibold mb-4" style={{ color: "var(--text-muted)" }}>
          {passed ? "✨ Great job! Keep it up." : "📖 Review the explanations and try again."}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { v: `${correct}`, l: "Correct",   c: "var(--green)" },
            { v: `${total - correct}`, l: "Incorrect", c: "var(--red)"   },
            { v: fmtTime(timeSecs), l: "Time Spent", c: "var(--blue)"  },
          ].map(({ v, l, c }) => (
            <div key={l} className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>
              <div className="font-black text-xl" style={{ color: c }}>{v}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject breakdown */}
      {Object.keys(bySubject).length > 1 && (
        <div className="card p-6 mb-6">
          <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text-muted)" }}>BREAKDOWN BY SUBJECT</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(bySubject).map(([subj, { c, t }]) => (
              <div key={subj}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{subj}</span>
                  <span className="font-bold" style={{ color: c === t ? "var(--green)" : c === 0 ? "var(--red)" : "var(--amber)" }}>
                    {c}/{t}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((c / t) * 100)}%`, background: SUBJECT_COLORS[subj] || "var(--blue)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onReview} className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--blue-soft)", color: "var(--blue)", border: "2px solid var(--blue)" }}>
          📖 Review Answers
        </button>
        <button onClick={onNew} className="flex-1 py-3 rounded-xl font-bold text-sm text-white cursor-pointer"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--blue)", border: "none", boxShadow: "0 4px 16px rgba(0,87,255,.35)" }}>
          🚀 New Test
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN SESSION PAGE
// ══════════════════════════════════════════════════════════════
export default function SessionPage() {
  const router = useRouter();

  const [session,   setSession]   = useState<TestSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [elapsed,   setElapsed]   = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [view,      setView]      = useState<"exam" | "results" | "review">("exam");
  const [noteText,  setNoteText]  = useState("");
  const [showNote,  setShowNote]  = useState(false);
  const [showNav,   setShowNav]   = useState(false);
  const [toast,     setToast]     = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load session ────────────────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("emle_active_session");
    if (!raw) { router.replace("/qbank"); return; }
    const s: TestSession = JSON.parse(raw);
    if (s.submitted) { setSession(s); setView("results"); }
    else              setSession(s);
    const qs = s.questionIds.map(id => getQuestionById(id)).filter(Boolean) as Question[];
    setQuestions(qs);
    if (s.mode === "timed" && s.timeLimit) {
      const spent = Math.round((Date.now() - s.startTime) / 1000);
      setRemaining(Math.max(0, s.timeLimit - spent));
    }
  }, [router]);

  // ── Timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - session.startTime) / 1000));
      if (session.mode === "timed" && session.timeLimit) {
        const r = Math.max(0, session.timeLimit - Math.round((Date.now() - session.startTime) / 1000));
        setRemaining(r);
        if (r === 0) { clearInterval(timerRef.current!); handleSubmit(); }
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  // ── Helpers ─────────────────────────────────────────────────
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const current = session ? questions[session.currentIndex] : null;
  const chosenId = (session && current) ? (session.answers[current.id] ?? null) : null;
  const isRevealed = session?.mode === "tutor" && chosenId !== null;
  const isFlagged  = session ? session.flagged.includes(current?.id ?? "") : false;

  // ── Select answer ───────────────────────────────────────────
  const handleSelect = useCallback((optId: string) => {
    if (!session || !current) return;
    if (session.mode === "tutor" && session.answers[current.id]) return; // lock after answer in tutor
    const updated: TestSession = {
      ...session,
      answers: { ...session.answers, [current.id]: optId },
    };
    setSession(updated);
    saveSession(updated);
  }, [session, current]);

  // ── Navigate ─────────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    if (!session) return;
    const noteForCurrent = noteText.trim();
    const updated: TestSession = {
      ...session,
      currentIndex: idx,
      notes: noteForCurrent ? { ...session.notes, [current?.id ?? ""]: noteForCurrent } : session.notes,
    };
    setSession(updated);
    saveSession(updated);
    setNoteText(updated.notes[questions[idx]?.id] || "");
    setShowNote(false);
    setShowNav(false);
  }, [session, noteText, current, questions]);

  const goNext = () => { if (session && session.currentIndex < questions.length - 1) goTo(session.currentIndex + 1); };
  const goPrev = () => { if (session && session.currentIndex > 0) goTo(session.currentIndex - 1); };

  // Load note for current Q
  useEffect(() => {
    if (session && current) setNoteText(session.notes[current.id] || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.currentIndex]);

  // ── Flag ─────────────────────────────────────────────────────
  const toggleFlag = () => {
    if (!session || !current) return;
    const flagged = isFlagged
      ? session.flagged.filter(id => id !== current.id)
      : [...session.flagged, current.id];
    const updated = { ...session, flagged };
    setSession(updated);
    saveSession(updated);
    showToast(isFlagged ? "🏁 Unflagged" : "🚩 Question flagged for review");
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!session) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const updated: TestSession = { ...session, submitted: true, endTime: Date.now() };
    setSession(updated);
    saveSession(updated);
    setView("results");
  }, [session]);

  const confirmedSubmit = () => {
    const answered = Object.keys(session?.answers ?? {}).length;
    const total    = questions.length;
    if (answered < total) {
      if (!window.confirm(`You have ${total - answered} unanswered question${total - answered > 1 ? "s" : ""}. Submit anyway?`)) return;
    }
    handleSubmit();
  };

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (isRevealed || session?.mode === "timed") {
        if (e.key === "ArrowRight" || e.key === "n") goNext();
        if (e.key === "ArrowLeft"  || e.key === "p") goPrev();
      }
      if (!isRevealed && current) {
        const map: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D", "5": "E", "a": "A", "b": "B", "c": "C", "d": "D", "e": "E" };
        if (map[e.key.toLowerCase()]) handleSelect(map[e.key.toLowerCase()]);
      }
      if (e.key === "f" || e.key === "F") toggleFlag();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, current, isRevealed, goNext, goPrev, handleSelect]);

  // ── RENDER: loading ──────────────────────────────────────────
  if (!session || !current) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p style={{ color: "var(--text-mid)" }}>Loading your test...</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(session.answers).length;
  const sessionQ = questions;

  // ── RENDER: results ──────────────────────────────────────────
  if (view === "results") {
    return (
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        {/* Minimal header */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 font-extrabold text-base">
            <div className="w-8 h-8 rounded-[7px] flex items-center justify-center" style={{ background: "var(--blue)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color: "var(--blue)" }}>QBank</span>
          </div>
          {view === "review" ? (
            <button onClick={() => setView("results")} className="btn btn-outline text-xs px-4 py-2">← Results</button>
          ) : (
            <button onClick={() => setView("review")} className="btn btn-outline text-xs px-4 py-2">📖 Review Answers</button>
          )}
        </div>
        {view === "results"
          ? <ResultsScreen session={session} questions={sessionQ} onReview={() => setView("review")} onNew={() => router.push("/qbank")} />
          : <ReviewScreen session={session} questions={sessionQ} />
        }
      </div>
    );
  }

  // ── RENDER: exam ─────────────────────────────────────────────
  const subjectColor = SUBJECT_COLORS[current.subject] || "var(--blue)";

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        {/* Progress bar at very top */}
        <div className="px-0">
          <ProgressBar current={session.currentIndex} total={questions.length} answered={answeredCount} />
        </div>

        <div className="flex items-center justify-between px-4 h-[52px]">
          {/* Left: logo + session info */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: "var(--blue)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                Q {session.currentIndex + 1} / {questions.length}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: session.mode === "tutor" ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", color: session.mode === "tutor" ? "var(--green)" : "var(--red)" }}>
                {session.mode === "tutor" ? "🎓 Tutor" : "⏱ Timed"}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${subjectColor}18`, color: subjectColor }}>
                {current.subject}
              </span>
            </div>
          </div>

          {/* Right: timer, answered, flag, submit, nav */}
          <div className="flex items-center gap-2">
            {session.mode === "timed" && remaining !== null ? (
              <Timer remaining={remaining} total={session.timeLimit ?? 1} />
            ) : (
              <span className="text-xs font-mono font-bold hidden sm:block" style={{ color: "var(--text-muted)" }}>{fmtTime(elapsed)}</span>
            )}

            <span className="text-xs font-bold px-2 py-1 rounded-full hidden sm:block" style={{ background: "var(--bg)", color: "var(--text-muted)" }}>
              {answeredCount}/{questions.length} answered
            </span>

            <button onClick={toggleFlag}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer"
              style={{ background: isFlagged ? "rgba(245,158,11,.15)" : "var(--bg)", border: "1px solid var(--border)", color: isFlagged ? "var(--amber)" : "var(--text-muted)" }}
              title="Flag for review (F)">
              🚩
            </button>

            <button onClick={() => setShowNote(n => !n)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm cursor-pointer"
              style={{ background: session.notes[current.id] ? "rgba(0,87,255,.1)" : "var(--bg)", border: "1px solid var(--border)", color: session.notes[current.id] ? "var(--blue)" : "var(--text-muted)" }}
              title="Add note">
              📝
            </button>

            <button onClick={() => setShowNav(n => !n)}
              className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-sm cursor-pointer"
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              title="Question navigator">
              ☰
            </button>

            <button onClick={confirmedSubmit}
              className="px-3 py-1.5 rounded-lg text-xs font-black text-white cursor-pointer"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--blue)", border: "none", boxShadow: "0 2px 8px rgba(0,87,255,.35)" }}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* ── QUESTION NAVIGATOR OVERLAY ──────────────────────── */}
      {showNav && (
        <div className="fixed top-[68px] right-4 z-40 p-4 rounded-2xl shadow-2xl w-72"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Navigator</span>
            <button onClick={() => setShowNav(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px" }}>✕</button>
          </div>
          <div className="grid grid-cols-8 gap-1 max-h-60 overflow-y-auto">
            {questions.map((q, i) => {
              const ans = session.answers[q.id];
              const correct = ans === q.correctId;
              const flagged = session.flagged.includes(q.id);
              let bg = "var(--border)", col = "var(--text-muted)";
              if (i === session.currentIndex) { bg = "var(--blue)"; col = "#fff"; }
              else if (ans && session.mode === "tutor") { bg = correct ? "#10B981" : "#EF4444"; col = "#fff"; }
              else if (ans) { bg = "var(--blue-soft)"; col = "var(--blue)"; }
              return (
                <button key={q.id} onClick={() => goTo(i)}
                  className="w-full aspect-square rounded-lg text-[11px] font-black cursor-pointer relative"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: bg, color: col, border: "none" }}>
                  {i + 1}
                  {flagged && <span className="absolute -top-0.5 -right-0.5 text-[8px]">🚩</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-2 flex-wrap text-[10px]">
            {[["■ Current","var(--blue)"],["■ Correct","#10B981"],["■ Wrong","#EF4444"],["■ Answered","var(--blue-soft)"],["■ Unseen","var(--border)"]].map(([l,c]) => (
              <span key={l} style={{ color: c === "var(--blue-soft)" ? "var(--blue)" : c }}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── NOTE PANEL ──────────────────────────────────────── */}
      {showNote && (
        <div className="fixed top-[68px] right-14 z-40 p-4 rounded-2xl shadow-2xl w-72"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold">📝 My Note</span>
            <button onClick={() => setShowNote(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
          </div>
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} placeholder="Add a personal note for this question..."
            className="input-field text-xs resize-none" style={{ padding: "10px" }} />
          <button onClick={() => {
            if (!session || !current) return;
            const updated = { ...session, notes: { ...session.notes, [current.id]: noteText.trim() } };
            setSession(updated); saveSession(updated); setShowNote(false);
            showToast("📝 Note saved");
          }} className="mt-2 w-full py-2 rounded-lg text-xs font-bold text-white cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--blue)", border: "none" }}>
            Save Note
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main className="max-w-[800px] mx-auto px-4 pt-[80px] pb-24">

        {/* Q metadata bar */}
        <div className="flex items-center gap-2 flex-wrap mt-6 mb-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${subjectColor}18`, color: subjectColor, border: `1px solid ${subjectColor}30` }}>
            {current.subject}
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>›</span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{current.system}</span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>›</span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{current.topic}</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: current.difficulty === "Easy" ? "rgba(16,185,129,.12)" : current.difficulty === "Medium" ? "rgba(245,158,11,.12)" : "rgba(239,68,68,.12)", color: current.difficulty === "Easy" ? "#059669" : current.difficulty === "Medium" ? "#D97706" : "#DC2626" }}>
            {current.difficulty}
          </span>
        </div>

        {/* Question stem */}
        <div className="card p-6 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5" style={{ background: "var(--blue)" }}>
              {session.currentIndex + 1}
            </div>
            <p className="text-[15px] leading-relaxed font-medium" style={{ color: "var(--text)" }}>
              {current.stem}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {current.options.map(opt => (
            <OptionButton key={opt.id} id={opt.id} text={opt.text}
              chosen={chosenId} correctId={current.correctId}
              revealed={isRevealed} onSelect={handleSelect} />
          ))}
        </div>

        {/* Keyboard hint */}
        {!chosenId && (
          <p className="text-[11px] text-center mb-4" style={{ color: "var(--text-muted)" }}>
            Press <strong>A–E</strong> or <strong>1–5</strong> to select · <strong>F</strong> to flag
          </p>
        )}

        {/* Explanation (tutor mode) */}
        {isRevealed && session.mode === "tutor" && chosenId && (
          <ExplanationPanel question={current} chosen={chosenId} />
        )}

        {/* Timed mode: no explanation until submit */}
        {session.mode === "timed" && chosenId && (
          <div className="mt-4 p-3 rounded-xl text-xs font-semibold text-center"
            style={{ background: "rgba(245,158,11,.08)", color: "var(--amber)", border: "1px solid rgba(245,158,11,.2)" }}>
            ⏱ Timed Mode — Explanations revealed after submitting the test
          </div>
        )}
      </main>

      {/* ── BOTTOM NAV BAR ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t px-4 py-3 flex items-center justify-between gap-3"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>

        <button onClick={goPrev} disabled={session.currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: session.currentIndex === 0 ? "var(--border)" : "var(--bg)", color: session.currentIndex === 0 ? "var(--text-muted)" : "var(--text)", border: "1.5px solid var(--border)" }}>
          ← Prev
        </button>

        {/* Mobile Q counter */}
        <button onClick={() => setShowNav(n => !n)} className="text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
          style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-mid)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {session.currentIndex + 1} / {questions.length}
        </button>

        {session.currentIndex < questions.length - 1 ? (
          <button onClick={goNext}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--blue)", border: "none", boxShadow: "0 2px 10px rgba(0,87,255,.35)" }}>
            Next →
          </button>
        ) : (
          <button onClick={confirmedSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black text-white cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--green)", border: "none", boxShadow: "0 2px 10px rgba(16,185,129,.35)" }}>
            Finish ✓
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="toast" style={{ opacity: 1, transform: "translateY(0)" }}>{toast}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  REVIEW SCREEN — shown after results, scrollable
// ══════════════════════════════════════════════════════════════
function ReviewScreen({ session, questions }: { session: TestSession; questions: Question[] }) {
  return (
    <div className="max-w-[800px] mx-auto px-4 pt-[88px] pb-20">
      <h2 className="font-extrabold text-2xl mb-6" style={{ letterSpacing: "-.01em" }}>Answer Review</h2>
      <div className="flex flex-col gap-8">
        {questions.map((q, i) => {
          const chosen  = session.answers[q.id] ?? null;
          const correct = chosen === q.correctId;
          return (
            <div key={q.id} className="card p-6">
              {/* Q header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                  style={{ background: !chosen ? "var(--text-muted)" : correct ? "#10B981" : "#EF4444" }}>
                  {i + 1}
                </div>
                <span className="text-xs font-bold" style={{ color: SUBJECT_COLORS[q.subject] || "var(--blue)" }}>{q.subject}</span>
                <span className="ml-auto text-xs font-bold" style={{ color: !chosen ? "var(--text-muted)" : correct ? "var(--green)" : "var(--red)" }}>
                  {!chosen ? "Not answered" : correct ? "✓ Correct" : "✗ Incorrect"}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4 font-medium" style={{ color: "var(--text)" }}>{q.stem}</p>
              <div className="flex flex-col gap-2">
                {q.options.map(opt => (
                  <OptionButton key={opt.id} id={opt.id} text={opt.text}
                    chosen={chosen} correctId={q.correctId}
                    revealed={true} onSelect={() => {}} />
                ))}
              </div>
              {chosen && <ExplanationPanel question={q} chosen={chosen} />}
              {!chosen && (
                <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(0,87,255,.06)", border: "1px solid rgba(0,87,255,.15)" }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--blue)" }}>Correct answer: {q.correctId}</p>
                  <ExplanationPanel question={q} chosen={q.correctId} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
