"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  QUESTION_BANK, ALL_SUBJECTS, ALL_DIFFICULTIES,
  SUBJECT_COLORS, SUBJECT_ICONS, filterQuestions,
} from "@/lib/questions";
import type { Subject, Difficulty, ExamMode, TestFilters, TestSession } from "@/types";

function StatCard({ value, label, color }: { value: string | number; label: string; color?: string }) {
  return (
    <div className="card p-5 flex flex-col gap-1">
      <span className="text-2xl font-black" style={{ color: color || "var(--blue)" }}>{value}</span>
      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function Pill({ label, active, color, onClick }: { label: string; active: boolean; color?: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: active ? (color || "var(--blue)") : "var(--bg)",
        color:      active ? "#fff" : "var(--text-mid)",
        borderColor: active ? (color || "var(--blue)") : "var(--border)",
        boxShadow:  active ? `0 2px 10px ${color || "rgba(0,87,255,.3)"}40` : "none",
        transform:  active ? "scale(1.03)" : "scale(1)",
      }}>
      {label}
    </button>
  );
}

function ModeCard({ mode, selected, onClick }: { mode: ExamMode; selected: boolean; onClick: () => void }) {
  const cfg = {
    tutor: {
      icon: "🎓", title: "Tutor Mode",
      desc: "See the full explanation immediately after each answer. Best for learning and reviewing concepts.",
      badge: "Recommended for studying",
      badgeColor: "rgba(16,185,129,.1)", badgeTxt: "var(--green)",
    },
    timed: {
      icon: "⏱", title: "Timed Mode",
      desc: "No feedback until you finish the test. 90 seconds per question. Simulates real EMLE conditions.",
      badge: "Exam simulation",
      badgeColor: "rgba(239,68,68,.1)", badgeTxt: "var(--red)",
    },
  }[mode];
  return (
    <button onClick={onClick}
      className="card p-5 text-left cursor-pointer transition-all w-full border-2"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        borderColor: selected ? "var(--blue)" : "var(--border)",
        background:  selected ? "var(--blue-soft)" : "var(--bg-card)",
        boxShadow:   selected ? "0 0 0 3px rgba(0,87,255,.12)" : "var(--shadow)",
      }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{cfg.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">{cfg.title}</span>
            {selected && <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: "var(--blue)" }}>✓ Selected</span>}
          </div>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-mid)" }}>{cfg.desc}</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.badgeColor, color: cfg.badgeTxt }}>{cfg.badge}</span>
        </div>
      </div>
    </button>
  );
}

