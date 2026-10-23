import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { isAuthenticated, saveSession } from "../api";
import AuthShell from "../components/AuthShell";
import GoogleButton from "../components/GoogleButton";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EyeIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("expired")) {
      toast("Your session ended. Log in again to continue.", { icon: "🔒" });
    } else if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  // After login: warm the caches the other pages read from
  const preload = async () => {
    const [likes, cart, orders] = await Promise.allSettled([
      api.get("/likes/"),
      api.get("/cart/"),
      api.get("/orders/"),
    ]);
    if (likes.status === "fulfilled") localStorage.setItem("likes", JSON.stringify(likes.value.data));
    if (cart.status === "fulfilled") localStorage.setItem("cart", JSON.stringify(cart.value.data));
    if (orders.status === "fulfilled") localStorage.setItem("orders", JSON.stringify(orders.value.data));
  };

  const finish = async (data, successMessage) => {
    saveSession(data, remember);
    await preload();
    toast.success(successMessage);
    const target = location.state?.from || (data.role === "admin" ? "/upload" : "/");
    navigate(target, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_RE.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!form.password) {
      setError("Enter your password.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/login/", {
        email: form.email.trim(),
        password: form.password,
      });
      await finish(data, `Welcome back, ${data.username}`);
    } catch (err) {
      setError(
        err.response?.status === 429
          ? "Too many attempts. Wait a minute and try again."
          : err.response?.data?.error || "Could not log in. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    try {
      const { data } = await api.post("/google-login/", { credential });
      await finish(data, `Welcome, ${data.username}`);
    } catch (err) {
      setError(err.response?.data?.error || "Google sign-in failed. Try again.");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in with your email and password to order and track your food."
      footer={
        <>
          New to Legend? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="au-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={form.email}
            aria-invalid={Boolean(error) && !EMAIL_RE.test(form.email.trim())}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="au-field">
          <label htmlFor="login-password">Password</label>
          <div className="au-input-wrap">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="au-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              <EyeIcon off={!showPassword} />
            </button>
          </div>
        </div>

        <div className="au-row">
          <label className="au-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me logged in
          </label>
          <Link className="au-link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <p className="au-error" role="alert" aria-live="polite">{error}</p>

        <button className="au-btn au-btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="au-spin" aria-label="Logging in" /> : "Log in"}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <div className="au-divider"><span>or continue with</span></div>
      )}
      <GoogleButton onCredential={handleGoogle} />
    </AuthShell>
  );
}

export default Login;
