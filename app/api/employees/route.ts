import { NextRequest } from "next/server";
import { canManageEmployees, requireAuth } from "@/lib/auth/context";
import { created, fail, ok, serverError } from "@/lib/api/responses";
import { asString, parsePositiveInt, readJsonObject } from "@/lib/api/request";
import { createEmployee, listEmployees } from "@/lib/services/employees";
import { validateEmployeeBody } from "@/lib/validation/employees";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    const params = request.nextUrl.searchParams;
    const page = parsePositiveInt(params.get("page"), 1, 100000);
    const pageSize = parsePositiveInt(params.get("pageSize"), 25, 100);
    const order = params.get("order") === "desc" ? "desc" : "asc";
    const result = await listEmployees({
      page,
      pageSize,
      search: asString(params.get("search")),
      type: asString(params.get("type")),
      status: asString(params.get("status")),
      sort: asString(params.get("sort"), "name"),
      order,
    });
    return ok(result.employees, {
      meta: {
        page,
        pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / pageSize),
      },
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageEmployees(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to create employees.");

    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const validated = validateEmployeeBody(parsed.body);
    if (validated.errors) return fail(422, "VALIDATION_ERROR", "The request contains invalid fields.", validated.errors);
    const result = await createEmployee(validated.payload);
    if ("conflict" in result) return fail(409, "CONFLICT", "An active employee with this worker code already exists.");
    return created(result.employee);
  } catch (error) {
    return serverError(error);
  }
}
