import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api, { getUser } from "../api";
import "./shop.css";
import "./store.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// shrink the photo in the browser: a 256px JPEG is about 15 KB instead of several MB
const shrink = (file, max = 256) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.min(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const size = Math.min(w, h);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        // centre-crop to a square
        canvas.getContext("2d").drawImage(img, (w - size) / -2, (h - size) / -2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

function ProfileChange() {
  const navigate = useNavigate();
  const stored = getUser();
  const fileRef = useRef();

  const [form, setForm] = useState({ email: stored?.email || "", phone: "", image: stored?.image || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // load the real values once (phone is not kept in localStorage)
  useEffect(() => {
    let alive = true;
    api.get("/profile/")
      .then(({ data }) => alive && setForm({ email: data.email || "", phone: data.phone || "", image: data.image || "" }))
      .catch(() => toast.error("Could not load your details"));
    return () => { alive = false; };
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Choose an image file");
    try {
      setForm((f) => ({ ...f, image: "" }));
      const image = await shrink(file);
      setForm((f) => ({ ...f, image }));
    } catch {
      toast.error("That image could not be read");
    }
  };

  const save = async (e) => {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.phone.trim() && !/^[6-9]\d{9}$/.test(form.phone.trim())) next.phone = "Enter a 10-digit mobile number or leave it empty.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setSaving(true);
      await api.post("/update-profile/", { email: form.email.trim(), phone: form.phone.trim(), image: form.image });
      localStorage.setItem("user", JSON.stringify({ ...stored, email: form.email.trim(), image: form.image && form.image.length < 500 ? form.image : null }));
      window.dispatchEvent(new Event("auth:changed"));
      toast.success("Profile updated");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sh-page sh-narrow">
      <header className="sh-pagehead">
        <h1>Edit profile</h1>
        <p>Keep your details up to date so deliveries and invoices are right.</p>
      </header>

      <motion.form className="ac-form" onSubmit={save} noValidate initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}>
        <div className="ac-photo">
          {form.image ? (
            <img className="ac-avatar" src={form.image} alt="Your photo" />
          ) : (
            <span className="ac-avatar ac-avatar-fallback" aria-hidden="true">{(stored?.username || "?").charAt(0).toUpperCase()}</span>
          )}
          <div>
            <button type="button" className="sh-btn sh-btn-ghost" onClick={() => fileRef.current.click()}>Change photo</button>
            {form.image && <button type="button" className="ac-remove" onClick={() => setForm({ ...form, image: "" })}>Remove</button>}
            <small>JPG or PNG. It is shrunk to a small square automatically.</small>
            <input ref={fileRef} type="file" accept="image/*" onChange={pick} hidden />
          </div>
        </div>

        <div className="co-field">
          <label htmlFor="ac-username">Name</label>
          <input id="ac-username" value={stored?.username || ""} readOnly aria-readonly="true" />
          <small className="ac-hint">Your name is used to log you in and cannot be changed here.</small>
        </div>

        <div className={`co-field ${errors.email ? "has-error" : ""}`}>
          <label htmlFor="ac-email">Email</label>
          <input id="ac-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={Boolean(errors.email)} />
          {errors.email && <small role="alert">{errors.email}</small>}
        </div>

        <div className={`co-field ${errors.phone ? "has-error" : ""}`}>
          <label htmlFor="ac-phone">Mobile number</label>
          <input id="ac-phone" value={form.phone} onChange={set("phone")} inputMode="numeric" maxLength={10} autoComplete="tel" placeholder="Optional" aria-invalid={Boolean(errors.phone)} />
          {errors.phone && <small role="alert">{errors.phone}</small>}
        </div>

        <div className="ac-form-actions">
          <Link className="sh-btn sh-btn-ghost" to="/profile">Cancel</Link>
          <button className="sh-btn sh-btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </motion.form>
    </div>
  );
}

export default ProfileChange;
