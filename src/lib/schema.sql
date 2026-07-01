CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  grade INTEGER,
  consent_given INTEGER NOT NULL DEFAULT 0,
  consent_date INTEGER,
  paid_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS holland_results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  answers TEXT NOT NULL,
  r_score INTEGER NOT NULL,
  i_score INTEGER NOT NULL,
  a_score INTEGER NOT NULL,
  s_score INTEGER NOT NULL,
  e_score INTEGER NOT NULL,
  c_score INTEGER NOT NULL,
  holland_code TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  gpa REAL,
  considered_departments TEXT,
  liked_courses TEXT,
  disliked_courses TEXT,
  interests TEXT,
  work_preference TEXT,
  extra_notes TEXT,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  personality_summary TEXT NOT NULL,
  suitable_careers TEXT NOT NULL,
  full_report TEXT NOT NULL,
  generated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS careers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  holland_codes TEXT NOT NULL,
  cluster TEXT NOT NULL,
  daily_life TEXT NOT NULL,
  university_courses TEXT NOT NULL,
  job_opportunities TEXT NOT NULL,
  avg_salary_range TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  provider TEXT NOT NULL,
  provider_payment_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
