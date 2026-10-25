import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import HeroBanner from "./HeroBanner";
import "./shop.css";
import "./extra.css";

const VALUES = [
  { icon: "🚀", title: "Fast delivery", text: "About 30 minutes from the kitchen to your door, and you can watch every step." },
  { icon: "🥗", title: "Fresh food", text: "Dishes are made when you order. Nothing sits under a heat lamp." },
  { icon: "💸", title: "Honest prices", text: "GST and delivery are shown before you pay. Delivery is free above ₹199." },
  { icon: "📦", title: "Live tracking", text: "Pending, preparing, out for delivery, delivered. Always one tap away." },
  { icon: "🔒", title: "Secure accounts", text: "Email login, Google sign-in and token-based sessions keep your account safe." },
  { icon: "🧾", title: "Proper invoices", text: "Download a clear PDF invoice with GST for every order you place." },
];

const STEPS = [
  { title: "The idea", text: "A food delivery app that is simple to use and honest about prices." },
  { title: "Built with Django and React", text: "A REST API, PostgreSQL, Redis caching and a fast React front end." },
  { title: "Made safe", text: "JWT login with token rotation, customer and admin roles, and automated tests." },
  { title: "Live and growing", text: "Deployed on Vercel and Render, with uptime monitoring running all day." },
];

const STACK = ["React", "Django REST Framework", "PostgreSQL", "Redis", "JWT", "Cloudinary", "ReportLab", "Brevo"];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55, delay },
});

function About() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="hm ab">
        {/* ------------------------------------------------ intro */}
        <section className="ab-hero">
          <span className="hm-blob hm-blob-a" aria-hidden="true" />
          <span className="hm-blob hm-blob-b" aria-hidden="true" />

          <motion.div className="ab-hero-copy" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="hm-eyebrow">About Legend</p>
            <h1>Good food, <span>delivered with care</span></h1>
            <p className="ab-lead">We deliver meals people love: fast, fresh and fairly priced. Every order is tracked, every price is shown up front and every invoice is one tap away.</p>
            <div className="ab-cta">
              <Link className="sh-btn sh-btn-primary" to="/menu">Order now</Link>
              <Link className="sh-btn sh-btn-ghost" to="/contact">Contact us</Link>
            </div>
          </motion.div>

          <motion.div className="ab-art" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} aria-hidden="true">
            <span className="ab-tile ab-tile-a">🍛</span>
            <span className="ab-tile ab-tile-b">🍕</span>
            <span className="ab-tile ab-tile-c">🥗</span>
            <span className="ab-pill ab-pill-a">30 min delivery</span>
            <span className="ab-pill ab-pill-b">Free above ₹199</span>
          </motion.div>
        </section>

        {/* ---------------------------------------------- values */}
        <section className="hm-section">
          <motion.div className="hm-head" {...reveal()}><div><p className="hm-eyebrow">Why Legend</p><h2>What you can count on</h2></div></motion.div>
          <div className="ab-values">
            {VALUES.map((v, i) => (
              <motion.article key={v.title} className="ab-value" {...reveal(i * 0.06)}>
                <span aria-hidden="true">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------- timeline */}
        <section className="hm-section">
          <motion.div className="hm-head" {...reveal()}><div><p className="hm-eyebrow">Behind the app</p><h2>From idea to live</h2></div></motion.div>
          <ol className="ab-steps">
            {STEPS.map((s, i) => (
              <motion.li key={s.title} {...reveal(i * 0.08)}>
                <span>{i + 1}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------- builder */}
        <section className="hm-section">
          <motion.div className="ab-builder" {...reveal()}>
            <span className="ab-avatar" aria-hidden="true">AV</span>
            <div className="ab-builder-text">
              <p className="hm-eyebrow">Meet the builder</p>
              <h2>Antony Venis T</h2>
              <p>Python full stack developer from Chennai. Legend is a portfolio project, designed, built, tested and deployed end to end.</p>
              <ul className="ab-stack" aria-label="Tech stack">{STACK.map((s) => <li key={s}>{s}</li>)}</ul>
              <div className="ab-links">
                <a className="sh-btn sh-btn-primary" href="https://github.com/antonyvenis" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a className="sh-btn sh-btn-ghost" href="https://linkedin.com/in/antony-venis-t" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a className="sh-btn sh-btn-ghost" href="https://antony-venis-t-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">Portfolio</a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ---------------------------------------------- CTA */}
        <section className="hm-section">
          <motion.div className="hm-banner" {...reveal()}>
            <div><h2>Hungry? Dinner is a few taps away.</h2><p>Hot food, honest prices and a tracker that tells you when to open the door.</p></div>
            <Link className="sh-btn sh-btn-light" to="/menu">Browse the menu</Link>
          </motion.div>
        </section>

        {/* ------------------- project showcase banner, below About */}
        <HeroBanner />
      </div>
    </MotionConfig>
  );
}

export default About;
