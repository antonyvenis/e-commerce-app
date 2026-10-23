import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { saveSession } from "../api";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same rules the server enforces in register()
const RULES = [
  { id: "len", label: "At least 6 characters", test: (p) => p.length >= 6 },
  { id: "up", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "low", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "num", label: "One number", test: (p) => /[0-9]/.test(p) },
  { id: "sym", label: "One of ! @ # $ % ^ & *", test: (p) => /[!@#$%^&*]/.test(p) },
];

const firstError = (data) => {
  if (!data) return "";
  if (data.error) return data.error;
  const key = Object.keys(data)[0];
  const value = key && data[key];
  return Array.isArray(value) ? value[0] : "";
};

function Register() {
  const navigate = useNavigate();

  // The password is never written to storage. Only name/email/phone survive the OTP page.
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("otpVerified") === "true") {
      try {
        const saved = JSON.parse(localStorage.getItem("registerData"));
        if (saved) setForm((f) => ({ ...f, ...saved, password: "" }));
        setVerified(true);
      } catch {
        localStorage.removeItem("otpVerified");
      }
    }
  }, []);

  const ruleState = useMemo(() => RULES.map((r) => ({ ...r, ok: r.test(form.password) })), [form.password]);
  const passwordOk = ruleState.every((r) => r.ok);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const sendOtp = async () => {
    setError("");
    if (!form.username.trim()) return setError("Enter your name first.");
    if (!EMAIL_RE.test(form.email.trim())) return setError("Enter a valid email address.");

    try {
      setSending(true);
      await api.post("/send-otp/", {
        email: form.email.trim(),
        username: form.username.trim(),
        phone: form.phone.trim() || undefined,
      });
      localStorage.removeItem("otpVerified");
      localStorage.setItem(
        "registerData",
        JSON.stringify({ username: form.username.trim(), email: form.email.trim(), phone: form.phone.trim() })
      );
      toast.success("Code sent. Check your inbox and spam folder.");
      navigate("/otp");
    } catch (err) {
      setError(firstError(err.response?.data) || "Could not send the code. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!verified) return setError("Verify your email with the code first.");
    if (!passwordOk) return setError("Your password does not meet all the rules yet.");

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      password: form.password,
    };

    try {
      setLoading(true);
      await api.post("/register/", payload);
      localStorage.removeItem("registerData");
      localStorage.removeItem("otpVerified");

      // Log the new customer in straight away
      try {
        const { data } = await api.post("/login/", { email: payload.email, password: payload.password });
        saveSession(data, true);
        toast.success("Account created. Welcome to Legend!");
        navigate("/", { replace: true });
      } catch {
        toast.success("Account created. Log in to continue.");
        navigate("/login");
      }
    } catch (err) {
      setError(firstError(err.response?.data) || "Could not create the account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    try {
      const { data } = await api.post("/google-login/", { credential });
      saveSession(data, true);
      toast.success(`Welcome, ${data.username}`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-in failed. Try again.");
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Verify your email once, then order from your favourite kitchens."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="au-field">
          <label htmlFor="reg-name">Name</label>
          <input id="reg-name" autoComplete="username" placeholder="How we should call you" value={form.username} onChange={set("username")} disabled={verified} />
        </div>

        <div className="au-field">
          <label htmlFor="reg-email">Email</label>
          <div className="au-inline">
            <input id="reg-email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" value={form.email} onChange={set("email")} disabled={verified} />
            <button type="button" className={`au-btn au-btn-ghost ${verified ? "is-verified" : ""}`} onClick={sendOtp} disabled={sending || verified}>
              {verified ? "Verified" : sending ? "Sending…" : "Send code"}
            </button>
          </div>
        </div>

        <div className="au-field">
          <label htmlFor="reg-phone">Phone (optional)</label>
          <input id="reg-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="For delivery updates" value={form.phone} onChange={set("phone")} />
        </div>

        <div className="au-field">
          <label htmlFor="reg-password">Password</label>
          <div className="au-input-wrap">
            <input id="reg-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={set("password")} />
            <button type="button" className="au-eye" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <ul className="au-rules" aria-label="Password rules">
            {ruleState.map((r) => (
              <li key={r.id} className={r.ok ? "ok" : ""}>{r.label}</li>
            ))}
          </ul>
        </div>

        <p className="au-error" role="alert" aria-live="polite">{error}</p>

        <button className="au-btn au-btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="au-spin" aria-label="Creating account" /> : "Create account"}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <div className="au-divider"><span>or sign up with</span></div>
      )}
      <GoogleButton onCredential={handleGoogle} text="signup_with" />
    </AuthShell>
  );
}

export default Register;
