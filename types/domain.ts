export type UserRole = "Super Admin" | "Administrator" | "Manager" | "Viewer";
export type UserStatus = "Active" | "Suspended";
export type WorkerType = "MC" | "SC";
export type WorkerStatus = "Active" | "Pending" | "Inactive";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  expiresOn: string | null;
  forcePasswordChange: boolean;
  canExport: boolean;
};

export type EmployeePayload = {
  type: WorkerType;
  code: string;
  name: string;
  country?: string;
  citizen?: string;
  passType?: string;
  wpExpiry?: string | null;
  passportExpiry?: string | null;
  status?: WorkerStatus;
  workPermitNo?: string;
  finNumber?: string;
  designation?: string;
  phone?: string;
  email?: string;
  nationality?: string;
  dob?: string | null;
  passportNo?: string;
  csoc?: string;
  csocExpiry?: string | null;
};