export default function QBankBuilderPage() {
  const router = useRouter();
  const [selectedSubjects,     setSubjects]     = useState<Subject[]>([]);
  const [selectedDifficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [questionCount,        setCount]        = useState(10);
  const [mode,                 setMode]         = useState<ExamMode>("tutor");
  const [launching,            setLaunching]    = useState(false);

  const pool = useMemo(() => filterQuestions({
    subjects:     selectedSubjects.length     ? selectedSubjects     : undefined,
    difficulties: selectedDifficulties.length ? selectedDifficulties : undefined,
  }), [selectedSubjects, selectedDifficulties]);

  const maxQ  = pool.length;
  const safeQ = Math.min(questionCount, maxQ);

  const subjectCounts = useMemo(() => {
    const map: Record<string, number> = {};
    QUESTION_BANK.forEach(q => { map[q.subject] = (map[q.subject] || 0) + 1; });
    return map;
  }, []);

  useEffect(() => {
    if (questionCount > maxQ && maxQ > 0) setCount(maxQ);
  }, [maxQ, questionCount]);

  const toggleSubject    = (s: Subject)    => setSubjects(prev    => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleDifficulty = (d: Difficulty) => setDifficulties(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const DIFF_COLORS: Record<Difficulty, string> = { Easy: "#10B981", Medium: "#F59E0B", Hard: "#EF4444" };

  const handleStart = () => {
    if (pool.length === 0) return;
    setLaunching(true);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, safeQ);
    const filters: TestFilters = { subjects: selectedSubjects, difficulties: selectedDifficulties, statuses: [], questionCount: safeQ, mode };
    const session: TestSession = {
      id: `session_${Date.now()}`, mode,
      questionIds: shuffled.map(q => q.id),
      answers: {}, flagged: [], notes: {},
      currentIndex: 0, startTime: Date.now(),
      timeLimit: mode === "timed" ? safeQ * 90 : undefined,
      submitted: false, filters,
    };
    localStorage.setItem("emle_active_session", JSON.stringify(session));
    router.push("/qbank/session");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-[1180px] mx-auto px-6 pt-[88px] pb-20">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📚</span>
            <h1 className="font-extrabold text-3xl" style={{ letterSpacing: "-.02em" }}>Question Bank</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-mid)" }}>Build a custom test. Choose your subjects, difficulty, count, and mode — then start.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value={QUESTION_BANK.length} label="Total Questions" color="var(--blue)" />
          <StatCard value={pool.length}          label="Matching Filters" color={pool.length === 0 ? "var(--red)" : "var(--green)"} />
          <StatCard value={safeQ}               label="Will Be Used" color="var(--blue)" />
          <StatCard value={`${Math.round(safeQ * 1.5)} min`} label={mode === "timed" ? "Time Allowed" : "Est. Study Time"} color="var(--amber)" />
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
          <div className="flex flex-col gap-5">

            {/* Mode */}
            <div className="card p-6">
              <h2 className="font-bold text-base mb-4 flex items-center gap-2"><span style={{ color: "var(--blue)" }}>01</span> Choose Mode</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <ModeCard mode="tutor" selected={mode === "tutor"} onClick={() => setMode("tutor")} />
                <ModeCard mode="timed" selected={mode === "timed"} onClick={() => setMode("timed")} />
              </div>
            </div>

            {/* Subjects */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base flex items-center gap-2"><span style={{ color: "var(--blue)" }}>02</span> Subjects</h2>
                <button onClick={() => setSubjects([])} className="text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
                  style={{ background: "var(--blue-soft)", color: "var(--blue)", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  All Subjects
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map(s => (
                  <Pill key={s} label={`${SUBJECT_ICONS[s]} ${s} (${subjectCounts[s] || 0})`}
                    active={selectedSubjects.includes(s as Subject)} color={SUBJECT_COLORS[s]}
                    onClick={() => toggleSubject(s as Subject)} />
                ))}
              </div>
              {selectedSubjects.length > 0 && (
                <p className="text-xs mt-3 font-semibold" style={{ color: "var(--text-muted)" }}>
                  {selectedSubjects.length} subject{selectedSubjects.length > 1 ? "s" : ""} selected · {pool.length} question{pool.length !== 1 ? "s" : ""} available
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base flex items-center gap-2"><span style={{ color: "var(--blue)" }}>03</span> Difficulty</h2>
                <button onClick={() => setDifficulties([])} className="text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
                  style={{ background: "var(--blue-soft)", color: "var(--blue)", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  All Levels
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {ALL_DIFFICULTIES.map(d => (
                  <Pill key={d} label={`${d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} ${d}`}
                    active={selectedDifficulties.includes(d as Difficulty)} color={DIFF_COLORS[d as Difficulty]}
                    onClick={() => toggleDifficulty(d as Difficulty)} />
                ))}
              </div>
            </div>

            {/* Count */}
            <div className="card p-6">
              <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                <span style={{ color: "var(--blue)" }}>04</span> Number of Questions
                <span className="ml-auto font-black text-lg" style={{ color: "var(--blue)" }}>{safeQ}</span>
              </h2>
              <div className="flex gap-2 flex-wrap mb-4">
                {[5, 10, 20, 40].map(n => (
                  <button key={n} onClick={() => setCount(Math.min(n, maxQ))}
                    className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer border"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: safeQ === n ? "var(--blue)" : "var(--bg)", color: safeQ === n ? "#fff" : "var(--text-mid)", borderColor: safeQ === n ? "var(--blue)" : "var(--border)" }}>
                    {n}Q
                  </button>
                ))}
              </div>
              <input type="range" min={1} max={maxQ || 1} value={safeQ}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--blue)", background: `linear-gradient(to right, var(--blue) ${maxQ ? (safeQ / maxQ) * 100 : 0}%, var(--border) 0%)` }} />
              <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                <span>1</span><span>{maxQ} available</span>
              </div>
              {pool.length === 0 && (
                <div className="mt-3 p-3 rounded-lg text-xs font-semibold" style={{ background: "rgba(239,68,68,.08)", color: "var(--red)", border: "1px solid rgba(239,68,68,.2)" }}>
                  ⚠️ No questions match these filters. Adjust your selection above.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-[80px]">
            <div className="card p-6">
              <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text-muted)" }}>TEST SUMMARY</h3>
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: "Mode",       value: mode === "tutor" ? "🎓 Tutor Mode" : "⏱ Timed Mode" },
                  { label: "Subjects",   value: selectedSubjects.length === 0 ? "All Subjects" : `${selectedSubjects.length} selected` },
                  { label: "Difficulty", value: selectedDifficulties.length === 0 ? "All Levels" : selectedDifficulties.join(", ") },
                  { label: "Questions",  value: `${safeQ} questions` },
                  { label: "Time",       value: mode === "timed" ? `${Math.round(safeQ * 1.5)} minutes` : "No time limit" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span className="text-xs font-bold">{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleStart} disabled={pool.length === 0 || launching}
                className="w-full py-4 rounded-xl text-sm font-black text-white cursor-pointer"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: pool.length === 0 ? "var(--border)" : "var(--blue)", border: "none", boxShadow: pool.length > 0 ? "0 6px 20px rgba(0,87,255,.35)" : "none", opacity: launching ? 0.7 : 1 }}>
                {launching ? "⏳ Loading..." : `🚀 Start ${safeQ}-Question Test`}
              </button>
              <p className="text-center text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>Questions are randomized from the pool</p>
            </div>

            <div className="card p-5">
              <h3 className="font-bold text-xs mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Full Bank Coverage</h3>
              <div className="flex flex-col gap-2">
                {ALL_SUBJECTS.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-sm w-5 text-center">{SUBJECT_ICONS[s]}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: "var(--text-mid)" }}>{s}</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full" style={{ background: `${SUBJECT_COLORS[s]}18`, color: SUBJECT_COLORS[s] }}>
                      {subjectCounts[s] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
