import { NextRequest, NextResponse } from "next/server";
import { canManageDocuments, requireAuth } from "@/lib/auth/context";
import { fail, noContent, ok, serverError } from "@/lib/api/responses";
import { asString, readJsonObject } from "@/lib/api/request";
import { deleteDocument, getDocument, readDocumentContent, updateDocument } from "@/lib/services/documents";

type Ctx = { params: Promise<{ id: string; documentId: string }> };

async function idsFrom(ctx: Ctx) {
  const { id, documentId } = await ctx.params;
  const employeeId = Number(id);
  const docId = Number(documentId);
  if (!Number.isInteger(employeeId) || employeeId < 1 || !Number.isInteger(docId) || docId < 1) return null;
  return { employeeId, documentId: docId };
}

export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    const ids = await idsFrom(ctx);
    if (!ids) return fail(400, "BAD_REQUEST", "Invalid employee or document id.");
    const row = await getDocument(ids.employeeId, ids.documentId);
    if (!row) return fail(404, "NOT_FOUND", "Document not found.");
    const content = await readDocumentContent(row);
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": row.mime_type,
        "Content-Length": String(content.length),
        "Content-Disposition": `attachment; filename="${row.original_name.replace(/"/g, "")}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageDocuments(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to update documents.");
    const ids = await idsFrom(ctx);
    if (!ids) return fail(400, "BAD_REQUEST", "Invalid employee or document id.");
    const parsed = await readJsonObject(request);
    if (parsed.response) return parsed.response;
    const documentType = asString(parsed.body.documentType);
    const updated = await updateDocument(ids.employeeId, ids.documentId, documentType);
    if (!updated) return fail(404, "NOT_FOUND", "Document not found.");
    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    if (!canManageDocuments(auth.user)) return fail(403, "FORBIDDEN", "You do not have permission to delete documents.");
    const ids = await idsFrom(ctx);
    if (!ids) return fail(400, "BAD_REQUEST", "Invalid employee or document id.");
    const deleted = await deleteDocument(ids.employeeId, ids.documentId);
    if (!deleted) return fail(404, "NOT_FOUND", "Document not found.");
    return noContent();
  } catch (error) {
    return serverError(error);
  }
}
