import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/context";
import { fail, serverError } from "@/lib/api/responses";
import { getEmployee } from "@/lib/services/employees";
import { listDocuments, getDocument, readDocumentContent } from "@/lib/services/documents";
import { createZip } from "@/lib/storage/zip";

type Ctx = { params: Promise<{ id: string }> };

function safeName(value: string) {
  return value.replace(/[^a-z0-9._-]+/gi, "_").slice(0, 120) || "document";
}

export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    if (auth.response) return auth.response;
    const { id } = await ctx.params;
    const employeeId = Number(id);
    if (!Number.isInteger(employeeId) || employeeId < 1) return fail(400, "BAD_REQUEST", "Invalid employee id.");
    const employee = await getEmployee(employeeId);
    if (!employee) return fail(404, "NOT_FOUND", "Employee not found.");

    const docs = await listDocuments(employeeId);
    const entries = [];
    for (const doc of docs) {
      const row = await getDocument(employeeId, doc.id);
      if (row) {
        entries.push({
          path: `${safeName(employee.code)}-${safeName(employee.name)}/${safeName(row.original_name)}`,
          data: await readDocumentContent(row),
        });
      }
    }
    entries.push({
      path: `${safeName(employee.code)}-${safeName(employee.name)}/document-manifest.txt`,
      data: Buffer.from(`Employee: ${employee.name}\nWorker Code: ${employee.code}\nDocuments: ${docs.length}\n`),
    });
    const zip = createZip(entries);
    return new NextResponse(zip, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(zip.length),
        "Content-Disposition": `attachment; filename="${safeName(employee.code)}-documents.zip"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return serverError(error);
  }
}
