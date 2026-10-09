import { NextRequest } from "next/server";
import { fail, ok, serverError } from "@/lib/api/responses";
import { readJsonObject, asString } from "@/lib/api/request";
import { loginWithPassword } from "@/lib/services/auth";

export async function POST(request: NextRequest) {
  try {
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const email = asString(parsed.body.email).toLowerCase();
    const password = asString(parsed.body.password);
    if (!email || !password) {
      return fail(422, "VALIDATION_ERROR", "Email and password are required.");
    }

    const result = await loginWithPassword(email, password, request);
    if (!result) return fail(401, "UNAUTHORIZED", "The email or password is incorrect.");
    if ("blocked" in result) return fail(403, "FORBIDDEN", result.blocked || "Account is not permitted to sign in.");
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
