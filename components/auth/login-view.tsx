"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LockKeyhole,
  Mail,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Language, translations } from "@/app/i18n";
import LoginScene from "./login-scene";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function checkPasskeySupport() {
      if (!("PublicKeyCredential" in window) || !navigator.credentials) return;
      const credentialApi = window.PublicKeyCredential as typeof PublicKeyCredential & {
        isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean>;
      };
      const supported = credentialApi.isUserVerifyingPlatformAuthenticatorAvailable
        ? await credentialApi.isUserVerifyingPlatformAuthenticatorAvailable()
        : true;
      if (mounted) setPasskeySupported(supported);
    }
    checkPasskeySupport().catch(() => undefined);
    return () => { mounted = false; };
  }, []);

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
                  <LockKeyhole size={17} />
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
                    aria-label={show ? "Hide password" : "Show password"}
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

              {passkeySupported && (
                <>
                  <div className="auth-divider">{t.orAuthWith}</div>
                  <button
                    type="button"
                    className="auth-passkey-btn"
                    onClick={simulatePasskey}
                    disabled={loading}
                  >
                    <KeyRound size={18} aria-hidden="true" />
                    <span>{t.biometricLogin}</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>

        <div className="login-shell">
          <footer className="login-compliance-footer">
            <div className="login-footer-copy">
              © 2026 T2C AI NEXUS. All rights reserved.
            </div>
          </footer>
        </div>
      </section>

      <LoginScene />
    </main>
  );
}

export default LoginView;
