import { NextResponse } from "next/server";
import type { ApiErrorCode, ApiFailure, ApiSuccess } from "@/types/api";

export function ok<T>(data: T, init?: ResponseInit & { meta?: Record<string, unknown> }) {
  const body: ApiSuccess<T> = init?.meta
    ? { success: true, data, meta: init.meta }
    : { success: true, data };
  return NextResponse.json(body, { status: init?.status ?? 200, headers: init?.headers });
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(status: number, code: ApiErrorCode, message: string, details?: unknown) {
  const body: ApiFailure = {
    success: false,
    error: details ? { code, message, details } : { code, message },
  };
  return NextResponse.json(body, { status });
}

export function serverError(error: unknown) {
  console.error("API error", error);
  return fail(500, "INTERNAL_ERROR", "An unexpected server error occurred.");
}
