"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Globe,
  Mail,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Language, translations } from "@/app/i18n";
import LoginScene from "./login-scene";

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LoginView({
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

  function selectDemoAccount(acc: (typeof demoAccounts)[0]) {
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

export default LoginView;
