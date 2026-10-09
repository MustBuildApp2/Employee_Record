import "server-only";
import { createHmac, createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import type { AuthUser } from "@/types/domain";

type AccessPayload = {
  sub: number;
  email: string;
  role: AuthUser["role"];
  exp: number;
  iat: number;
};

const accessTtlSeconds = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900);
const refreshTtlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);

function secret() {
  const value = process.env.AUTH_TOKEN_SECRET || process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_TOKEN_SECRET or SESSION_SECRET must be at least 32 characters.");
  }
  return value;
}

function b64(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createAccessToken(user: AuthUser) {
  const now = Math.floor(Date.now() / 1000);
  const payload: AccessPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + accessTtlSeconds,
  };
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyAccessToken(token: string) {
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;
  const expected = sign(`${header}.${body}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AccessPayload;
  if (!payload.sub || !payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function createRefreshToken() {
  return `${randomUUID()}.${randomBytes(32).toString("base64url")}`;
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

export function refreshExpiryDate() {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + refreshTtlDays);
  return expires;
}

export function publicTokenConfig() {
  return {
    tokenType: "Bearer",
    accessTokenExpiresIn: accessTtlSeconds,
    refreshTokenExpiresInDays: refreshTtlDays,
  };
}
