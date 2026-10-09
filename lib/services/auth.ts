import "server-only";
import { randomUUID } from "crypto";
import { PoolClient } from "pg";
import { query, transaction } from "@/lib/db/postgres";
import { createAccessToken, createRefreshToken, hashRefreshToken, publicTokenConfig, refreshExpiryDate } from "@/lib/auth/tokens";
import { safeUser } from "@/lib/auth/context";
import { verifyPassword } from "@/lib/auth/password";
import type { AuthUser } from "@/types/domain";

type LoginRow = {
  id: string;
  name: string;
  email: string;
  role: AuthUser["role"];
  status: AuthUser["status"];
  department: string;
  expires_on: string | null;
  password_hash: string;
  force_password_change: boolean;
  can_export: boolean;
};

async function insertRefreshSession(client: PoolClient, userId: number, refreshToken: string, request: Request) {
  const id = randomUUID();
  await client.query(
    `INSERT INTO refresh_sessions (id, user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      id,
      userId,
      hashRefreshToken(refreshToken),
      refreshExpiryDate(),
      request.headers.get("user-agent") || "",
      request.headers.get("x-forwarded-for") || "",
    ],
  );
  return id;
}

export async function loginWithPassword(email: string, password: string, request: Request) {
  const result = await query<LoginRow>(
    `SELECT id, name, email, role, status, department, expires_on::text, password_hash,
            force_password_change, can_export
     FROM portal_users
     WHERE LOWER(email) = LOWER($1)`,
    [email],
  );
  const row = result.rows[0];
  if (!row || !(await verifyPassword(password, row.password_hash))) return null;
  if (row.status !== "Active") return { blocked: "Account is not active." as const };
  if (row.expires_on && row.expires_on < new Date().toISOString().slice(0, 10)) {
    return { blocked: "Account is expired." as const };
  }
  if (row.force_password_change) return { blocked: "Password change is required." as const };

  const user = safeUser(row);
  const refreshToken = createRefreshToken();
  await transaction((client) => insertRefreshSession(client, user.id, refreshToken, request));
  return {
    user,
    accessToken: createAccessToken(user),
    refreshToken,
    ...publicTokenConfig(),
  };
}

export async function rotateRefreshToken(refreshToken: string, request: Request) {
  const tokenHash = hashRefreshToken(refreshToken);
  return transaction(async (client) => {
    const sessionResult = await client.query<LoginRow & { session_id: string; expires_at: string; revoked_at: string | null }>(
      `SELECT rs.id AS session_id, rs.expires_at::text, rs.revoked_at::text,
              u.id, u.name, u.email, u.role, u.status, u.department, u.expires_on::text,
              u.password_hash, u.force_password_change, u.can_export
       FROM refresh_sessions rs
       JOIN portal_users u ON u.id = rs.user_id
       WHERE rs.token_hash = $1
       FOR UPDATE`,
      [tokenHash],
    );
    const row = sessionResult.rows[0];
    if (!row || row.revoked_at || new Date(row.expires_at).getTime() <= Date.now() || row.status !== "Active") return null;

    const user = safeUser(row);
    const replacement = createRefreshToken();
    const replacementId = await insertRefreshSession(client, user.id, replacement, request);
    await client.query("UPDATE refresh_sessions SET revoked_at = NOW(), replaced_by = $1 WHERE id = $2", [
      replacementId,
      row.session_id,
    ]);
    return {
      user,
      accessToken: createAccessToken(user),
      refreshToken: replacement,
      ...publicTokenConfig(),
    };
  });
}

export async function revokeRefreshToken(refreshToken: string) {
  await query("UPDATE refresh_sessions SET revoked_at = COALESCE(revoked_at, NOW()) WHERE token_hash = $1", [
    hashRefreshToken(refreshToken),
  ]);
}
