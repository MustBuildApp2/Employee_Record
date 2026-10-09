import { asOptionalDate, asString } from "@/lib/api/request";
import type { EmployeePayload, WorkerStatus, WorkerType } from "@/types/domain";

const workerTypes = new Set(["MC", "SC"]);
const workerStatuses = new Set(["Active", "Pending", "Inactive"]);

export function validateEmployeeBody(body: Record<string, unknown>, partial = false) {
  const errors: Record<string, string> = {};
  const payload: Partial<EmployeePayload> = {};

  function requiredText(key: keyof EmployeePayload, label: string) {
    const value = asString(body[key]);
    if (!value && !partial) errors[key] = `${label} is required.`;
    if (value) payload[key] = value as never;
  }

  const type = asString(body.type);
  if (!type && !partial) errors.type = "Worker type is required.";
  if (type) {
    if (!workerTypes.has(type)) errors.type = "Worker type must be MC or SC.";
    else payload.type = type as WorkerType;
  }

  requiredText("code", "Worker code");
  requiredText("name", "Name");

  const status = asString(body.status);
  if (status) {
    if (!workerStatuses.has(status)) errors.status = "Status must be Active, Pending, or Inactive.";
    else payload.status = status as WorkerStatus;
  }

  for (const key of [
    "country",
    "citizen",
    "passType",
    "workPermitNo",
    "finNumber",
    "designation",
    "phone",
    "email",
    "nationality",
    "passportNo",
    "csoc",
  ] as const) {
    if (body[key] !== undefined) payload[key] = asString(body[key]) as never;
  }

  for (const key of ["wpExpiry", "passportExpiry", "dob", "csocExpiry"] as const) {
    if (body[key] !== undefined) {
      const value = asOptionalDate(body[key]);
      if (value === undefined) errors[key] = "Date must use YYYY-MM-DD.";
      else payload[key] = value as never;
    }
  }

  return Object.keys(errors).length ? { errors } : { payload: payload as EmployeePayload };
}
