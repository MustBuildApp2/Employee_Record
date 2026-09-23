"use client";

import {
  Activity, AlertCircle, ArrowRight, Bell, Bookmark, BriefcaseBusiness, Building2,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Clock, Columns3, Download, Edit3, Eye, EyeOff, FileBadge, FileSpreadsheet,
  Filter, Fingerprint, Gauge, Globe, IdCard, LayoutDashboard, LayoutGrid, LogOut,
  Mail, Menu, Moon, MoreHorizontal, Phone, BookOpenCheck, Plus, Printer, QrCode,
  RefreshCw, Search, Send, ShieldAlert, ShieldCheck, Sparkles, Sun, Table2, Trash2,
  TrendingUp, Upload, User, UserCheck, UsersRound, X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import LoginScene from "./login-scene";
import { Language, translations } from "./i18n";

type WorkerType = "MC" | "SC";
type WorkerStatus = "Active" | "Pending" | "Inactive";
type ExpiryFilter = "all" | "valid" | "expiring" | "expired";
type AppView = "overview" | "employees" | "compliance" | "calendar" | "reports";
type ViewMode = "table" | "grid";

type Employee = {
  id: number;
  type: WorkerType;
  code: string;
  name: string;
  country: string;
  citizen: string;
  passType: string;
  wpExpiry: string;
  passportExpiry: string;
  status: WorkerStatus;
  workPermitNo: string;
  finNumber: string;
  designation: string;
  phone: string;
  email: string;
  nationality: string;
  dob: string;
  passportNo: string;
  csoc: string;
  csocExpiry: string;
  documents: string[];
};

type FilterState = {
  query: string;
  citizen: string;
  passType: string;
  status: string;
  wp: ExpiryFilter;
  passport: ExpiryFilter;
  csoc: ExpiryFilter;
};

type ColumnKey =
  | "code"
  | "name"
  | "country"
  | "passType"
  | "wpExpiry"
  | "passportExpiry"
  | "status"
  | "workPermitNo"
  | "finNumber"
  | "designation"
  | "phone"
  | "nationality"
  | "dob"
  | "passportNo"
  | "csoc"
  | "csocExpiry";

const emptyFilters: FilterState = {
  query: "",
  citizen: "",
  passType: "",
  status: "",
  wp: "all",
  passport: "all",
  csoc: "all",
};

const columnLabels: Record<ColumnKey, string> = {
  code: "Worker Code",
  name: "Full Name",
  country: "Country",
  passType: "Pass Type",
  wpExpiry: "WP / Labour Expiry",
  passportExpiry: "Passport Expiry",
  status: "Status",
  workPermitNo: "Work Permit No.",
  finNumber: "FIN Number",
  designation: "Job Designation",
  phone: "Handphone",
  nationality: "Nationality",
  dob: "Date of Birth",
  passportNo: "Passport No.",
  csoc: "CSOC / BCSS",
  csocExpiry: "CSOC Expiry",
};

const defaultColumns: ColumnKey[] = [
  "code",
  "name",
  "country",
  "passType",
  "wpExpiry",
  "passportExpiry",
  "status",
  "workPermitNo",
  "designation",
  "phone",
  "csocExpiry",
];

function isoDate(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

const seedEmployees: Employee[] = [
  {
    id: 1,
    type: "MC",
    code: "MB-1042",
    name: "Arun Kumar",
    country: "India",
    citizen: "Non-Citizen",
    passType: "Work Permit",
    wpExpiry: isoDate(83),
    passportExpiry: isoDate(520),
    status: "Active",
    workPermitNo: "WP-923184",
    finNumber: "G1842731R",
    designation: "Site Supervisor",
    phone: "+65 8123 9012",
    email: "arun.kumar@workforce.sg",
    nationality: "Indian",
    dob: "1988-05-14",
    passportNo: "N8493012",
    csoc: "CSOC-28414",
    csocExpiry: isoDate(18),
    documents: ["passport_copy.pdf", "csoc_cert.pdf", "safety_induction.pdf"],
  },
  {
    id: 2,
    type: "MC",
    code: "MB-1088",
    name: "Mohammad Rahim",
    country: "Bangladesh",
    citizen: "Non-Citizen",
    passType: "S Pass",
    wpExpiry: isoDate(-12),
    passportExpiry: isoDate(308),
    status: "Pending",
    workPermitNo: "SP-713942",
    finNumber: "G9283411K",
    designation: "Safety Coordinator",
    phone: "+65 8892 1140",
    email: "rahim.m@workforce.sg",
    nationality: "Bangladeshi",
    dob: "1991-09-02",
    passportNo: "BA701924",
    csoc: "BCSS-18220",
    csocExpiry: isoDate(166),
    documents: ["passport_copy.pdf", "bcss_cert.pdf"],
  },
  {
    id: 3,
    type: "MC",
    code: "MB-1110",
    name: "Lim Wei Jian",
    country: "Singapore",
    citizen: "Citizen",
    passType: "Citizen",
    wpExpiry: isoDate(900),
    passportExpiry: isoDate(810),
    status: "Active",
    workPermitNo: "N/A",
    finNumber: "S8911042D",
    designation: "Project Engineer",
    phone: "+65 9011 2834",
    email: "weijian.lim@workforce.sg",
    nationality: "Singaporean",
    dob: "1989-11-04",
    passportNo: "E4920013",
    csoc: "CSOC-34092",
    csocExpiry: isoDate(344),
    documents: ["nric_front_back.pdf", "degree_civil_eng.pdf"],
  },
  {
    id: 4,
    type: "MC",
    code: "MB-1146",
    name: "Dinesh Raj",
    country: "India",
    citizen: "Non-Citizen",
    passType: "Employment Pass",
    wpExpiry: isoDate(27),
    passportExpiry: isoDate(44),
    status: "Active",
    workPermitNo: "EP-641194",
    finNumber: "G8412940P",
    designation: "Quantity Surveyor",
    phone: "+65 8810 2294",
    email: "dinesh.raj@workforce.sg",
    nationality: "Indian",
    dob: "1993-02-18",
    passportNo: "P0921844",
    csoc: "CSOC-11920",
    csocExpiry: isoDate(-5),
    documents: ["ep_card.pdf", "csoc_cert.pdf"],
  },
  {
    id: 5,
    type: "MC",
    code: "MB-1201",
    name: "Tan Mei Ling",
    country: "Singapore",
    citizen: "PR",
    passType: "Permanent Resident",
    wpExpiry: isoDate(700),
    passportExpiry: isoDate(62),
    status: "Active",
    workPermitNo: "N/A",
    finNumber: "S9211840F",
    designation: "Document Controller",
    phone: "+65 9182 4401",
    email: "meiling.tan@workforce.sg",
    nationality: "Singaporean",
    dob: "1992-01-11",
    passportNo: "E8193310",
    csoc: "CSOC-29491",
    csocExpiry: isoDate(76),
    documents: ["blue_ic.pdf"],
  },
  {
    id: 6,
    type: "SC",
    code: "SC-0208",
    name: "Nur Hossain",
    country: "Bangladesh",
    citizen: "Non-Citizen",
    passType: "Work Permit",
    wpExpiry: isoDate(14),
    passportExpiry: isoDate(250),
    status: "Active",
    workPermitNo: "WP-184932",
    finNumber: "G1902841T",
    designation: "Scaffolder Lead",
    phone: "+65 8281 9300",
    email: "nur.hossain@subcon.sg",
    nationality: "Bangladeshi",
    dob: "1995-07-22",
    passportNo: "A0841932",
    csoc: "CSOC-66410",
    csocExpiry: isoDate(14),
    documents: ["wp_card.pdf", "scaffold_cert.pdf"],
  },
  {
    id: 7,
    type: "SC",
    code: "SC-0224",
    name: "Suresh Babu",
    country: "India",
    citizen: "Non-Citizen",
    passType: "Work Permit",
    wpExpiry: isoDate(181),
    passportExpiry: isoDate(-21),
    status: "Pending",
    workPermitNo: "WP-204184",
    finNumber: "G9183302L",
    designation: "Licensed Electrician",
    phone: "+65 9021 1173",
    email: "suresh.b@subcon.sg",
    nationality: "Indian",
    dob: "1990-12-10",
    passportNo: "T1840230",
    csoc: "BCSS-55102",
    csocExpiry: isoDate(219),
    documents: ["wp_card.pdf", "le_cert.pdf"],
  },
  {
    id: 8,
    type: "SC",
    code: "SC-0241",
    name: "Win Aung",
    country: "Myanmar",
    citizen: "Non-Citizen",
    passType: "Work Permit",
    wpExpiry: isoDate(390),
    passportExpiry: isoDate(480),
    status: "Active",
    workPermitNo: "WP-991028",
    finNumber: "G7192031N",
    designation: "Structural Welder",
    phone: "+65 8113 2390",
    email: "winaung@subcon.sg",
    nationality: "Myanmar",
    dob: "1994-03-09",
    passportNo: "MG129304",
    csoc: "CSOC-80214",
    csocExpiry: isoDate(121),
    documents: ["welder_cert.pdf", "passport.pdf"],
  },
  {
    id: 9,
    type: "SC",
    code: "SC-0259",
    name: "Rafiq Islam",
    country: "Bangladesh",
    citizen: "Non-Citizen",
    passType: "S Pass",
    wpExpiry: isoDate(-41),
    passportExpiry: isoDate(90),
    status: "Inactive",
    workPermitNo: "SP-028184",
    finNumber: "G6102938X",
    designation: "Tower Crane Operator",
    phone: "+65 8814 4920",
    email: "rafiq@subcon.sg",
    nationality: "Bangladeshi",
    dob: "1987-08-17",
    passportNo: "BR182940",
    csoc: "CSOC-33102",
    csocExpiry: isoDate(-18),
    documents: ["crane_license.pdf"],
  },
  {
    id: 10,
    type: "SC",
    code: "SC-0270",
    name: "Prakash Thapa",
    country: "Nepal",
    citizen: "Non-Citizen",
    passType: "Work Permit",
    wpExpiry: isoDate(56),
    passportExpiry: isoDate(340),
    status: "Active",
    workPermitNo: "WP-661920",
    finNumber: "G5610912M",
    designation: "Rigger / Signalman",
    phone: "+65 9003 8201",
    email: "prakash.t@subcon.sg",
    nationality: "Nepalese",
    dob: "1997-04-26",
    passportNo: "NP661042",
    csoc: "CSOC-77102",
    csocExpiry: isoDate(25),
    documents: ["rigger_badge.pdf"],
  },
];

function daysUntil(value: string) {
  if (!value) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((new Date(value + "T00:00:00").getTime() - now.getTime()) / 86400000);
}

function expiryState(value: string): Exclude<ExpiryFilter, "all"> {
  const days = daysUntil(value);
  return days < 0 ? "expired" : days <= 30 ? "expiring" : "valid";
}

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value + "T00:00:00"));
}

