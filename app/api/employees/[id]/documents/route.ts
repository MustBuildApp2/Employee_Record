import { NextRequest } from "next/server";
import { canManageDocuments, requireAuth } from "@/lib/auth/context";
import { created, fail, ok, serverError } from "@/lib/api/responses";
import { getEmployee } from "@/lib/services/employees";
import { listDocuments, saveDocument } from "@/lib/services/documents";

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
    if (!(await getEmployee(id))) return fail(404, "NOT_FOUND", "Employee not found.");
    return ok(await listDocuments(id));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageDocuments(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to upload documents.");
    const id = await idFrom(ctx);
    if (!id) return fail(400, "BAD_REQUEST", "Invalid employee id.");
    if (!(await getEmployee(id))) return fail(404, "NOT_FOUND", "Employee not found.");

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return fail(422, "VALIDATION_ERROR", "Multipart field 'file' is required.");
    const documentType = typeof form.get("documentType") === "string" ? String(form.get("documentType")).trim() : "";
    const result = await saveDocument(id, auth.user.id, file, documentType);
    if ("unsupported" in result) return fail(415, "UNSUPPORTED_MEDIA_TYPE", "Unsupported document file type.");
    if ("tooLarge" in result) return fail(413, "PAYLOAD_TOO_LARGE", `Document exceeds ${result.maxBytes} bytes.`);
    return created(result.document);
  } catch (error) {
    return serverError(error);
  }
}
