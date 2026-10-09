import { NextRequest } from "next/server";
import { canManageUsers, requireAuth } from "@/lib/auth/context";
import { created, fail, ok, serverError } from "@/lib/api/responses";
import { createUser, listUsers, validateUserBody } from "@/lib/services/users";
import { readJsonObject } from "@/lib/api/request";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageUsers(auth.user)) return fail(403, "FORBIDDEN", "Only Super Admin users can manage users.");
    return ok(await listUsers());
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageUsers(auth.user)) return fail(403, "FORBIDDEN", "Only Super Admin users can manage users.");
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const validated = validateUserBody(parsed.body);
    if (validated.errors) return fail(422, "VALIDATION_ERROR", "The request contains invalid fields.", validated.errors);
    const result = await createUser(validated.user);
    if ("conflict" in result) return fail(409, "CONFLICT", "A user with this email already exists.");
    return created(result.user);
  } catch (error) {
    return serverError(error);
  }
}
