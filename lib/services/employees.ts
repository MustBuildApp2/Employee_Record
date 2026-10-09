import "server-only";
import { PoolClient } from "pg";
import { query, transaction } from "@/lib/db/postgres";
import type { EmployeePayload, WorkerStatus, WorkerType } from "@/types/domain";

type EmployeeRow = {
  id: string;
  worker_type: WorkerType;
  code: string;
  name: string;
  country: string;
  citizen: string;
  pass_type: string;
  wp_expiry: string | null;
  passport_expiry: string | null;
  status: WorkerStatus;
  work_permit_no: string;
  fin_number: string;
  designation: string;
  phone: string;
  email: string;
  nationality: string;
  dob: string | null;
  passport_no: string;
  csoc: string;
  csoc_expiry: string | null;
  created_at: string;
  updated_at: string;
};

export function toEmployee(row: EmployeeRow) {
  return {
    id: Number(row.id),
    type: row.worker_type,
    code: row.code,
    name: row.name,
    country: row.country,
    citizen: row.citizen,
    passType: row.pass_type,
    wpExpiry: row.wp_expiry,
    passportExpiry: row.passport_expiry,
    status: row.status,
    workPermitNo: row.work_permit_no,
    finNumber: row.fin_number,
    designation: row.designation,
    phone: row.phone,
    email: row.email,
    nationality: row.nationality,
    dob: row.dob,
    passportNo: row.passport_no,
    csoc: row.csoc,
    csocExpiry: row.csoc_expiry,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function employeeExists(client: PoolClient, id: number) {
  const result = await client.query("SELECT id FROM employees WHERE id = $1 AND deleted_at IS NULL", [id]);
  return Boolean(result.rows[0]);
}

const selectEmployee = `SELECT id, worker_type, code, name, country, citizen, pass_type, wp_expiry::text,
  passport_expiry::text, status, work_permit_no, fin_number, designation, phone, email,
  nationality, dob::text, passport_no, csoc, csoc_expiry::text, created_at::text, updated_at::text
  FROM employees`;

export async function getEmployee(id: number) {
  const result = await query<EmployeeRow>(`${selectEmployee} WHERE id = $1 AND deleted_at IS NULL`, [id]);
  const row = result.rows[0];
  return row ? toEmployee(row) : null;
}

export async function listEmployees(options: {
  page: number;
  pageSize: number;
  search: string;
  type: string;
  status: string;
  sort: string;
  order: "asc" | "desc";
}) {
  const filters = ["deleted_at IS NULL"];
  const values: unknown[] = [];
  if (options.search) {
    values.push(`%${options.search.toLowerCase()}%`);
    filters.push(`(LOWER(name) LIKE $${values.length} OR LOWER(code) LIKE $${values.length}
      OR LOWER(fin_number) LIKE $${values.length} OR LOWER(passport_no) LIKE $${values.length}
      OR LOWER(work_permit_no) LIKE $${values.length})`);
  }
  if (options.type) {
    values.push(options.type);
    filters.push(`worker_type = $${values.length}`);
  }
  if (options.status) {
    values.push(options.status);
    filters.push(`status = $${values.length}`);
  }

  const sortColumns: Record<string, string> = {
    name: "name",
    code: "code",
    status: "status",
    type: "worker_type",
    wpExpiry: "wp_expiry",
    passportExpiry: "passport_expiry",
    csocExpiry: "csoc_expiry",
    createdAt: "created_at",
  };
  const sortColumn = sortColumns[options.sort] || "name";
  const offset = (options.page - 1) * options.pageSize;
  const where = `WHERE ${filters.join(" AND ")}`;

  const totalResult = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM employees ${where}`, values);
  const rowsResult = await query<EmployeeRow>(
    `${selectEmployee} ${where} ORDER BY ${sortColumn} ${options.order === "desc" ? "DESC" : "ASC"} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, options.pageSize, offset],
  );
  return {
    employees: rowsResult.rows.map(toEmployee),
    total: Number(totalResult.rows[0]?.count || 0),
  };
}

export async function createEmployee(payload: EmployeePayload) {
  return transaction(async (client) => {
    const result = await client.query<EmployeeRow>(
      `${selectEmployee} WHERE LOWER(code) = LOWER($1) AND deleted_at IS NULL`,
      [payload.code],
    );
    if (result.rows[0]) return { conflict: true as const };

    const inserted = await client.query<EmployeeRow>(
      `INSERT INTO employees (
        worker_type, code, name, country, citizen, pass_type, wp_expiry, passport_expiry, status,
        work_permit_no, fin_number, designation, phone, email, nationality, dob, passport_no, csoc, csoc_expiry
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id, worker_type, code, name, country, citizen, pass_type, wp_expiry::text,
        passport_expiry::text, status, work_permit_no, fin_number, designation, phone, email,
        nationality, dob::text, passport_no, csoc, csoc_expiry::text, created_at::text, updated_at::text`,
      [
        payload.type,
        payload.code,
        payload.name,
        payload.country || "",
        payload.citizen || "",
        payload.passType || "",
        payload.wpExpiry || null,
        payload.passportExpiry || null,
        payload.status || "Active",
        payload.workPermitNo || "",
        payload.finNumber || "",
        payload.designation || "",
        payload.phone || "",
        payload.email || "",
        payload.nationality || "",
        payload.dob || null,
        payload.passportNo || "",
        payload.csoc || "",
        payload.csocExpiry || null,
      ],
    );
    return { employee: toEmployee(inserted.rows[0]) };
  });
}

export async function updateEmployee(id: number, payload: Partial<EmployeePayload>) {
  const columnMap: Record<string, string> = {
    type: "worker_type",
    code: "code",
    name: "name",
    country: "country",
    citizen: "citizen",
    passType: "pass_type",
    wpExpiry: "wp_expiry",
    passportExpiry: "passport_expiry",
    status: "status",
    workPermitNo: "work_permit_no",
    finNumber: "fin_number",
    designation: "designation",
    phone: "phone",
    email: "email",
    nationality: "nationality",
    dob: "dob",
    passportNo: "passport_no",
    csoc: "csoc",
    csocExpiry: "csoc_expiry",
  };
  const entries = Object.entries(payload).filter(([, value]) => value !== undefined);
  if (!entries.length) return getEmployee(id);
  const values: unknown[] = [];
  const sets = entries.map(([key, value]) => {
    values.push(value);
    return `${columnMap[key]} = $${values.length}`;
  });
  values.push(id);
  const result = await query<EmployeeRow>(
    `UPDATE employees SET ${sets.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length} AND deleted_at IS NULL
     RETURNING id, worker_type, code, name, country, citizen, pass_type, wp_expiry::text,
       passport_expiry::text, status, work_permit_no, fin_number, designation, phone, email,
       nationality, dob::text, passport_no, csoc, csoc_expiry::text, created_at::text, updated_at::text`,
    values,
  );
  const row = result.rows[0];
  return row ? toEmployee(row) : null;
}

export async function softDeleteEmployee(id: number) {
  const result = await query("UPDATE employees SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL", [id]);
  return (result.rowCount || 0) > 0;
}
