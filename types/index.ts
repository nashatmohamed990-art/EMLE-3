// ═══════════════════════════════════════════
//  EMLE QBank — Core TypeScript Types
// ═══════════════════════════════════════════

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Subject =
  | "Internal Medicine"
  | "General Surgery"
  | "Pediatrics"
  | "Obstetrics & Gynecology"
  | "Emergency Medicine"
  | "Psychiatry"
  | "Public Health & Biostatistics";

export type ExamMode = "tutor" | "timed";

export type QuestionStatus = "unused" | "correct" | "incorrect" | "flagged";

// ── A single answer option (A–E) ──────────────────────────────────────────
export interface Option {
  id: string;   // "A" | "B" | "C" | "D" | "E"
  text: string;
}

// ── One full question ─────────────────────────────────────────────────────
export interface Question {
  id: string;
  subject: Subject;
  system: string;         // e.g. "Pulmonology", "Cardiology"
  topic: string;          // e.g. "Pulmonary Embolism"
  difficulty: Difficulty;
  stem: string;           // Clinical vignette
  image?: string;         // Optional image URL/path
  options: Option[];      // Always 5 options A–E
  correctId: string;      // "A" | "B" | "C" | "D" | "E"
  explanation: string;    // Full detailed explanation
  explanationTitle: string; // Short title for the diagnosis/concept
  keyPoint: string;       // One-liner high-yield pearl
  tags: string[];
}

// ── Filters used when building a test ────────────────────────────────────
export interface TestFilters {
  subjects: Subject[];
  difficulties: Difficulty[];
  statuses: QuestionStatus[];
  questionCount: number;
  mode: ExamMode;
}

// ── Live test session stored in localStorage ─────────────────────────────
export interface TestSession {
  id: string;
  mode: ExamMode;
  questionIds: string[];              // Ordered list of question IDs
  answers: Record<string, string>;    // questionId → chosen optionId
  flagged: string[];                  // questionIds that are flagged
  notes: Record<string, string>;      // questionId → user note text
  currentIndex: number;
  startTime: number;                  // Date.now()
  endTime?: number;
  timeLimit?: number;                 // seconds, only for timed mode
  submitted: boolean;
  filters: TestFilters;
}

// ── Summary saved after session completion ────────────────────────────────
export interface SessionSummary {
  id: string;
  date: string;                      // ISO string
  mode: ExamMode;
  score: number;                     // correct count
  total: number;
  timeSpentSecs: number;
  subjectBreakdown: Record<string, { correct: number; total: number }>;
}

// ── Per-question progress record ──────────────────────────────────────────
export interface QuestionProgress {
  questionId: string;
  status: QuestionStatus;
  lastSeen?: number;                 // Date.now()
  timesAnswered: number;
  timesCorrect: number;
}

// ── Aggregated user stats ─────────────────────────────────────────────────
export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  bySubject: Record<string, { answered: number; correct: number }>;
  sessions: SessionSummary[];
  questionProgress: Record<string, QuestionProgress>;
}
