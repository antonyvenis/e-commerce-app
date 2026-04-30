import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "./Footer";
// import contactImg from "../assets/hero.png";
import toast from "react-hot-toast";

function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // 🧠 Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🚀 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // ❌ Validation
    if (!form.name || !form.email || !form.message) {
      toast.error("Fill all fields ❌");
      return;
    }

    // 📧 Mailto link create
    const subject = `Contact from ${form.name}`;
    const body = `
Name: ${form.name}
Email: ${form.email}

Message:
${form.message}
    `;

    // 🔥 Open email app
    window.location.href = `mailto:antonyvenis1212@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // ✅ Success popup
    toast.success("Please Wait Opening mail app 📧");

    // 🧹 Reset
    setForm({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className="contact premium-bg">

      <motion.img
        src="/src/assets/images/contact.png"
        className="contact-img"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      />

      <motion.h1>📞 Get in Touch</motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="contact-form glass"
      >

        <div className="input-group">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <label>Your Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <label>Email</label>
        </div>

        <div className="input-group">
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
          />
          <label>Message</label>

          
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          className="send-btn"
        >
          Send 🚀
        </motion.button>
        
        </div>

      </motion.form>

    </div>
  );
}

export default Contact;