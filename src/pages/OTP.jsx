import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  const data = JSON.parse(localStorage.getItem("registerData"));
  const email = data?.email;

  /* =========================
     ⏱️ TIMER
  ========================= */
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  /* =========================
     🔢 INPUT
  ========================= */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  /* =========================
     🔐 VERIFY
  ========================= */
  // const verifyOtp = async () => {
  //   const finalOtp = otp.join("");

  //   try {
  //     await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
  //       email,
  //       otp: finalOtp
  //     });

  //     toast.success("OTP Verified ✅");

  //     // 🔥 SAVE VERIFY FLAG
  //     localStorage.setItem("otpVerified", "true");

  //     navigate("/register");

  //   } catch (err) {
  //     toast.error("Invalid OTP ❌");
  //   }
  // };

  const verifyOtp = async () => {
  const finalOtp = otp.join("");

  // 🔴 EMPTY CHECK
  if (finalOtp.length !== 6) {
    toast.error("Enter full OTP ❌");
    return;
  }

  try {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/verify-otp/",
      {
        email,
        otp: finalOtp
      }
    );

    // 🟢 ONLY IF SUCCESS
    if (res.data.message) {
      toast.success("OTP Verified ✅");

      localStorage.setItem("otpVerified", "true");

      navigate("/register");
    }

  } catch (err) {
    console.log(err.response?.data);

    // 🔴 WRONG OTP
    toast.error("Invalid OTP ❌");
  }
};

  /* =========================
     🔁 RESEND
  ========================= */
  const resendOtp = async () => {
    if (timer > 0) return;

    await axios.post("http://127.0.0.1:8000/api/send-otp/", {
      email
    });

    toast.success("OTP Resent 📧");
    setTimer(60);
  };

 return (
  <div className="otp-container">
    <div className="otp-box">

      <h2>Enter OTP 🔐</h2>

      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            maxLength="1"
          />
        ))}
      </div>

      <button onClick={verifyOtp}>
        Verify OTP ✅
      </button>

      <button disabled={timer > 0} onClick={resendOtp}>
        {timer > 0 ? `Resend in ${timer}s ⏱️` : "Resend OTP 🔁"}
      </button>

    </div>
  </div>
);
}

export default OTP;