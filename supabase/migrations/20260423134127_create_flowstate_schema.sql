/*
  # FlowState Commander — Initial Schema

  ## Overview
  Creates all tables needed for the ADHD-centric planner app.

  ## Tables

  ### tasks
  - Daily time-blocked tasks on the visual timeline
  - Fields: id, user_id, title, date, start_hour (float, e.g. 9.5 = 9:30), duration_units (1-4, each = 15min),
    is_buffer (auto buffer blocks), status (pending/active/done/skipped), distraction_count, focus_minutes

  ### habits
  - Up to 3 keystone habits per user
  - Fields: id, user_id, name, icon, color, active, created_at

  ### habit_logs
  - Daily non-binary habit completion log
  - Fields: id, habit_id, user_id, date, state (done/partial/adapted/forgive)

  ### focus_sessions
  - Body double / pomodoro focus sessions
  - Fields: id, user_id, task_id (nullable), started_at, ended_at, duration_minutes, ambient_sound, completed

  ### weekly_reviews
  - Weekly planning ritual snapshots
  - Fields: id, user_id, week_start, notes, intention, tasks_completed, tasks_total, focus_minutes_total

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
*/

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  start_hour numeric(4,2) NOT NULL DEFAULT 9.0,
  duration_units integer NOT NULL DEFAULT 2 CHECK (duration_units BETWEEN 1 AND 8),
  is_buffer boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','done','skipped')),
  distraction_count integer NOT NULL DEFAULT 0,
  focus_minutes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own tasks"
  ON tasks FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- habits
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '⭐',
  color text NOT NULL DEFAULT '#14b8a6',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own habits"
  ON habits FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- habit_logs
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  state text NOT NULL DEFAULT 'done' CHECK (state IN ('done','partial','adapted','forgive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (habit_id, date)
);

ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own habit_logs"
  ON habit_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit_logs"
  ON habit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit_logs"
  ON habit_logs FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit_logs"
  ON habit_logs FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- focus_sessions
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer NOT NULL DEFAULT 25,
  ambient_sound text NOT NULL DEFAULT 'rain',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own focus_sessions"
  ON focus_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own focus_sessions"
  ON focus_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus_sessions"
  ON focus_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus_sessions"
  ON focus_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- weekly_reviews
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  intention text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  tasks_completed integer NOT NULL DEFAULT 0,
  tasks_total integer NOT NULL DEFAULT 0,
  focus_minutes_total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start)
);

ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own weekly_reviews"
  ON weekly_reviews FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly_reviews"
  ON weekly_reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly_reviews"
  ON weekly_reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly_reviews"
  ON weekly_reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS tasks_user_date_idx ON tasks (user_id, date);
CREATE INDEX IF NOT EXISTS habit_logs_user_date_idx ON habit_logs (user_id, date);
CREATE INDEX IF NOT EXISTS focus_sessions_user_idx ON focus_sessions (user_id, started_at DESC);
