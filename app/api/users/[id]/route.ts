import { NextRequest } from "next/server";
import { canManageUsers, requireAuth } from "@/lib/auth/context";
import { fail, noContent, ok, serverError } from "@/lib/api/responses";
import { countActiveSuperAdminsExcept, deactivateUser, getUser, updateUser, validateUserBody } from "@/lib/services/users";
import { readJsonObject } from "@/lib/api/request";

type Ctx = { params: Promise<{ id: string }> };

async function idFrom(ctx: Ctx) {
  const { id } = await ctx.params;
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageUsers(auth.user)) return fail(403, "FORBIDDEN", "Only Super Admin users can manage users.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid user id.");
    const user = await getUser(id);
    if (!user) return fail(404, "NOT_FOUND", "User not found.");
    return ok(user);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageUsers(auth.user)) return fail(403, "FORBIDDEN", "Only Super Admin users can manage users.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid user id.");
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const validated = validateUserBody(parsed.body, true);
    if (validated.errors) return fail(422, "VALIDATION_ERROR", "The request contains invalid fields.", validated.errors);

    const current = await getUser(id);
    if (!current) return fail(404, "NOT_FOUND", "User not found.");
    if (current.id === auth.user.id && validated.user.role && validated.user.role !== current.role) {
      return fail(403, "FORBIDDEN", "You cannot change your own role.");
    }
    if (
      current.role === "Super Admin" &&
      current.status === "Active" &&
      (validated.user.status === "Suspended" || (validated.user.role && validated.user.role !== "Super Admin")) &&
      (await countActiveSuperAdminsExcept(id)) === 0
    ) {
      return fail(409, "CONFLICT", "Cannot remove or suspend the last active Super Admin.");
    }

    const updated = await updateUser(id, validated.user);
    if (!updated) return fail(404, "NOT_FOUND", "User not found.");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageUsers(auth.user)) return fail(403, "FORBIDDEN", "Only Super Admin users can manage users.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid user id.");
    if (id === auth.user.id) return fail(403, "FORBIDDEN", "You cannot deactivate your own account.");
    const current = await getUser(id);
    if (!current) return fail(404, "NOT_FOUND", "User not found.");
    if (current.role === "Super Admin" && current.status === "Active" && (await countActiveSuperAdminsExcept(id)) === 0) {
      return fail(409, "CONFLICT", "Cannot suspend the last active Super Admin.");
    }
    await deactivateUser(id);
    return noContent();
  } catch (error) {
    return serverError(error);
  }
}
