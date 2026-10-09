import "server-only";
import { createHash, randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { query, transaction } from "@/lib/db/postgres";

const allowedTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const maxBytes = Number(process.env.DOCUMENT_MAX_BYTES || 10 * 1024 * 1024);

type DocumentRow = {
  id: string;
  employee_id: string;
  original_name: string;
  storage_key: string;
  mime_type: string;
  size_bytes: string;
  document_type: string;
  uploaded_at: string;
};

function storageRoot() {
  return process.env.DOCUMENT_STORAGE_PATH || path.join(process.cwd(), ".storage", "employee-documents");
}

function toDocument(row: DocumentRow) {
  return {
    id: Number(row.id),
    employeeId: Number(row.employee_id),
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: Number(row.size_bytes),
    documentType: row.document_type,
    uploadedAt: row.uploaded_at,
  };
}

function extensionFor(name: string) {
  const ext = path.extname(name).toLowerCase();
  return ext.replace(/[^a-z0-9.]/g, "") || ".bin";
}

export async function listDocuments(employeeId: number) {
  const result = await query<DocumentRow>(
    `SELECT id, employee_id, original_name, storage_key, mime_type, size_bytes::text, document_type, uploaded_at::text
     FROM employee_documents
     WHERE employee_id = $1 AND deleted_at IS NULL
     ORDER BY uploaded_at DESC`,
    [employeeId],
  );
  return result.rows.map(toDocument);
}

export async function getDocument(employeeId: number, documentId: number) {
  const result = await query<DocumentRow>(
    `SELECT id, employee_id, original_name, storage_key, mime_type, size_bytes::text, document_type, uploaded_at::text
     FROM employee_documents
     WHERE id = $1 AND employee_id = $2 AND deleted_at IS NULL`,
    [documentId, employeeId],
  );
  return result.rows[0] || null;
}

export async function readDocumentContent(row: DocumentRow) {
  const fullPath = path.join(storageRoot(), row.storage_key);
  if (!fullPath.startsWith(storageRoot())) throw new Error("Invalid storage path.");
  return readFile(fullPath);
}

export async function saveDocument(employeeId: number, userId: number, file: File, documentType = "") {
  if (!allowedTypes.has(file.type)) return { unsupported: true as const };
  if (file.size > maxBytes) return { tooLarge: true as const, maxBytes };

  const bytes = Buffer.from(await file.arrayBuffer());
  const fingerprint = createHash("sha256").update(bytes).digest("base64url").slice(0, 20);
  const storageKey = `${employeeId}/${randomUUID()}-${fingerprint}${extensionFor(file.name)}`;
  const fullPath = path.join(storageRoot(), storageKey);
  if (!fullPath.startsWith(storageRoot())) throw new Error("Invalid storage path.");

  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, bytes, { flag: "wx" });

  try {
    const result = await query<DocumentRow>(
      `INSERT INTO employee_documents
       (employee_id, original_name, storage_key, mime_type, size_bytes, document_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, employee_id, original_name, storage_key, mime_type, size_bytes::text, document_type, uploaded_at::text`,
      [employeeId, file.name, storageKey, file.type, file.size, documentType, userId],
    );
    return { document: toDocument(result.rows[0]) };
  } catch (error) {
    await unlink(fullPath).catch(() => undefined);
    throw error;
  }
}

export async function updateDocument(employeeId: number, documentId: number, documentType: string) {
  const result = await query<DocumentRow>(
    `UPDATE employee_documents SET document_type = $1
     WHERE id = $2 AND employee_id = $3 AND deleted_at IS NULL
     RETURNING id, employee_id, original_name, storage_key, mime_type, size_bytes::text, document_type, uploaded_at::text`,
    [documentType, documentId, employeeId],
  );
  return result.rows[0] ? toDocument(result.rows[0]) : null;
}

export async function deleteDocument(employeeId: number, documentId: number) {
  return transaction(async (client) => {
    const result = await client.query<DocumentRow>(
      `UPDATE employee_documents SET deleted_at = NOW()
       WHERE id = $1 AND employee_id = $2 AND deleted_at IS NULL
       RETURNING id, employee_id, original_name, storage_key, mime_type, size_bytes::text, document_type, uploaded_at::text`,
      [documentId, employeeId],
    );
    return result.rows[0] || null;
  });
}
