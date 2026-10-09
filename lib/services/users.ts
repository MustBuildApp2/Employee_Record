import "server-only";
import { query, transaction } from "@/lib/db/postgres";
import { hashPassword } from "@/lib/auth/password";
import { safeUser } from "@/lib/auth/context";
import type { UserRole, UserStatus } from "@/types/domain";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  expires_on: string | null;
  force_password_change: boolean;
  can_export: boolean;
  created_at?: string;
};

type UserInput = {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  expiresOn: string | null;
  password?: string;
  forcePasswordChange: boolean;
  canExport: boolean;
};

const roles = new Set(["Super Admin", "Administrator", "Manager", "Viewer"]);
const statuses = new Set(["Active", "Suspended"]);

export function validateUserBody(body: Record<string, unknown>, partial = false) {
  const errors: Record<string, string> = {};
  const out: Partial<UserInput> = {};
  const stringValue = (key: string) => (typeof body[key] === "string" ? body[key].trim() : "");

  for (const key of ["name", "email", "department"] as const) {
    const value = stringValue(key);
    if (!partial && !value && key !== "department") errors[key] = `${key} is required.`;
    if (value || body[key] !== undefined) out[key] = value;
  }

  const role = stringValue("role");
  if (!partial && !role) errors.role = "Role is required.";
  if (role) {
    if (!roles.has(role)) errors.role = "Invalid role.";
    else out.role = role as UserRole;
  }

  const status = stringValue("status");
  if (status) {
    if (!statuses.has(status)) errors.status = "Invalid status.";
    else out.status = status as UserStatus;
  } else if (!partial) {
    out.status = "Active";
  }

  if (body.expiresOn !== undefined) {
    const expires = stringValue("expiresOn");
    out.expiresOn = expires || null;
  }
  if (body.password !== undefined) {
    const password = stringValue("password");
    if (password && password.length < 8) errors.password = "Password must be at least 8 characters.";
    if (password) out.password = password;
  } else if (!partial) {
    errors.password = "Password is required.";
  }
  if (body.forcePasswordChange !== undefined) out.forcePasswordChange = Boolean(body.forcePasswordChange);
  else if (!partial) out.forcePasswordChange = false;
  if (body.canExport !== undefined) out.canExport = Boolean(body.canExport);
  else if (!partial) out.canExport = false;

  if (out.email && !/^\S+@\S+\.\S+$/.test(out.email)) errors.email = "Email is invalid.";
  return Object.keys(errors).length ? { errors } : { user: out as UserInput };
}

export async function listUsers() {
  const result = await query<UserRow>(
    `SELECT id, name, email, role, status, department, expires_on::text,
            force_password_change, can_export, created_at::text
     FROM portal_users
     ORDER BY name ASC`,
  );
  return result.rows.map((row) => ({ ...safeUser(row), createdAt: row.created_at }));
}

export async function getUser(id: number) {
  const result = await query<UserRow>(
    `SELECT id, name, email, role, status, department, expires_on::text,
            force_password_change, can_export, created_at::text
     FROM portal_users WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];
  return row ? { ...safeUser(row), createdAt: row.created_at } : null;
}

export async function createUser(input: UserInput) {
  return transaction(async (client) => {
    const exists = await client.query("SELECT id FROM portal_users WHERE LOWER(email) = LOWER($1)", [input.email]);
    if (exists.rows[0]) return { conflict: true as const };
    const result = await client.query<UserRow>(
      `INSERT INTO portal_users
       (name, email, role, status, department, expires_on, password_hash, force_password_change, can_export)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, name, email, role, status, department, expires_on::text, force_password_change, can_export, created_at::text`,
      [
        input.name,
        input.email,
        input.role,
        input.status,
        input.department || "",
        input.expiresOn || null,
        await hashPassword(input.password || ""),
        input.forcePasswordChange,
        input.canExport,
      ],
    );
    return { user: { ...safeUser(result.rows[0]), createdAt: result.rows[0].created_at } };
  });
}

export async function updateUser(id: number, input: Partial<UserInput>) {
  const sets: string[] = [];
  const values: unknown[] = [];
  const add = (column: string, value: unknown) => {
    values.push(value);
    sets.push(`${column} = $${values.length}`);
  };
  if (input.name !== undefined) add("name", input.name);
  if (input.email !== undefined) add("email", input.email);
  if (input.role !== undefined) add("role", input.role);
  if (input.status !== undefined) add("status", input.status);
  if (input.department !== undefined) add("department", input.department);
  if (input.expiresOn !== undefined) add("expires_on", input.expiresOn);
  if (input.forcePasswordChange !== undefined) add("force_password_change", input.forcePasswordChange);
  if (input.canExport !== undefined) add("can_export", input.canExport);
  if (input.password) add("password_hash", await hashPassword(input.password));
  if (!sets.length) return getUser(id);
  values.push(id);
  const result = await query<UserRow>(
    `UPDATE portal_users SET ${sets.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length}
     RETURNING id, name, email, role, status, department, expires_on::text,
       force_password_change, can_export, created_at::text`,
    values,
  );
  const row = result.rows[0];
  return row ? { ...safeUser(row), createdAt: row.created_at } : null;
}

export async function countActiveSuperAdminsExcept(id: number) {
  const result = await query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM portal_users WHERE id <> $1 AND role = 'Super Admin' AND status = 'Active'",
    [id],
  );
  return Number(result.rows[0]?.count || 0);
}

export async function deactivateUser(id: number) {
  const result = await query<UserRow>(
    `UPDATE portal_users SET status = 'Suspended', updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, role, status, department, expires_on::text,
       force_password_change, can_export, created_at::text`,
    [id],
  );
  const row = result.rows[0];
  return row ? { ...safeUser(row), createdAt: row.created_at } : null;
}
