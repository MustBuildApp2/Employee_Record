import { NextRequest } from "next/server";
import { canManageEmployees, requireAuth } from "@/lib/auth/context";
import { fail, noContent, ok, serverError } from "@/lib/api/responses";
import { readJsonObject } from "@/lib/api/request";
import { getEmployee, softDeleteEmployee, updateEmployee } from "@/lib/services/employees";
import { validateEmployeeBody } from "@/lib/validation/employees";

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
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid employee id.");
    const employee = await getEmployee(id);
    if (!employee) return fail(404, "NOT_FOUND", "Employee not found.");
    return ok(employee);
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageEmployees(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to update employees.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid employee id.");
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const validated = validateEmployeeBody(parsed.body, true);
    if (validated.errors) return fail(422, "VALIDATION_ERROR", "The request contains invalid fields.", validated.errors);
    const employee = await updateEmployee(id, validated.payload);
    if (!employee) return fail(404, "NOT_FOUND", "Employee not found.");
    return ok(employee);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageEmployees(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to delete employees.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid employee id.");
    const deleted = await softDeleteEmployee(id);
    if (!deleted) return fail(404, "NOT_FOUND", "Employee not found.");
    return noContent();
  } catch (error) {
    return serverError(error);
  }
}
