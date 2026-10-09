import { NextRequest } from "next/server";
import { fail, ok, serverError } from "@/lib/api/responses";
import { asString, readJsonObject } from "@/lib/api/request";
import { rotateRefreshToken } from "@/lib/services/auth";

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const refreshToken = asString(parsed.body.refreshToken);
    if (!refreshToken) return fail(422, "VALIDATION_ERROR", "Refresh token is required.");
    const result = await rotateRefreshToken(refreshToken, request);
    if (!result) return fail(401, "UNAUTHORIZED", "Invalid or expired refresh token.");
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