/* ==========================================================================
   LOGIN COMPONENT (CLEAN, NO UNWANTED BUZZWORDS, DARK/LIGHT & MULTI-LANG)
   ========================================================================== */
function Login({
  onSuccess,
  theme,
  onToggleTheme,
  lang,
  onLangChange,
}: {
  onSuccess: (remember: boolean) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  lang: Language;
  onLangChange: (l: Language) => void;
}) {
  const t = translations[lang] || translations.en;
  const [email, setEmail] = useState("alex.morgan@workforce.sg");
  const [password, setPassword] = useState("password123");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState("alex");

  const demoAccounts = [
    {
      id: "alex",
      title: "Alex Morgan",
      role: "Operations Director",
      email: "alex.morgan@workforce.sg",
      pwd: "password123",
    },
    {
      id: "sarah",
      title: "Sarah Chen",
      role: "Safety Manager",
      email: "sarah.chen@workforce.sg",
      pwd: "password123",
    },
    {
      id: "marcus",
      title: "Marcus Tan",
      role: "Compliance Officer",
      email: "marcus.tan@workforce.sg",
      pwd: "password123",
    },
  ];

  function selectDemoAccount(acc: typeof demoAccounts[0]) {
    setActiveRole(acc.id);
    setEmail(acc.email);
    setPassword(acc.pwd);
    setError("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid work email address.");
    if (password.length < 6) return setError("Password must contain at least 6 characters.");
    setError("");
    setLoading(true);
    window.setTimeout(() => onSuccess(remember), 350);
  }

  function simulatePasskey() {
    setLoading(true);
    window.setTimeout(() => onSuccess(true), 500);
  }

  return (
    <main className="login-page">
      <section className="login-auth-panel">
        <div>
          {/* Top Control Bar: Dark/Light Mode & Language Selection */}
          <div className="login-top-bar">
            <div className="theme-lang-group">
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={onToggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <div className="lang-select-wrap">
                <Globe size={14} />
                <select
                  className="lang-select"
                  value={lang}
                  onChange={(e) => onLangChange(e.target.value as Language)}
                >
                  <option value="en">English (EN)</option>
                  <option value="zh">中文 (ZH)</option>
                  <option value="ta">தமிழ் (TA)</option>
                  <option value="bn">বাংলা (BN)</option>
                  <option value="ms">Melayu (MS)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="login-shell">
            {/* Clean Brand Header */}
            <div className="login-brand">
              <span className="brand-mark">
                <Building2 size={24} />
              </span>
              <div className="login-brand-meta">
                <strong>{t.brandName}</strong>
                <span>{t.brandSub}</span>
              </div>
            </div>

            {/* Clean Heading */}
            <div className="login-heading">
              <span className="auth-tag">
                <ShieldCheck size={14} /> {t.operationsPortal}
              </span>
              <h1>{t.welcomeBack}</h1>
              <p>{t.portalSubtitle}</p>
            </div>

            {/* Demo Account Switcher */}
            <div className="demo-role-section">
              <span>{t.quickDemo}</span>
              <div className="demo-role-grid">
                {demoAccounts.map((acc) => (
                  <button
                    type="button"
                    key={acc.id}
                    className={`demo-role-btn ${activeRole === acc.id ? "active" : ""}`}
                    onClick={() => selectDemoAccount(acc)}
                  >
                    {acc.title}
                    <small>{acc.role}</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="login-form" noValidate>
              <div className="auth-field">
                <label htmlFor="email">{t.workEmail}</label>
                <div className="auth-input-wrap">
                  <Mail size={17} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoFocus
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">{t.password}</label>
                <div className="auth-input-wrap">
                  <ShieldCheck size={17} />
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    className="auth-pwd-toggle"
                    onClick={() => setShow(!show)}
                    title={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="auth-meta-row">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>{t.rememberSession}</span>
                </label>
                <button
                  type="button"
                  className="link-button"
                  style={{ fontSize: "12px", color: "#34d399" }}
                  onClick={() => setError("Please contact your administrator to reset credentials.")}
                >
                  {t.forgotPassword}
                </button>
              </div>

              <button className="auth-login-btn primary-button" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw size={17} className="spin" />
                    <span>{t.signingIn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.signIn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="auth-divider">{t.orAuthWith}</div>

              <button
                type="button"
                className="auth-passkey-btn"
                onClick={simulatePasskey}
                disabled={loading}
              >
                <Fingerprint size={18} style={{ color: "#34d399" }} />
                <span>{t.biometricLogin}</span>
              </button>
            </form>
          </div>
        </div>

        <div className="login-shell">
          <footer className="login-compliance-footer">
            <div className="compliance-badges-row">
              <span><ShieldCheck size={13} /> ISO 27001 Certified</span>
              <span>•</span>
              <span><CheckCircle2 size={13} /> End-to-End Encryption</span>
              <span>•</span>
              <span><LockIcon /> SOC2 Verified</span>
            </div>
            <div className="login-footer-copy">
              Workforce Command Enterprise © 2026. All rights reserved.
            </div>
          </footer>
        </div>
      </section>

      <LoginScene />
    </main>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ==========================================================================
   SAMPLE SPREADSHEET DOWNLOAD HELPER & IMPORT MODAL
   ========================================================================== */
function downloadSampleCsvFile() {
  const headers = [
    "Worker Code",
    "Full Name",
    "Pass Type",
    "Nationality",
    "Country",
    "Job Designation",
    "WP Expiry (YYYY-MM-DD)",
    "Passport Expiry (YYYY-MM-DD)",
    "CSOC Expiry (YYYY-MM-DD)",
    "FIN Number",
    "Work Permit No",
    "Phone",
    "Email",
    "Status",
  ];

  const sampleRow1 = [
    "MB-2001",
    "Rajesh Sharma",
    "Work Permit",
    "Indian",
    "India",
    "Site Supervisor",
    isoDate(120),
    isoDate(500),
    isoDate(60),
    "G1842991R",
    "WP-882194",
    "+65 8123 4567",
    "rajesh.sharma@example.com",
    "Active",
  ];

  const sampleRow2 = [
    "MB-2002",
    "Tan Ah Meng",
    "Citizen",
    "Singaporean",
    "Singapore",
    "Project Coordinator",
    isoDate(999),
    isoDate(850),
    isoDate(300),
    "S8911002D",
    "N/A",
    "+65 9123 8899",
    "ahmeng.tan@example.com",
    "Active",
  ];

  const sampleRow3 = [
    "SC-3001",
    "Kamal Hossain",
    "Work Permit",
    "Bangladeshi",
    "Bangladesh",
    "Scaffolder Specialist",
    isoDate(45),
    isoDate(260),
    isoDate(15),
    "G9910283K",
    "WP-331029",
    "+65 8899 4433",
    "kamal@subcon.sg",
    "Active",
  ];

  const escape = (v: string) => `"${String(v || "").replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escape).join(","),
    sampleRow1.map(escape).join(","),
    sampleRow2.map(escape).join(","),
    sampleRow3.map(escape).join(","),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "workforce_sample_import_template.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function ImportModal({
  lang,
  onClose,
  onImportComplete,
}: {
  lang: Language;
  onClose: () => void;
  onImportComplete: (workers: Employee[]) => void;
}) {
  const t = translations[lang] || translations.en;
  const [parsedRows, setParsedRows] = useState<Employee[]>([]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function downloadSampleCsv() {
    downloadSampleCsvFile();
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) return;

      const records: Employee[] = lines.slice(1).map((line, idx) => {
        const val = line.split(",").map((v) => v.replace(/^"|"$/g, "").trim());
        return {
          id: Date.now() + idx,
          type: (val[0] && val[0].startsWith("SC")) ? "SC" : "MC",
          code: val[0] || `IMP-${idx + 100}`,
          name: val[1] || `Imported Worker ${idx + 1}`,
          passType: val[2] || "Work Permit",
          nationality: val[3] || "Foreign Worker",
          country: val[4] || val[3] || "Foreign Worker",
          citizen: val[2] === "Citizen" ? "Citizen" : "Non-Citizen",
          designation: val[5] || "General Worker",
          wpExpiry: val[6] || isoDate(90),
          passportExpiry: val[7] || isoDate(365),
          csocExpiry: val[8] || isoDate(180),
          finNumber: val[9] || "",
          workPermitNo: val[10] || "",
          phone: val[11] || "",
          email: val[12] || "",
          status: (val[13] === "Pending" ? "Pending" : "Active") as WorkerStatus,
          dob: "1994-01-01",
          passportNo: "",
          csoc: "",
          documents: [],
        };
      });

      setParsedRows(records);
    };
    reader.readAsText(file);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true" style={{ maxWidth: "780px" }}>
        <header className="modal-header">
          <div>
            <h2>{t.importTitle}</h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
              {t.importDescription}
            </p>
          </div>
          <button className="icon-button" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </header>

        <div className="modal-body-scroll">
          {/* Sample Template Download Card */}
          <div className="template-guide-card">
            <div className="template-guide-info">
              <div className="template-icon-box">
                <FileSpreadsheet size={24} />
              </div>
              <div className="template-guide-text">
                <h4>Sample Excel / CSV Template</h4>
                <p>{t.sampleTemplateNote}</p>
              </div>
            </div>
            <button
              type="button"
              className="download-template-btn"
              onClick={downloadSampleCsv}
            >
              <Download size={15} />
              <span>{t.downloadSampleTemplate}</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            className="import-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} style={{ color: "#10b981", margin: "0 auto 8px" }} />
            <div style={{ fontSize: "14px", fontWeight: 700 }}>
              {fileName ? `Selected: ${fileName}` : t.uploadAreaText}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {t.supportedFormats}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </div>

          {/* Preview Parsed Rows */}
          {parsedRows.length > 0 && (
            <div className="import-preview-box">
              <div className="import-preview-header">
                <span>
                  {parsedRows.length} {t.previewRows}
                </span>
                <span className="status-pill active">Validated Format</span>
              </div>
              <div className="import-preview-table-wrap">
                <table className="employee-data-table" style={{ fontSize: "12px" }}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Full Name</th>
                      <th>Pass Type</th>
                      <th>Designation</th>
                      <th>WP Expiry</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.code}</td>
                        <td>{r.name}</td>
                        <td>{r.passType}</td>
                        <td>{r.designation}</td>
                        <td>{r.wpExpiry}</td>
                        <td>
                          <span className={`status-pill ${r.status.toLowerCase()}`}>
                            <span className="dot" />
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>
            {t.cancel}
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={parsedRows.length === 0}
            onClick={() => {
              onImportComplete(parsedRows);
              onClose();
            }}
          >
            <Check size={16} />
            <span>{t.confirmImport} ({parsedRows.length})</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

/* ==========================================================================
   DIGITAL WORKER ID PASS & PROFILE DRAWER
   ========================================================================== */
function DigitalWorkerPass({
  employee,
  lang,
  onPrint,
}: {
  employee: Employee;
  lang: Language;
  onPrint: () => void;
}) {
  const t = translations[lang] || translations.en;
  const isExpired = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
    (d) => expiryState(d) === "expired"
  );
  const isExpiring = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
    (d) => expiryState(d) === "expiring"
  );

  return (
    <div className="digital-worker-id-card">
      <div className="pass-card-top-bar">
        <span className="pass-issuer">{t.digitalPass}</span>
        <span className="pass-type-ribbon">
          {employee.type === "MC" ? "MAIN CONTRACTOR" : "SUBCONTRACTOR"}
        </span>
      </div>

      <div className="pass-card-main-content">
        <div className="pass-photo-badge">
          {employee.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="pass-worker-bio">
          <h3>{employee.name}</h3>
          <p>{employee.designation}</p>
          <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
            <span
              style={{
                fontSize: "10px",
                padding: "2px 7px",
                borderRadius: "4px",
                background: isExpired ? "#ef4444" : isExpiring ? "#f59e0b" : "#10b981",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {isExpired ? "REVOKED / EXPIRED" : isExpiring ? "RENEWAL REQUIRED" : "ACTIVE & VERIFIED"}
            </span>
          </div>
        </div>
      </div>

      <dl className="pass-meta-grid">
        <div>
          <dt>Worker Code</dt>
          <dd>{employee.code}</dd>
        </div>
        <div>
          <dt>FIN Number</dt>
          <dd>{employee.finNumber || "—"}</dd>
        </div>
        <div>
          <dt>Work Permit No</dt>
          <dd>{employee.workPermitNo || "N/A"}</dd>
        </div>
        <div>
          <dt>Pass Type</dt>
          <dd>{employee.passType}</dd>
        </div>
      </dl>

      <div className="pass-barcode-sim">
        <div className="sim-barcode-lines" />
        <div className="pass-qr-sim">QR</div>
      </div>

      <div className="pass-print-action-bar">
        <button
          type="button"
          className="secondary-button compact"
          style={{ background: "rgba(255,255,255,0.15)", color: "#ffffff", borderColor: "rgba(255,255,255,0.25)" }}
          onClick={onPrint}
        >
          <Printer size={13} />
          <span>{t.printPass}</span>
        </button>
      </div>
    </div>
  );
}

function EmployeeDrawer({
  employee,
  lang,
  onClose,
  onEdit,
  onAlert,
}: {
  employee: Employee;
  lang: Language;
  onClose: () => void;
  onEdit: () => void;
  onAlert: (msg: string) => void;
}) {
  const t = translations[lang] || translations.en;
  const credentials = [
    { label: "Work Permit / S Pass", value: employee.wpExpiry, doc: employee.workPermitNo },
    { label: "Passport Expiry", value: employee.passportExpiry, doc: employee.passportNo },
    { label: "CSOC / BCSS Safety Cert", value: employee.csocExpiry, doc: employee.csoc },
  ];

  function handlePrintPass() {
    window.print();
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="detail-drawer-panel" role="dialog" aria-modal="true" aria-label="Employee Dossier">
        <header className="drawer-header">
          <div>
            <h2>{t.workerDossier}</h2>
            <p>{employee.code} • {employee.designation}</p>
          </div>
          <button className="icon-button" onClick={onClose} title="Close drawer">
            <X size={20} />
          </button>
        </header>

        <div className="drawer-body-scroll">
          <DigitalWorkerPass employee={employee} lang={lang} onPrint={handlePrintPass} />

          {/* Quick Contact & Personal Details */}
          <div>
            <div className="drawer-section-title">
              <span>{t.contactIdentity}</span>
              <span className={`status-pill ${employee.status.toLowerCase()}`}>
                <span className="dot" />
                {employee.status}
              </span>
            </div>
            <dl className="drawer-info-grid">
              <div>
                <dt>Email Address</dt>
                <dd>
                  {employee.email ? (
                    <a href={`mailto:${employee.email}`} style={{ color: "#059669", textDecoration: "none" }}>
                      {employee.email}
                    </a>
                  ) : "—"}
                </dd>
              </div>
              <div>
                <dt>Handphone</dt>
                <dd>
                  {employee.phone ? (
                    <a href={`tel:${employee.phone}`} style={{ color: "#059669", textDecoration: "none" }}>
                      {employee.phone}
                    </a>
                  ) : "—"}
                </dd>
              </div>
              <div>
                <dt>Nationality</dt>
                <dd>{employee.nationality} ({employee.country})</dd>
              </div>
              <div>
                <dt>Citizenship Status</dt>
                <dd>{employee.citizen || "—"}</dd>
              </div>
              <div>
                <dt>Date of Birth</dt>
                <dd>{formatDate(employee.dob)}</dd>
              </div>
              <div>
                <dt>FIN Number</dt>
                <dd>{employee.finNumber || "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Compliance Credentials */}
          <div>
            <div className="drawer-section-title">
              <span>{t.complianceCredentials}</span>
            </div>
            <div className="drawer-cred-list">
              {credentials.map((cred) => {
                const state = expiryState(cred.value);
                const days = daysUntil(cred.value);
                return (
                  <div key={cred.label} className="drawer-cred-card">
                    <div className="drawer-cred-left">
                      <div className={`cred-status-icon ${state}`}>
                        {state === "valid" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      </div>
                      <div className="drawer-cred-info">
                        <strong>{cred.label}</strong>
                        <small>Expiry: {formatDate(cred.value)} • Ref: {cred.doc || "—"}</small>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="expiry-cell-block">
                        <small className={state}>
                          {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days} days remaining`}
                        </small>
                      </span>
                      {days <= 30 && (
                        <button
                          type="button"
                          className="secondary-button compact"
                          onClick={() => onAlert(`Renewal notification sent for ${employee.name} (${cred.label}).`)}
                          title="Send renewal reminder"
                        >
                          <Send size={12} />
                          <span>Remind</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <div className="drawer-section-title">
              <span>{t.documentFiles}</span>
            </div>
            {employee.documents && employee.documents.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {employee.documents.map((doc) => (
                  <span
                    key={doc}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      background: "#f1f5f9",
                      fontSize: "11px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#334155",
                    }}
                  >
                    <FileBadge size={14} style={{ color: "#059669" }} />
                    {doc}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>No documents attached.</p>
            )}
          </div>
        </div>

        <footer className="drawer-footer">
          <button className="secondary-button" onClick={onClose}>
            {t.close}
          </button>
          <button className="primary-button" onClick={onEdit}>
            <Edit3 size={15} />
            <span>{t.editWorker}</span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

/* ==========================================================================
   CREATE / EDIT WORKER MODAL (AUTO-EXPIRY CALCULATOR & DEMO FILLER)
   ========================================================================== */
function EmployeeModal({
  initial,
  type,
  onClose,
  onSave,
}: {
  initial: Employee | null;
  type: WorkerType;
  onClose: () => void;
  onSave: (employee: Employee) => void;
}) {
  const blank: Employee = {
    id: 0,
    type,
    code: "",
    name: "",
    country: "Singapore",
    citizen: "Citizen",
    passType: "Citizen",
    wpExpiry: isoDate(365),
    passportExpiry: isoDate(730),
    status: "Active",
    workPermitNo: "",
    finNumber: "",
    designation: "",
    phone: "",
    email: "",
    nationality: "Singaporean",
    dob: "1994-01-01",
    passportNo: "",
    csoc: "",
    csocExpiry: isoDate(365),
    documents: [],
  };

  const [form, setForm] = useState<Employee>(initial || blank);
  const [error, setError] = useState("");

  const update = (key: keyof Employee, value: string | string[]) =>
    setForm({ ...form, [key]: value });

  function fillDemo() {
    const r = Math.floor(1000 + Math.random() * 9000);
    setForm({
      ...form,
      name: "Tariqul Islam",
      code: `${type}-${r}`,
      designation: "Heavy Equipment Specialist",
      country: "Bangladesh",
      nationality: "Bangladeshi",
      citizen: "Non-Citizen",
      passType: "Work Permit",
      phone: "+65 8920 1832",
      email: `tariqul.${r}@workforce.sg`,
      workPermitNo: `WP-${r}98`,
      finNumber: `G${r}214K`,
      passportNo: `B0${r}19`,
      dob: "1993-04-12",
      wpExpiry: isoDate(120),
      passportExpiry: isoDate(450),
      csoc: `CSOC-${r}1`,
      csocExpiry: isoDate(25),
      status: "Active",
      documents: ["passport_copy.pdf", "safety_cert.pdf"],
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      return setError("Worker full name and worker code are required.");
    }
    onSave(form);
  }

  function renderDateTag(val: string) {
    if (!val) return null;
    const days = daysUntil(val);
    const state = expiryState(val);
    return (
      <span className={`modal-date-tag ${state}`}>
        {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days}d left (${state})`}
      </span>
    );
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="modal-panel" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h2>{initial ? "Edit Worker Dossier" : "Register New Worker"}</h2>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
              {type === "MC" ? "Main Contractor Workforce Record" : "Subcontractor Personnel Record"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="secondary-button compact"
              onClick={fillDemo}
              title="Quick fill with sample data"
            >
              <Sparkles size={14} style={{ color: "#d97706" }} />
              <span>Fill Sample Data</span>
            </button>
            <button className="icon-button" onClick={onClose} title="Close modal">
              <X size={18} />
            </button>
          </div>
        </header>

        <form onSubmit={submit}>
          <div className="modal-body-scroll">
            {error && (
              <div className="auth-error-banner" style={{ background: "#fee2e2", color: "#991b1b" }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Personal Details */}
            <div className="modal-section-banner">
              <User size={16} />
              <span>Personal Details & Identity</span>
            </div>
            <div className="modal-form-grid">
              <div className="modal-field">
                <label>Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  required
                />
              </div>
              <div className="modal-field">
                <label>Worker Code *</label>
                <input
                  value={form.code}
                  onChange={(e) => update("code", e.target.value)}
                  placeholder="e.g. MB-1092"
                  required
                />
              </div>
              <div className="modal-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="worker@company.sg"
                />
              </div>
              <div className="modal-field">
                <label>Handphone Number</label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+65 8123 4567"
                />
              </div>
              <div className="modal-field">
                <label>Nationality</label>
                <input
                  value={form.nationality}
                  onChange={(e) => update("nationality", e.target.value)}
                  placeholder="e.g. Singaporean, Indian, Bangladeshi"
                />
              </div>
              <div className="modal-field">
                <label>Country of Origin</label>
                <input
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  placeholder="e.g. Singapore, India, Bangladesh"
                />
              </div>
              <div className="modal-field">
                <label>Citizenship Status</label>
                <select value={form.citizen} onChange={(e) => update("citizen", e.target.value)}>
                  <option value="Citizen">Citizen</option>
                  <option value="PR">PR (Permanent Resident)</option>
                  <option value="Non-Citizen">Non-Citizen</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                />
              </div>
            </div>

            {/* Step 2: Employment & Pass Info */}
            <div className="modal-section-banner">
              <BriefcaseBusiness size={16} />
              <span>Employment & Pass Classification</span>
            </div>
            <div className="modal-form-grid">
              <div className="modal-field">
                <label>Job Designation</label>
                <input
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                  placeholder="e.g. Site Supervisor, Scaffolder, Electrician"
                />
              </div>
              <div className="modal-field">
                <label>Pass Type</label>
                <select value={form.passType} onChange={(e) => update("passType", e.target.value)}>
                  <option>Work Permit</option>
                  <option>S Pass</option>
                  <option>Employment Pass</option>
                  <option>Permanent Resident</option>
                  <option>Citizen</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Work Permit Number</label>
                <input
                  value={form.workPermitNo}
                  onChange={(e) => update("workPermitNo", e.target.value)}
                  placeholder="e.g. WP-923184"
                />
              </div>
              <div className="modal-field">
                <label>FIN / NRIC Number</label>
                <input
                  value={form.finNumber}
                  onChange={(e) => update("finNumber", e.target.value)}
                  placeholder="e.g. G1842731R"
                />
              </div>
              <div className="modal-field">
                <label>Employment Status</label>
                <select value={form.status} onChange={(e) => update("status", e.target.value as WorkerStatus)}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Passport Number</label>
                <input
                  value={form.passportNo}
                  onChange={(e) => update("passportNo", e.target.value)}
                  placeholder="e.g. N8493012"
                />
              </div>
            </div>

            {/* Step 3: Expiry Dates */}
            <div className="modal-section-banner">
              <CalendarDays size={16} />
              <span>Compliance Expiry Dates</span>
            </div>
            <div className="modal-form-grid">
              <div className="modal-field">
                <label>
                  <span>Work Permit Expiry</span>
                  {renderDateTag(form.wpExpiry)}
                </label>
                <input
                  type="date"
                  value={form.wpExpiry}
                  onChange={(e) => update("wpExpiry", e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>
                  <span>Passport Expiry</span>
                  {renderDateTag(form.passportExpiry)}
                </label>
                <input
                  type="date"
                  value={form.passportExpiry}
                  onChange={(e) => update("passportExpiry", e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>CSOC / BCSS Cert Number</label>
                <input
                  value={form.csoc}
                  onChange={(e) => update("csoc", e.target.value)}
                  placeholder="e.g. CSOC-28414"
                />
              </div>
              <div className="modal-field">
                <label>
                  <span>CSOC Expiry Date</span>
                  {renderDateTag(form.csocExpiry)}
                </label>
                <input
                  type="date"
                  value={form.csocExpiry}
                  onChange={(e) => update("csocExpiry", e.target.value)}
                />
              </div>
            </div>

            {/* Documents Attachment */}
            <div className="modal-section-banner">
              <Upload size={16} />
              <span>Document Verification</span>
            </div>
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                background: "var(--surface-alt)",
                cursor: "pointer",
              }}
            >
              <Upload size={24} style={{ color: "#059669", margin: "0 auto 6px" }} />
              <div style={{ fontSize: "13px", fontWeight: 600 }}>Click to attach copies</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Passport, CSOC Certificate, WP Card (PDF, PNG, JPG)</div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={(e) => update("documents", Array.from(e.target.files || []).map((f) => f.name))}
              />
            </div>
            {form.documents.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {form.documents.map((d) => (
                  <span
                    key={d}
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "#e0f2fe",
                      color: "#0369a1",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FileBadge size={13} /> {d}
                  </span>
                ))}
              </div>
            )}
          </div>

          <footer className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button">
              <Check size={16} />
              <span>{initial ? "Save Changes" : "Create Worker Record"}</span>
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

/* ==========================================================================
   EXECUTIVE HOME / OVERVIEW COMMAND CENTER
   ========================================================================== */
function OverviewScreen({
  employees,
  summary,
  attention,
  lang,
  onOpenRecords,
  onCreate,
  onFilterExpiring,
  onSendAlert,
}: {
  employees: Employee[];
  summary: {
    wp: { valid: number; expiring: number; expired: number };
    passport: { valid: number; expiring: number; expired: number };
    csoc: { valid: number; expiring: number; expired: number };
  };
  attention: number;
  lang: Language;
  onOpenRecords: () => void;
  onCreate: () => void;
  onFilterExpiring: () => void;
  onSendAlert: (msg: string) => void;
}) {
  const t = translations[lang] || translations.en;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const complianceTotal = employees.length * 3 || 1;
  const validTotal = summary.wp.valid + summary.passport.valid + summary.csoc.valid;
  const readiness = Math.round((validTotal / complianceTotal) * 100);

  const priorityWorkers = [...employees]
    .filter((e) =>
      [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => expiryState(d) !== "valid")
    )
    .sort(
      (a, b) =>
        Math.min(daysUntil(a.wpExpiry), daysUntil(a.passportExpiry), daysUntil(a.csocExpiry)) -
        Math.min(daysUntil(b.wpExpiry), daysUntil(b.passportExpiry), daysUntil(b.csocExpiry))
    )
    .slice(0, 4);

  const buckets = [
    { label: "7 Days", limit: 7, count: 0, cls: "urgent" },
    { label: "30 Days", limit: 30, count: 0, cls: "warning" },
    { label: "60 Days", limit: 60, count: 0, cls: "notice" },
    { label: "90 Days", limit: 90, count: 0, cls: "normal" },
  ];

  buckets[0].count = employees.filter((e) =>
    [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => {
      const du = daysUntil(d);
      return du >= 0 && du <= 7;
    })
  ).length;

  buckets[1].count = employees.filter((e) =>
    [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => {
      const du = daysUntil(d);
      return du > 7 && du <= 30;
    })
  ).length;

  buckets[2].count = employees.filter((e) =>
    [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => {
      const du = daysUntil(d);
      return du > 30 && du <= 60;
    })
  ).length;

  buckets[3].count = employees.filter((e) =>
    [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => {
      const du = daysUntil(d);
      return du > 60 && du <= 90;
    })
  ).length;

  return (
    <div className="overview-container">
      {/* Executive Welcome Hero Banner */}
      <section className="overview-hero-card">
        <div>
          <span className="hero-welcome-badge">
            <Sparkles size={12} /> Live Command Center
          </span>
          <h1>{t.welcomeUser}</h1>
          <p>
            {t.commandSubtitle} Compliance Index: <strong>{readiness}%</strong>.
            {attention > 0 && (
              <span style={{ color: "#fca5a5", marginLeft: "6px" }}>
                ({attention} credentials due for renewal review)
              </span>
            )}
          </p>
        </div>
        <div className="hero-cta-group">
          <button className="secondary-button" onClick={onOpenRecords}>
            <UsersRound size={16} />
            <span>{t.viewWorkforce}</span>
          </button>
          <button className="primary-button" onClick={onCreate}>
            <Plus size={16} />
            <span>{t.createWorker}</span>
          </button>
        </div>
      </section>

      {/* KPI Glass Cards */}
      <section className="kpi-metrics-grid">
        <article className="kpi-card emerald">
          <div className="kpi-card-top">
            <span>{t.totalWorkforce}</span>
            <div className="kpi-icon-pill emerald">
              <UsersRound size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <strong>{employees.length}</strong>
            <span className="kpi-trend-tag positive">+12% YoY</span>
          </div>
          <p className="kpi-subtext">
            {employees.filter((e) => e.type === "MC").length} Main-Con • {employees.filter((e) => e.type === "SC").length} Subcontractors
          </p>
        </article>

        <article className="kpi-card sky">
          <div className="kpi-card-top">
            <span>{t.activeOnSite}</span>
            <div className="kpi-icon-pill sky">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <strong>{activeCount}</strong>
            <span className="kpi-trend-tag positive">
              {Math.round((activeCount / Math.max(1, employees.length)) * 100)}%
            </span>
          </div>
          <p className="kpi-subtext">Verified deployable personnel</p>
        </article>

        <article className="kpi-card gold">
          <div className="kpi-card-top">
            <span>{t.complianceScore}</span>
            <div className="kpi-icon-pill gold">
              <Gauge size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <strong>{readiness}%</strong>
            <span className="kpi-trend-tag neutral">{validTotal}/{complianceTotal}</span>
          </div>
          <p className="kpi-subtext">Statutory certificates audited & valid</p>
        </article>

        <article
          className="kpi-card rose"
          style={{ cursor: "pointer" }}
          onClick={onFilterExpiring}
          title="Click to view expiring workers"
        >
          <div className="kpi-card-top">
            <span>{t.requiresAttention}</span>
            <div className="kpi-icon-pill rose">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <strong>{attention}</strong>
            <span className="kpi-trend-tag warning">Urgent</span>
          </div>
          <p className="kpi-subtext">Expired or due in ≤ 30 days →</p>
        </article>
      </section>

      {/* 2-Column Dashboard Grid */}
      <section className="dashboard-grid-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <article className="dash-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-title">
                <div className="panel-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2>{t.credentialCoverage}</h2>
                  <p>Real-time validity across statutory requirements</p>
                </div>
              </div>
              <span className="status-pill active">{readiness}% Ready</span>
            </div>

            <div className="compliance-progress-list">
              {[
                { label: "Work Permits & S Passes", stats: summary.wp },
                { label: "Worker Passports", stats: summary.passport },
                { label: "CSOC / BCSS Safety Certs", stats: summary.csoc },
              ].map((item) => {
                const tot = Math.max(1, item.stats.valid + item.stats.expiring + item.stats.expired);
                const pct = Math.round((item.stats.valid / tot) * 100);
                return (
                  <div key={item.label} className="comp-progress-item">
                    <div className="comp-meta-row">
                      <strong>{item.label}</strong>
                      <span>{pct}% Current</span>
                    </div>
                    <div className="comp-track">
                      <div className="comp-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="comp-details-row">
                      <span>{item.stats.valid} Valid</span>
                      <span style={{ color: "#d97706" }}>{item.stats.expiring} Expiring soon</span>
                      <span style={{ color: "#dc2626" }}>{item.stats.expired} Expired</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="dash-panel">
            <div className="dash-panel-header">
              <div className="dash-panel-title">
                <div className="panel-icon" style={{ color: "#d97706" }}>
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h2>{t.expiryHorizon}</h2>
                  <p>Upcoming statutory milestones (7 to 90 days)</p>
                </div>
              </div>
              <button className="link-button" onClick={onOpenRecords} style={{ fontSize: "12px" }}>
                Filter All <ArrowRight size={13} />
              </button>
            </div>

            <div className="expiry-radar-bars">
              {buckets.map((b) => (
                <div key={b.label} className={`expiry-col ${b.cls}`} onClick={onFilterExpiring}>
                  <span className="expiry-count-bubble">{b.count}</span>
                  <div
                    className="expiry-bar-pillar"
                    style={{ height: `${Math.max(16, b.count * 28)}px` }}
                  />
                  <span className="lbl">{b.label}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <article className="dash-panel" style={{ height: "100%" }}>
            <div className="dash-panel-header">
              <div className="dash-panel-title">
                <div className="panel-icon" style={{ color: "#dc2626" }}>
                  <Activity size={18} />
                </div>
                <div>
                  <h2>{t.priorityQueue}</h2>
                  <p>Immediate compliance renewals required</p>
                </div>
              </div>
              <span className="status-pill pending">{priorityWorkers.length} Pending</span>
            </div>

            <div className="priority-queue-list">
              {priorityWorkers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px", color: "#94a3b8" }}>
                  <CheckCircle2 size={32} style={{ color: "#10b981", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>All workforce records up to date!</p>
                </div>
              ) : (
                priorityWorkers.map((w) => {
                  const minDays = Math.min(
                    daysUntil(w.wpExpiry),
                    daysUntil(w.passportExpiry),
                    daysUntil(w.csocExpiry)
                  );
                  const isOver = minDays < 0;
                  return (
                    <div key={w.id} className="priority-item-card">
                      <div className="priority-avatar">
                        {w.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="priority-details">
                        <strong>{w.name}</strong>
                        <small>{w.code} • {w.designation}</small>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        <span className={`priority-badge-alert ${isOver ? "overdue" : "due-soon"}`}>
                          {isOver ? `${Math.abs(minDays)}d overdue` : `${minDays}d left`}
                        </span>
                        <button
                          type="button"
                          className="link-button"
                          style={{ fontSize: "11px" }}
                          onClick={() => onSendAlert(`Renewal notice sent for ${w.name}.`)}
                        >
                          {t.sendAlert}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ marginTop: "auto", paddingTop: "18px" }}>
              <button
                className="secondary-button"
                style={{ width: "100%", justifyContent: "space-between" }}
                onClick={onOpenRecords}
              >
                <span>{t.openRegistry}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   MAIN APPLICATION ROOT COMPONENT
   ========================================================================== */
export default function Home() {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<AppView>("overview");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [employees, setEmployees] = useState<Employee[]>(seedEmployees);
  const [tab, setTab] = useState<WorkerType>("MC");

  // Theme & Language
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang] || translations.en;

  // Sorting
  const [sortKey, setSortKey] = useState<ColumnKey>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filters
  const [draft, setDraft] = useState<FilterState>(emptyFilters);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [quickChip, setQuickChip] = useState<string>("all");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Pagination & Columns
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState<ColumnKey[]>(defaultColumns);
  const [selected, setSelected] = useState<number[]>([]);

  // Dialogs
  const [modal, setModal] = useState<Employee | "new" | null>(null);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<Record<string, FilterState>>({});
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Clock
  const [currentTime, setCurrentTime] = useState("");

  // Initialize from storage
  useEffect(() => {
    const isAuth =
      localStorage.getItem("workforce_session") === "active" ||
      sessionStorage.getItem("workforce_session") === "active";
    setAuthenticated(isAuth);

    const storedTheme = localStorage.getItem("workforce_theme") as "dark" | "light";
    if (storedTheme) setTheme(storedTheme);

    const storedLang = localStorage.getItem("workforce_lang") as Language;
    if (storedLang) setLang(storedLang);

    const storedRecords = localStorage.getItem("workforce_employees_v2");
    const storedViews = localStorage.getItem("workforce_views");
    const storedCols = localStorage.getItem("workforce_columns");
    const storedMode = localStorage.getItem("workforce_view_mode") as ViewMode;

    if (storedRecords) {
      try {
        setEmployees(JSON.parse(storedRecords));
      } catch (e) {
        setEmployees(seedEmployees);
      }
    }
    if (storedViews) {
      try {
        setSavedViews(JSON.parse(storedViews));
      } catch (e) {}
    }
    if (storedCols) {
      try {
        setColumns(JSON.parse(storedCols));
      } catch (e) {}
    }
    if (storedMode) setViewMode(storedMode);

    setReady(true);
  }, []);

  // Update theme attribute on root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("workforce_theme", theme);
  }, [theme]);

  // Update lang in storage
  useEffect(() => {
    localStorage.setItem("workforce_lang", lang);
  }, [lang]);

  // Sync state to local storage
  useEffect(() => {
    if (ready) {
      localStorage.setItem("workforce_employees_v2", JSON.stringify(employees));
    }
  }, [employees, ready]);

  // Live Singapore Clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-SG", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
          ", " +
          now.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" }) +
          " SGT"
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Tab employees
  const tabEmployees = useMemo(
    () => employees.filter((e) => e.type === tab),
    [employees, tab]
  );

  // Filtered employees
  const filtered = useMemo(() => {
    return tabEmployees.filter((employee) => {
      const q = filters.query.toLowerCase().trim();
      const searchMatch =
        !q ||
        [
          employee.name,
          employee.code,
          employee.passportNo,
          employee.workPermitNo,
          employee.finNumber,
          employee.designation,
          employee.phone,
          employee.email,
        ].some((val) => val && val.toLowerCase().includes(q));

      const matchesExpiry = (val: string, f: ExpiryFilter) =>
        f === "all" || expiryState(val) === f;

      return (
        searchMatch &&
        (!filters.citizen || employee.citizen === filters.citizen) &&
        (!filters.passType || employee.passType === filters.passType) &&
        (!filters.status || employee.status === filters.status) &&
        matchesExpiry(employee.wpExpiry, filters.wp) &&
        matchesExpiry(employee.passportExpiry, filters.passport) &&
        matchesExpiry(employee.csocExpiry, filters.csoc)
      );
    });
  }, [tabEmployees, filters]);

  // Sorted employees
  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let aVal = a[sortKey] || "";
      let bVal = b[sortKey] || "";

      if (sortKey === "wpExpiry" || sortKey === "passportExpiry" || sortKey === "csocExpiry") {
        aVal = String(daysUntil(String(aVal)));
        bVal = String(daysUntil(String(bVal)));
        const numA = Number(aVal);
        const numB = Number(bVal);
        return sortOrder === "asc" ? numA - numB : numB - numA;
      }

      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortOrder === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortOrder]);

  const maxPage = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, maxPage);
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Summary counts
  const summary = useMemo(() => {
    const count = (key: "wpExpiry" | "passportExpiry" | "csocExpiry") => ({
      valid: employees.filter((e) => expiryState(e[key]) === "valid").length,
      expiring: employees.filter((e) => expiryState(e[key]) === "expiring").length,
      expired: employees.filter((e) => expiryState(e[key]) === "expired").length,
    });
    return {
      wp: count("wpExpiry"),
      passport: count("passportExpiry"),
      csoc: count("csocExpiry"),
    };
  }, [employees]);

  const attentionCount = employees.filter((e) =>
    [e.wpExpiry, e.passportExpiry, e.csocExpiry].some((d) => expiryState(d) !== "valid")
  ).length;

  // Actions
  function login(remember: boolean) {
    (remember ? localStorage : sessionStorage).setItem("workforce_session", "active");
    setAuthenticated(true);
    setNotice("Authenticated successfully. Welcome to Workforce Command.");
  }

  function logout() {
    localStorage.removeItem("workforce_session");
    sessionStorage.removeItem("workforce_session");
    setAuthenticated(false);
  }

  function handleSort(key: ColumnKey) {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  function handleQuickChip(kind: string) {
    setQuickChip(kind);
    setPage(1);

    if (kind === "all") {
      setFilters(emptyFilters);
      setDraft(emptyFilters);
    } else if (kind === "expired") {
      const next: FilterState = { ...emptyFilters, wp: "expired" };
      setFilters(next);
      setDraft(next);
    } else if (kind === "expiring") {
      const next: FilterState = { ...emptyFilters, wp: "expiring" };
      setFilters(next);
      setDraft(next);
    } else if (kind === "wp") {
      const next: FilterState = { ...emptyFilters, passType: "Work Permit" };
      setFilters(next);
      setDraft(next);
    } else if (kind === "spass") {
      const next: FilterState = { ...emptyFilters, passType: "S Pass" };
      setFilters(next);
      setDraft(next);
    } else if (kind === "active") {
      const next: FilterState = { ...emptyFilters, status: "Active" };
      setFilters(next);
      setDraft(next);
    } else if (kind === "pending") {
      const next: FilterState = { ...emptyFilters, status: "Pending" };
      setFilters(next);
      setDraft(next);
    }
  }

  function saveEmployee(emp: Employee) {
    setEmployees((curr) => {
      const record =
        emp.id === 0 ? { ...emp, id: Math.max(0, ...curr.map((i) => i.id)) + 1 } : emp;
      return curr.some((i) => i.id === record.id)
        ? curr.map((i) => (i.id === record.id ? record : i))
        : [record, ...curr];
    });
    setModal(null);
    setNotice(`Worker record for ${emp.name} saved successfully.`);
  }

  function remove(ids: number[]) {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} worker record(s)? This action cannot be reversed.`))
      return;
    setEmployees((curr) => curr.filter((e) => !ids.includes(e.id)));
    setSelected([]);
    setNotice(`${ids.length} record(s) deleted.`);
  }

  function changeStatus(ids: number[], status: WorkerStatus) {
    setEmployees((curr) =>
      curr.map((e) => (ids.includes(e.id) ? { ...e, status } : e))
    );
    setSelected([]);
    setNotice(`${ids.length} worker record(s) updated to ${status}.`);
  }

  function toggleColumn(key: ColumnKey) {
    const next = columns.includes(key)
      ? columns.filter((col) => col !== key)
      : [...columns, key];
    setColumns(next);
    localStorage.setItem("workforce_columns", JSON.stringify(next));
  }

  function changeViewMode(mode: ViewMode) {
    setViewMode(mode);
    localStorage.setItem("workforce_view_mode", mode);
  }

  function exportCsv() {
    const headers = [
      "Worker Code",
      "Name",
      "Type",
      "Status",
      "Pass Type",
      "Nationality",
      "Designation",
      "WP Expiry",
      "Passport Expiry",
      "CSOC Expiry",
      "Phone",
      "Email",
    ];
    const escape = (val: string) => `"${String(val || "").replace(/"/g, '""')}"`;
    const lines = sorted.map((e) =>
      [
        e.code,
        e.name,
        e.type,
        e.status,
        e.passType,
        e.nationality,
        e.designation,
        e.wpExpiry,
        e.passportExpiry,
        e.csocExpiry,
        e.phone,
        e.email,
      ]
        .map(escape)
        .join(",")
    );

    const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workforce-records-${tab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setNotice(`${sorted.length} worker records exported to CSV.`);
  }

  function handleBatchImport(newWorkers: Employee[]) {
    setEmployees((curr) => [...newWorkers, ...curr]);
    setNotice(`Successfully imported ${newWorkers.length} personnel records into ${tab}.`);
  }

  if (!ready) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: "#64748b",
        }}
      >
        <RefreshCw className="spin" size={24} />
        <span>Loading Workforce Command Suite...</span>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <Login
        onSuccess={login}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        lang={lang}
        onLangChange={setLang}
      />
    );
  }

  return (
    <div className="app-shell">
      {/* MODERN EXECUTIVE NAVIGATION SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-mark">
            <Building2 size={22} />
          </span>
          <div className="sidebar-brand-meta">
            <strong>{t.brandName}</strong>
            <small>{t.brandSub}</small>
          </div>
          <button
            className="icon-button sidebar-close"
            onClick={() => setSidebarOpen(false)}
            title="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-status-banner">
          <span className="pulse-dot" />
          <span>Compliance Live Sync</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">{t.operationsCore}</div>
          <button
            className={view === "overview" ? "active" : ""}
            onClick={() => {
              setView("overview");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={17} />
            <span>{t.overview}</span>
          </button>

          <button
            className={view === "employees" ? "active" : ""}
            onClick={() => {
              setView("employees");
              setSidebarOpen(false);
            }}
          >
            <UsersRound size={17} />
            <span>{t.employeeRecords}</span>
            <span className="badge">{employees.length}</span>
          </button>

          <button
            onClick={() => {
              setView("employees");
              handleQuickChip("expiring");
              setSidebarOpen(false);
            }}
          >
            <CalendarDays size={17} />
            <span>{t.expiryCalendar}</span>
            {attentionCount > 0 && (
              <span className="badge" style={{ background: "#ef4444", color: "#ffffff" }}>
                {attentionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setView("overview");
              setSidebarOpen(false);
              setNotice("Statutory Compliance matrix loaded.");
            }}
          >
            <ShieldCheck size={17} />
            <span>{t.complianceMatrix}</span>
          </button>

          <div className="sidebar-section-title">{t.managementAudits}</div>
          <button
            onClick={() => {
              setTab("SC");
              setView("employees");
              setSidebarOpen(false);
            }}
          >
            <BriefcaseBusiness size={17} />
            <span>{t.subcontractors}</span>
            <span className="badge">{employees.filter((e) => e.type === "SC").length}</span>
          </button>

          <button onClick={exportCsv}>
            <FileSpreadsheet size={17} />
            <span>{t.exportAudit}</span>
          </button>
        </nav>

        {/* Sidebar Quota Gauge */}
        <div className="sidebar-readiness-box">
          <div className="readiness-header">
            <span>{t.workforceReadiness}</span>
            <strong>
              {Math.round(
                ((summary.wp.valid + summary.passport.valid + summary.csoc.valid) /
                  (employees.length * 3 || 1)) *
                  100
              )}
              %
            </strong>
          </div>
          <div className="readiness-bar-track">
            <div
              className="readiness-bar-fill"
              style={{
                width: `${Math.round(
                  ((summary.wp.valid + summary.passport.valid + summary.csoc.valid) /
                    (employees.length * 3 || 1)) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* User Profile Card */}
        <div className="sidebar-profile">
          <div className="avatar">AM</div>
          <div className="sidebar-profile-info">
            <strong>Alex Morgan</strong>
            <span>Operations Director</span>
          </div>
          <button className="icon-button" onClick={logout} title={t.signOut}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* WORKSPACE & STICKY GLASS TOPBAR */}
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-button"
              onClick={() => setSidebarOpen(true)}
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div className="topbar-breadcrumb">
              <span>{t.brandName}</span>
              <ChevronRight size={14} />
              <strong>{view === "overview" ? t.overview : t.employeeRecords}</strong>
            </div>
          </div>

          <div className="topbar-right">
            {currentTime && (
              <div className="topbar-clock">
                <span className="pulse-dot" />
                <Clock size={13} />
                <span>{currentTime}</span>
              </div>
            )}

            {/* Dark / Light Mode Switcher in Topbar */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* Language Switcher in Topbar */}
            <div className="lang-select-wrap">
              <Globe size={14} />
              <select
                className="lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
              >
                <option value="en">EN</option>
                <option value="zh">中文</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="ms">Melayu</option>
              </select>
            </div>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                className="icon-button notification-trigger"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
              >
                <Bell size={18} />
                {attentionCount > 0 && <span className="notification-badge" />}
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "44px",
                    right: 0,
                    width: "300px",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    border: "1px solid var(--border-light)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    padding: "12px",
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "8px",
                      borderBottom: "1px solid var(--border-subtle)",
                      paddingBottom: "6px",
                    }}
                  >
                    <span>Compliance Alerts</span>
                    <span style={{ color: "#ef4444" }}>{attentionCount} Due</span>
                  </div>
                  {attentionCount === 0 ? (
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)" }}>
                      No urgent compliance notifications.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {employees
                        .filter((e) =>
                          [e.wpExpiry, e.passportExpiry, e.csocExpiry].some(
                            (d) => expiryState(d) !== "valid"
                          )
                        )
                        .slice(0, 3)
                        .map((e) => (
                          <div
                            key={e.id}
                            style={{
                              fontSize: "11px",
                              padding: "6px",
                              background: "rgba(239, 68, 68, 0.12)",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setDetailEmployee(e);
                              setNotifOpen(false);
                            }}
                          >
                            <strong style={{ display: "block", color: "#dc2626" }}>{e.name}</strong>
                            <span style={{ color: "var(--text-muted)" }}>Credentials require renewal</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="content">
          {view === "overview" ? (
            <OverviewScreen
              employees={employees}
              summary={summary}
              attention={attentionCount}
              lang={lang}
              onOpenRecords={() => setView("employees")}
              onCreate={() => {
                setView("employees");
                setModal("new");
              }}
              onFilterExpiring={() => {
                setView("employees");
                handleQuickChip("expiring");
              }}
              onSendAlert={(msg) => setNotice(msg)}
            />
          ) : (
            <div className="records-container">
              {/* Heading & Page Actions */}
              <div className="page-title-row">
                <div>
                  <h1>{t.employeeRecords}</h1>
                  <p>
                    Manage personnel profiles, statutory work passes, certifications, and audit readiness.
                  </p>
                </div>
                <div className="page-actions-group">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      downloadSampleCsvFile();
                      setNotice("Sample Excel/CSV template downloaded. Fill and import it anytime.");
                    }}
                    title="Download Excel / CSV template"
                  >
                    <FileSpreadsheet size={15} style={{ color: "#10b981" }} />
                    <span>{t.sampleExcelTemplate}</span>
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setImportModalOpen(true)}
                  >
                    <Upload size={15} />
                    <span>{t.importRecords}</span>
                  </button>
                  <button type="button" className="secondary-button" onClick={exportCsv}>
                    <Download size={15} />
                    <span>{t.exportCsv}</span>
                  </button>
                  <button type="button" className="primary-button" onClick={() => setModal("new")}>
                    <Plus size={15} />
                    <span>{t.createWorker}</span>
                  </button>
                </div>
              </div>

              {/* Smart 1-Click Quick Filter Bar */}
              <div className="quick-filter-strip">
                <button
                  type="button"
                  className={`quick-filter-pill ${quickChip === "all" ? "active" : ""}`}
                  onClick={() => handleQuickChip("all")}
                >
                  <span>{t.allWorkers}</span>
                  <span className="pill-counter">{tabEmployees.length}</span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill urgent ${quickChip === "expired" ? "active" : ""}`}
                  onClick={() => handleQuickChip("expired")}
                >
                  <AlertCircle size={13} />
                  <span>{t.expiredPasses}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => expiryState(e.wpExpiry) === "expired").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill warning ${quickChip === "expiring" ? "active" : ""}`}
                  onClick={() => handleQuickChip("expiring")}
                >
                  <Clock size={13} />
                  <span>{t.expiringSoon}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => expiryState(e.wpExpiry) === "expiring").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill ${quickChip === "wp" ? "active" : ""}`}
                  onClick={() => handleQuickChip("wp")}
                >
                  <span>{t.workPermit}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => e.passType === "Work Permit").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill ${quickChip === "spass" ? "active" : ""}`}
                  onClick={() => handleQuickChip("spass")}
                >
                  <span>{t.sPass}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => e.passType === "S Pass").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill ${quickChip === "active" ? "active" : ""}`}
                  onClick={() => handleQuickChip("active")}
                >
                  <span>{t.active}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => e.status === "Active").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`quick-filter-pill ${quickChip === "pending" ? "active" : ""}`}
                  onClick={() => handleQuickChip("pending")}
                >
                  <span>{t.pending}</span>
                  <span className="pill-counter">
                    {tabEmployees.filter((e) => e.status === "Pending").length}
                  </span>
                </button>
              </div>

              {/* Master Control Card */}
              <div className="records-master-card">
                {/* Contract Category Tabs & View Mode Switcher */}
                <div className="contract-tabs-row">
                  <div className="tabs-left">
                    <button
                      className={`tab-btn ${tab === "MC" ? "active" : ""}`}
                      onClick={() => {
                        setTab("MC");
                        setSelected([]);
                        setPage(1);
                      }}
                    >
                      <Building2 size={16} />
                      <span>{t.mainCon}</span>
                      <span className="tab-count">
                        {employees.filter((e) => e.type === "MC").length}
                      </span>
                    </button>
                    <button
                      className={`tab-btn ${tab === "SC" ? "active" : ""}`}
                      onClick={() => {
                        setTab("SC");
                        setSelected([]);
                        setPage(1);
                      }}
                    >
                      <BriefcaseBusiness size={16} />
                      <span>{t.subCon}</span>
                      <span className="tab-count">
                        {employees.filter((e) => e.type === "SC").length}
                      </span>
                    </button>
                  </div>

                  {/* Table vs Grid View Toggle */}
                  <div className="view-mode-toggle">
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
                      onClick={() => changeViewMode("table")}
                      title="Table Data Grid"
                    >
                      <Table2 size={15} />
                      <span>{t.table}</span>
                    </button>
                    <button
                      type="button"
                      className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                      onClick={() => changeViewMode("grid")}
                      title="Visual Employee Cards"
                    >
                      <LayoutGrid size={15} />
                      <span>{t.cards}</span>
                    </button>
                  </div>
                </div>

                {/* Search & Tool Actions Bar */}
                <div className="records-toolbar">
                  <div className="toolbar-search">
                    <Search size={16} />
                    <input
                      value={draft.query}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft({ ...draft, query: val });
                        setFilters({ ...filters, query: val });
                        setPage(1);
                      }}
                      placeholder={t.searchPlaceholder}
                    />
                    {draft.query && (
                      <button
                        type="button"
                        className="toolbar-search-clear"
                        onClick={() => {
                          setDraft({ ...draft, query: "" });
                          setFilters({ ...filters, query: "" });
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="toolbar-actions-right">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      style={{ width: "auto", minHeight: "36px", fontSize: "12px" }}
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                    </select>

                    <button
                      type="button"
                      className="secondary-button compact"
                      onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                    >
                      <Filter size={14} />
                      <span>{t.filter}</span>
                    </button>

                    <details className="columns-menu">
                      <summary className="secondary-button compact">
                        <Columns3 size={14} />
                        <span>{t.columns}</span>
                        <ChevronDown size={13} />
                      </summary>
                      <div className="columns-popover">
                        {(Object.keys(columnLabels) as ColumnKey[]).map((key) => (
                          <label key={key}>
                            <input
                              type="checkbox"
                              checked={columns.includes(key)}
                              onChange={() => toggleColumn(key)}
                            />
                            <span>{columnLabels[key]}</span>
                          </label>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>

                {/* Collapsible Advanced Filters Drawer */}
                {filterPanelOpen && (
                  <div
                    style={{
                      padding: "14px 18px",
                      background: "var(--surface-alt)",
                      borderBottom: "1px solid var(--border-light)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>Citizenship</label>
                      <select
                        value={filters.citizen}
                        onChange={(e) => setFilters({ ...filters, citizen: e.target.value })}
                        style={{ marginTop: "4px", minHeight: "34px", fontSize: "12px" }}
                      >
                        <option value="">All Citizenships</option>
                        <option value="Citizen">Singapore Citizen</option>
                        <option value="PR">Permanent Resident</option>
                        <option value="Non-Citizen">Non-Citizen</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>Pass Type</label>
                      <select
                        value={filters.passType}
                        onChange={(e) => setFilters({ ...filters, passType: e.target.value })}
                        style={{ marginTop: "4px", minHeight: "34px", fontSize: "12px" }}
                      >
                        <option value="">All Passes</option>
                        <option value="Work Permit">Work Permit</option>
                        <option value="S Pass">S Pass</option>
                        <option value="Employment Pass">Employment Pass</option>
                        <option value="Permanent Resident">Permanent Resident</option>
                        <option value="Citizen">Citizen</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        style={{ marginTop: "4px", minHeight: "34px", fontSize: "12px" }}
                      >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                      <button
                        type="button"
                        className="secondary-button compact"
                        onClick={() => {
                          setFilters(emptyFilters);
                          setDraft(emptyFilters);
                        }}
                      >
                        <RefreshCw size={13} />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bulk Actions Bar */}
                {selected.length > 0 && (
                  <div className="bulk-action-bar">
                    <div className="bulk-count">
                      <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                      <span>{selected.length} worker record(s) selected</span>
                    </div>
                    <div className="bulk-btn-group">
                      <button
                        type="button"
                        className="secondary-button compact"
                        onClick={() => changeStatus(selected, "Active")}
                      >
                        <UserCheck size={13} />
                        <span>Mark Active</span>
                      </button>
                      <button
                        type="button"
                        className="secondary-button compact"
                        onClick={() => changeStatus(selected, "Pending")}
                      >
                        <Clock size={13} />
                        <span>Mark Pending</span>
                      </button>
                      <button
                        type="button"
                        className="secondary-button compact"
                        onClick={() => {
                          setNotice(`Verification notice dispatched to ${selected.length} worker(s).`);
                          setSelected([]);
                        }}
                      >
                        <Send size={13} />
                        <span>Dispatch Reminders</span>
                      </button>
                      <button
                        type="button"
                        className="danger-button compact"
                        onClick={() => remove(selected)}
                      >
                        <Trash2 size={13} />
                        <span>Delete Selected</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW MODE 1: DATA TABLE */}
                {viewMode === "table" ? (
                  <div className="table-responsive-wrapper">
                    <table className="employee-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px", textAlign: "center" }}>
                            <input
                              type="checkbox"
                              checked={rows.length > 0 && rows.every((e) => selected.includes(e.id))}
                              onChange={(e) =>
                                setSelected(
                                  e.target.checked
                                    ? Array.from(new Set([...selected, ...rows.map((r) => r.id)]))
                                    : selected.filter((id) => !rows.some((r) => r.id === id))
                                )
                              }
                            />
                          </th>
                          <th style={{ width: "50px" }}>S/N</th>
                          {columns.map((col) => (
                            <th
                              key={col}
                              className="sortable-th"
                              onClick={() => handleSort(col)}
                              title={`Click to sort by ${columnLabels[col]}`}
                            >
                              <div className="th-sort-wrapper">
                                <span>{columnLabels[col]}</span>
                                {sortKey === col ? (
                                  sortOrder === "asc" ? " ↑" : " ↓"
                                ) : (
                                  <span style={{ opacity: 0.3 }}>⇅</span>
                                )}
                              </div>
                            </th>
                          ))}
                          <th style={{ textAlign: "right", paddingRight: "16px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length + 3} style={{ textAlign: "center", padding: "40px 20px" }}>
                              <Search size={32} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                              <strong style={{ display: "block", color: "var(--text-main)" }}>
                                No matching employee records found
                              </strong>
                              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                Try clearing search keywords or active filters.
                              </span>
                            </td>
                          </tr>
                        ) : (
                          rows.map((employee, idx) => {
                            const isExpired = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
                              (d) => expiryState(d) === "expired"
                            );
                            const isExpiring = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
                              (d) => expiryState(d) === "expiring"
                            );
                            const rowCls = isExpired
                              ? "row-urgent"
                              : isExpiring
                              ? "row-warning"
                              : "";
                            const isSel = selected.includes(employee.id);

                            return (
                              <tr key={employee.id} className={`${rowCls} ${isSel ? "row-selected" : ""}`}>
                                <td style={{ textAlign: "center" }}>
                                  <input
                                    type="checkbox"
                                    checked={isSel}
                                    onChange={() =>
                                      setSelected((curr) =>
                                        curr.includes(employee.id)
                                          ? curr.filter((id) => id !== employee.id)
                                          : [...curr, employee.id]
                                      )
                                    }
                                  />
                                </td>
                                <td style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                                  {(currentPage - 1) * pageSize + idx + 1}
                                </td>
                                {columns.map((col) => (
                                  <td key={col}>
                                    <EmployeeCell employee={employee} column={col} />
                                  </td>
                                ))}
                                <td>
                                  <div className="row-actions-flex">
                                    <button
                                      type="button"
                                      className="icon-button"
                                      onClick={() => setDetailEmployee(employee)}
                                      title="Open Worker ID Pass & Profile"
                                    >
                                      <Eye size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      className="icon-button"
                                      onClick={() => setModal(employee)}
                                      title="Edit Worker"
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button
                                      type="button"
                                      className="icon-button"
                                      style={{ color: "#dc2626" }}
                                      onClick={() => remove([employee.id])}
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* VIEW MODE 2: VISUAL CARDS GRID */
                  <div className="employee-card-grid">
                    {rows.length === 0 ? (
                      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                        <Search size={32} style={{ color: "#94a3b8", margin: "0 auto 8px" }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>No workers matched the current filters.</p>
                      </div>
                    ) : (
                      rows.map((employee) => {
                        const isExpired = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
                          (d) => expiryState(d) === "expired"
                        );
                        const isExpiring = [employee.wpExpiry, employee.passportExpiry, employee.csocExpiry].some(
                          (d) => expiryState(d) === "expiring"
                        );

                        return (
                          <article
                            key={employee.id}
                            className={`worker-card ${
                              isExpired ? "urgent-border" : isExpiring ? "warning-border" : ""
                            }`}
                          >
                            <div className="worker-card-header">
                              <div className="worker-card-header-left">
                                <div className="worker-card-avatar">
                                  {employee.name
                                    .split(" ")
                                    .map((p) => p[0])
                                    .slice(0, 2)
                                    .join("")}
                                </div>
                                <div className="worker-card-title">
                                  <h3>{employee.name}</h3>
                                  <p>{employee.code} • {employee.designation}</p>
                                </div>
                              </div>
                              <span className={`status-pill ${employee.status.toLowerCase()}`}>
                                <span className="dot" />
                                {employee.status}
                              </span>
                            </div>

                            <div className="worker-card-chips">
                              <span className="pass-type-badge">{employee.passType}</span>
                              <span className="worker-card-chip">{employee.country}</span>
                              <span className="worker-card-chip">{employee.citizen}</span>
                            </div>

                            <div className="worker-card-credentials">
                              <div className="cred-mini-row">
                                <span>WP Expiry</span>
                                <em className={expiryState(employee.wpExpiry)}>
                                  {formatDate(employee.wpExpiry)} (
                                  {daysUntil(employee.wpExpiry) < 0
                                    ? "Expired"
                                    : `${daysUntil(employee.wpExpiry)}d`}
                                  )
                                </em>
                              </div>
                              <div className="cred-mini-row">
                                <span>Passport</span>
                                <em className={expiryState(employee.passportExpiry)}>
                                  {formatDate(employee.passportExpiry)}
                                </em>
                              </div>
                              <div className="cred-mini-row">
                                <span>CSOC / Safety</span>
                                <em className={expiryState(employee.csocExpiry)}>
                                  {formatDate(employee.csocExpiry)}
                                </em>
                              </div>
                            </div>

                            <div className="worker-card-actions">
                              <div className="worker-card-actions-left">
                                {employee.phone && (
                                  <a
                                    href={`tel:${employee.phone}`}
                                    className="icon-button"
                                    title={`Call ${employee.phone}`}
                                  >
                                    <Phone size={15} />
                                  </a>
                                )}
                                {employee.email && (
                                  <a
                                    href={`mailto:${employee.email}`}
                                    className="icon-button"
                                    title={`Email ${employee.email}`}
                                  >
                                    <Mail size={15} />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  className="icon-button"
                                  onClick={() => setModal(employee)}
                                  title="Edit"
                                >
                                  <Edit3 size={15} />
                                </button>
                              </div>

                              <button
                                type="button"
                                className="primary-button compact"
                                onClick={() => setDetailEmployee(employee)}
                              >
                                <IdCard size={14} />
                                <span>View Pass</span>
                              </button>
                            </div>
                          </article>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Pagination Controls */}
                <footer className="records-pagination-bar">
                  <span>
                    Showing {sorted.length ? (currentPage - 1) * pageSize + 1 : 0}-
                    {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} personnel
                  </span>
                  <div className="pagination-controls">
                    <button
                      type="button"
                      className="icon-button"
                      disabled={currentPage === 1}
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                      title="Previous"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="page-num-indicator">
                      Page {currentPage} of {maxPage}
                    </span>
                    <button
                      type="button"
                      className="icon-button"
                      disabled={currentPage === maxPage}
                      onClick={() => setPage(Math.min(maxPage, currentPage + 1))}
                      title="Next"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS & DRAWERS */}
      {modal && (
        <EmployeeModal
          initial={modal === "new" ? null : modal}
          type={tab}
          onClose={() => setModal(null)}
          onSave={saveEmployee}
        />
      )}

      {detailEmployee && (
        <EmployeeDrawer
          employee={detailEmployee}
          lang={lang}
          onClose={() => setDetailEmployee(null)}
          onEdit={() => {
            setModal(detailEmployee);
            setDetailEmployee(null);
          }}
          onAlert={(msg) => setNotice(msg)}
        />
      )}

      {importModalOpen && (
        <ImportModal
          lang={lang}
          onClose={() => setImportModalOpen(false)}
          onImportComplete={handleBatchImport}
        />
      )}

      {notice && (
        <div className="toast">
          <CheckCircle2 size={18} style={{ color: "#34d399" }} />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   TABLE CELL FORMATTER
   ========================================================================== */
function EmployeeCell({ employee, column }: { employee: Employee; column: ColumnKey }) {
  if (column === "name") {
    return (
      <div className="emp-name-cell">
        <div className="emp-avatar-circle">
          {employee.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="emp-name-text">
          <strong>{employee.name}</strong>
          <small>{employee.email || "No email"}</small>
        </div>
      </div>
    );
  }

  if (column === "wpExpiry" || column === "passportExpiry" || column === "csocExpiry") {
    const days = daysUntil(employee[column]);
    const state = expiryState(employee[column]);
    return (
      <div className="expiry-cell-block">
        <strong>{formatDate(employee[column])}</strong>
        <small className={state}>
          {days < 0 ? `Expired ${Math.abs(days)}d ago` : `${days}d remaining`}
        </small>
      </div>
    );
  }

  if (column === "status") {
    return (
      <span className={`status-pill ${employee.status.toLowerCase()}`}>
        <span className="dot" />
        {employee.status}
      </span>
    );
  }

  if (column === "passType") {
    return <span className="pass-type-badge">{employee.passType}</span>;
  }

  if (column === "dob") {
    return formatDate(employee.dob);
  }

  return employee[column] || "—";
}
