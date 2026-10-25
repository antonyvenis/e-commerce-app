import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import toast from "react-hot-toast";
import "./shop.css";
import "./extra.css";

const EMAIL = "antonyvenis1212@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 500;

const CHANNELS = [
  { icon: "✉️", label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: "💻", label: "GitHub", value: "github.com/antonyvenis", href: "https://github.com/antonyvenis" },
  { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/antony-venis-t", href: "https://linkedin.com/in/antony-venis-t" },
  { icon: "📍", label: "Based in", value: "Chennai, India" },
];

const FAQS = [
  { q: "How long does delivery take?", a: "Most orders arrive in about 30 minutes. You can follow every step on the Orders page." },
  { q: "When is delivery free?", a: "Delivery is free when your food total is above ₹199. Otherwise it is a flat ₹40." },
  { q: "Can I get an invoice?", a: "Yes. Open Orders and tap Download invoice to get a PDF with GST for any order." },
  { q: "Is online payment real?", a: "Legend is a portfolio project. UPI and card are a demo and nothing is charged." },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(0);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value.slice(0, key === "message" ? MAX : 120) });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast.success("Email address copied");
    } catch {
      toast.error("Could not copy. Select and copy it manually.");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Write at least a short sentence (10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `Message from ${form.name.trim()} via Legend`;
    const body = `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="hm ct">
        <header className="ct-hero">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="hm-eyebrow">Contact</p>
            <h1>Let&apos;s <span>talk</span></h1>
            <p className="ct-sub">Questions about the app, the code or working together? Send a message and it opens in your email app.</p>
          </motion.div>
        </header>

        <div className="ct-grid">
          <motion.aside className="ct-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.05 }}>
            {CHANNELS.map((c) => {
              const inner = (
                <>
                  <span className="ct-icon" aria-hidden="true">{c.icon}</span>
                  <div><small>{c.label}</small><b>{c.value}</b></div>
                </>
              );
              return c.href ? (
                <a key={c.label} className="ct-card" href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={c.label} className="ct-card">{inner}</div>
              );
            })}
            <button className="sh-btn sh-btn-ghost" onClick={copy}>Copy email address</button>
          </motion.aside>

          <motion.div className="ct-formbox" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" className="ct-sent" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <svg className="co-check" viewBox="0 0 120 120" width="96" height="96" aria-hidden="true">
                    <circle className="co-check-ring" cx="60" cy="60" r="52" />
                    <path className="co-check-tick" d="M36 62l16 16 32-34" />
                  </svg>
                  <h2>Your email app is opening</h2>
                  <p>Press send there to finish. If nothing opened, write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
                  <button className="sh-btn sh-btn-ghost" onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}>Write another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" className="ct-form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2>Send a message</h2>

                  <div className={`co-field ${errors.name ? "has-error" : ""}`}>
                    <label htmlFor="ct-name">Your name</label>
                    <input id="ct-name" value={form.name} onChange={set("name")} autoComplete="name" aria-invalid={Boolean(errors.name)} />
                    {errors.name && <small role="alert">{errors.name}</small>}
                  </div>

                  <div className={`co-field ${errors.email ? "has-error" : ""}`}>
                    <label htmlFor="ct-email">Your email</label>
                    <input id="ct-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={Boolean(errors.email)} />
                    {errors.email && <small role="alert">{errors.email}</small>}
                  </div>

                  <div className={`co-field ${errors.message ? "has-error" : ""}`}>
                    <label htmlFor="ct-message">Message</label>
                    <textarea id="ct-message" rows={5} value={form.message} onChange={set("message")} aria-invalid={Boolean(errors.message)} />
                    <span className="ct-count">{form.message.length}/{MAX}</span>
                    {errors.message && <small role="alert">{errors.message}</small>}
                  </div>

                  <button className="sh-btn sh-btn-primary sh-block" type="submit">Send message</button>
                  <p className="ct-note">This opens your email app with the message ready to send.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <section className="hm-section ct-faq">
          <div className="hm-head"><div><p className="hm-eyebrow">FAQ</p><h2>Quick answers</h2></div></div>
          <div className="ct-faqs">
            {FAQS.map((f, i) => (
              <motion.div key={f.q} className={`ct-faq-item ${open === i ? "is-open" : ""}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} transition={{ duration: 0.28 }} style={{ overflow: "hidden" }}>
                  <p>{f.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}

export default Contact;
