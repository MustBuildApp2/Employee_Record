import "server-only";
import type { NextRequest } from "next/server";
import { fail } from "@/lib/api/responses";
import { query } from "@/lib/db/postgres";
import { verifyAccessToken } from "@/lib/auth/tokens";
import type { AuthUser } from "@/types/domain";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: AuthUser["role"];
  status: AuthUser["status"];
  department: string;
  expires_on: string | null;
  force_password_change: boolean;
  can_export: boolean;
};

export function safeUser(row: UserRow): AuthUser {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    department: row.department,
    expiresOn: row.expires_on,
    forcePasswordChange: row.force_password_change,
    canExport: row.can_export,
  };
}

export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return { response: fail(401, "UNAUTHORIZED", "Missing bearer token.") };
  }

  const payload = verifyAccessToken(match[1]);
  if (!payload) {
    return { response: fail(401, "UNAUTHORIZED", "Invalid or expired bearer token.") };
  }

  const result = await query<UserRow>(
    `SELECT id, name, email, role, status, department, expires_on::text, force_password_change, can_export
     FROM portal_users
     WHERE id = $1`,
    [payload.sub],
  );
  const row = result.rows[0];
  if (!row || row.status !== "Active") {
    return { response: fail(401, "UNAUTHORIZED", "Invalid or expired bearer token.") };
  }
  if (row.expires_on && row.expires_on < new Date().toISOString().slice(0, 10)) {
    return { response: fail(401, "UNAUTHORIZED", "Account is expired.") };
  }

  return { user: safeUser(row) };
}

export function canManageEmployees(user: AuthUser) {
  return user.role === "Super Admin" || user.role === "Administrator" || user.role === "Manager";
}

export function canManageUsers(user: AuthUser) {
  return user.role === "Super Admin";
}

export function canManageDocuments(user: AuthUser) {
  return canManageEmployees(user);
}
