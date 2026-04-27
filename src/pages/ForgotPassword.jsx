import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";  // 🔥 NEW

function ForgotPassword() {

  const navigate = useNavigate();  // 🔥 NEW

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);

  /* =========================
     📧 SEND OTP
  ========================= */
  const sendOtp = async () => {

    if (!email || !username) {
      toast.error("Enter username & email ❌");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/forgot-password-otp/", { 
        email,
        username
      });

      toast.success("OTP sent 📧");

    } catch (err) {
      toast.error(err.response?.data?.error || "OTP failed ❌");
    }
  };

  /* =========================
     🔐 VERIFY OTP
  ========================= */
  const verifyOtp = async () => {

    if (!otp) {
      toast.error("Enter OTP ❌");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/verify-otp/", { email, otp });

      toast.success("OTP verified ✅");
      setVerified(true);   // 🔥 BUTTON CHANGE

    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP ❌");
    }
  };

  /* =========================
     🔑 RESET PASSWORD
  ========================= */
  const resetPassword = async () => {

    if (!verified) {
      toast.error("Verify OTP first ❌");
      return;
    }

    if (!password) {
      toast.error("Enter new password ❌");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/reset-password/", {
        email,
        password
      });

      toast.success("Password updated successfully 🎉");

      // 🔥 NAVIGATE LOGIN
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.error || "Reset failed ❌");
    }
  };

  return (
  <div className="forgot-container">
    <div className="forgot-box">

      <h2>Forgot Password 🔑</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendOtp}>
        Send OTP 📧
      </button>

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp} disabled={verified}>
        {verified ? "Verified ✅" : "Verify OTP 🔐"}
      </button>

      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={resetPassword}>
        Reset Password 🔑
      </button>

    </div>
  </div>
);
}

export default ForgotPassword;