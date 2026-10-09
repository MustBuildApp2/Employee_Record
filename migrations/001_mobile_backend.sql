-- Employee Records mobile REST API backend schema.
-- Non-destructive migration: creates missing tables/indexes only.
-- Review against any existing production schema before applying.

CREATE TABLE IF NOT EXISTS portal_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Super Admin', 'Administrator', 'Manager', 'Viewer')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
  department TEXT NOT NULL DEFAULT '',
  expires_on DATE,
  password_hash TEXT NOT NULL,
  force_password_change BOOLEAN NOT NULL DEFAULT FALSE,
  can_export BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS portal_users_email_lower_uidx
  ON portal_users (LOWER(email));

CREATE TABLE IF NOT EXISTS refresh_sessions (
  id UUID PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by UUID,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS refresh_sessions_user_id_idx
  ON refresh_sessions (user_id);

CREATE INDEX IF NOT EXISTS refresh_sessions_active_idx
  ON refresh_sessions (token_hash, expires_at)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  worker_type TEXT NOT NULL CHECK (worker_type IN ('MC', 'SC')),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  citizen TEXT NOT NULL DEFAULT '',
  pass_type TEXT NOT NULL DEFAULT '',
  wp_expiry DATE,
  passport_expiry DATE,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Inactive')),
  work_permit_no TEXT NOT NULL DEFAULT '',
  fin_number TEXT NOT NULL DEFAULT '',
  designation TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  nationality TEXT NOT NULL DEFAULT '',
  dob DATE,
  passport_no TEXT NOT NULL DEFAULT '',
  csoc TEXT NOT NULL DEFAULT '',
  csoc_expiry DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS employees_code_active_uidx
  ON employees (LOWER(code))
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS employees_search_idx
  ON employees (LOWER(name), LOWER(code), LOWER(fin_number), LOWER(passport_no), LOWER(work_permit_no));

CREATE INDEX IF NOT EXISTS employees_type_status_idx
  ON employees (worker_type, status)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS employee_documents (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  original_name TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  document_type TEXT NOT NULL DEFAULT '',
  uploaded_by BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS employee_documents_employee_idx
  ON employee_documents (employee_id)
  WHERE deleted_at IS NULL;
