import axios from "axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  /* =========================
     ⏱️ TIMER
  ========================= */
  useEffect(() => {
    if (otpSent && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer, otpSent]);

  /* =========================
     🔁 RETURN FROM OTP PAGE
  ========================= */
  useEffect(() => {
    if (localStorage.getItem("otpVerified") === "true") {
      setVerified(true);

      const saved = JSON.parse(localStorage.getItem("registerData"));
      if (saved) setData(saved);
    }
  }, []);

  /* =========================
     📧 SEND OTP → NAVIGATE
  ========================= */
  const sendOtp = async () => {

    if (!data.username || !data.email || !data.phone || !data.password) {
      toast.error("Fill all details first ⚠️");
      return;
    }

    try {
      setLoading(true);

      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/send-otp/", {
        email: data.email,
        username: data.username,
        phone: data.phone,
      });

      toast.success("OTP sent 📧");

      localStorage.setItem("registerData", JSON.stringify(data));

      navigate("/otp", {
        state: {
          email: data.email,
          data: data
        }
      });

    } catch (err) {

      console.log("FULL ERROR 👉", err);
      console.log("BACKEND 👉", err.response?.data);

      const error = err.response?.data;

      // 🔥 STRING ERROR (views.py → {"error": "msg"})
      if (error?.error) {
        toast.error(error.error);
      }

      // 🔥 FIELD ERRORS (serializer)
      else if (error?.username) {
        toast.error(error.username[0]);
      }
      else if (error?.email) {
        toast.error(error.email[0]);
      }
      else if (error?.phone) {
        toast.error(error.phone[0]);
      }

      // 🔥 FALLBACK
      else {
        toast.error("OTP failed ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     📝 REGISTER
  ========================= */
  const handleSubmit = async () => {

    if (!verified) {
      toast.error("Verify OTP first ❌");
      return;
    }

    if (!data.username || !data.email || !data.phone || !data.password) {
      toast.error("Fill all fields ⚠️");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/register/",
        data
      );

      if (res.status === 200) {
        toast.success("Registered Successfully 🎉");

        localStorage.removeItem("registerData");
        localStorage.removeItem("otpVerified");

        navigate("/login");
      }

    } catch (err) {

      console.log("FULL ERROR 👉", err.response?.data);

      const error = err.response?.data;

      if (error?.error) {
        toast.error(error.error);
      }
      else if (error?.username) {
        toast.error(error.username[0]);
      }
      else if (error?.email) {
        toast.error(error.email[0]);
      }
      else if (error?.phone) {
        toast.error(error.phone[0]);
      }
      else if (error?.password) {
        toast.error(error.password[0]);
      }
      else {
        toast.error("Register failed ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="register-container">
    <div className="register-box">

      <h2>Register 🚀</h2>

      <input
        placeholder="Username"
        value={data.username}
        onChange={(e) => setData({ ...data, username: e.target.value })}
      />

      <input
        placeholder="Email"
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <button onClick={sendOtp} disabled={loading || verified}>
        {verified ? "Verified ✅" : (loading ? "Sending..." : "Send OTP 📧")}
      </button>

      <input
        placeholder="Phone"
        value={data.phone}
        onChange={(e) => setData({ ...data, phone: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Register 🚀"}
      </button>

    </div>
  </div>
);
}

export default Register;