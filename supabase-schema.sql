-- ══════════════════════════════════════════════════════════════
--  EMLE QBank — Supabase Database Schema
--  Run this ONCE in: Supabase Dashboard → SQL Editor → Run
-- ══════════════════════════════════════════════════════════════

-- ── 1. PROFILES TABLE ────────────────────────────────────────
--   One row per user, auto-created on email verification
create table if not exists public.profiles (
  id                    uuid        primary key references auth.users(id) on delete cascade,
  full_name             text        not null default '',
  email                 text        not null default '',
  is_subscribed         boolean     not null default false,
  subscription_plan     text,                          -- '30d' | '90d' | '180d' | '360d'
  subscription_ends_at  timestamptz,
  trial_ends_at         timestamptz,
  stripe_customer_id    text,
  stripe_subscription_id text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Row Level Security: users can only read/update their own profile
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role (used by webhooks/server) can do anything
create policy "Service role has full access to profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');


-- ── 2. QUESTIONS TABLE ───────────────────────────────────────
create table if not exists public.questions (
  id              text        primary key,             -- e.g. "IM-001"
  subject         text        not null,
  system          text        not null,
  topic           text        not null,
  difficulty      text        not null check (difficulty in ('Easy','Medium','Hard')),
  stem            text        not null,
  options         jsonb       not null,                -- [{id, text}, ...]
  correct_id      text        not null,
  explanation     text        not null,
  explanation_title text      not null default '',
  key_point       text        not null default '',
  tags            text[]      not null default '{}',
  image_url       text,
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now()
);

-- Public read access (auth required via RLS on session data)
alter table public.questions enable row level security;

create policy "Authenticated users can read questions"
  on public.questions for select
  to authenticated
  using (is_active = true);

create policy "Service role full access to questions"
  on public.questions for all
  using (auth.role() = 'service_role');


-- ── 3. USER PROGRESS TABLE ──────────────────────────────────
create table if not exists public.question_progress (
  id              bigserial   primary key,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  question_id     text        not null references public.questions(id) on delete cascade,
  status          text        not null default 'unused'
                              check (status in ('unused','correct','incorrect','flagged')),
  times_answered  int         not null default 0,
  times_correct   int         not null default 0,
  last_seen_at    timestamptz,
  unique(user_id, question_id)
);

alter table public.question_progress enable row level security;

create policy "Users can manage own progress"
  on public.question_progress for all
  using (auth.uid() = user_id);


-- ── 4. TEST SESSIONS TABLE ───────────────────────────────────
create table if not exists public.test_sessions (
  id              text        primary key,             -- session_<timestamp>
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  mode            text        not null check (mode in ('tutor','timed')),
  question_ids    text[]      not null,
  answers         jsonb       not null default '{}',   -- {questionId: chosenId}
  flagged         text[]      not null default '{}',
  notes           jsonb       not null default '{}',   -- {questionId: noteText}
  current_index   int         not null default 0,
  score           int,
  total           int,
  time_spent_secs int,
  submitted       boolean     not null default false,
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  filters         jsonb
);

alter table public.test_sessions enable row level security;

create policy "Users can manage own sessions"
  on public.test_sessions for all
  using (auth.uid() = user_id);


-- ── 5. INDEXES for performance ───────────────────────────────
create index if not exists questions_subject_idx    on public.questions(subject);
create index if not exists questions_difficulty_idx on public.questions(difficulty);
create index if not exists questions_active_idx     on public.questions(is_active);
create index if not exists progress_user_idx        on public.question_progress(user_id);
create index if not exists sessions_user_idx        on public.test_sessions(user_id);


-- ── 6. TRIGGER: auto-update profiles.updated_at ─────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();


-- ══════════════════════════════════════════════════════════════
--  Supabase Auth Settings (do these in the Dashboard UI):
--
--  Authentication → Email Templates:
--    Change "Confirm signup" button URL to:
--    {{ .SiteURL }}/auth/callback?code={{ .Token }}&type=signup
--
--  Authentication → URL Configuration:
--    Site URL: https://yourdomain.com (or http://localhost:3000 for dev)
--    Redirect URLs: add http://localhost:3000/auth/callback
-- ══════════════════════════════════════════════════════════════
