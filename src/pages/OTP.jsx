// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function OTP() {
//   const navigate = useNavigate();

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(60);

//   const inputs = useRef([]);

//   const data = JSON.parse(localStorage.getItem("registerData"));
//   const email = data?.email;

//   /* =========================
//      ⏱️ TIMER
//   ========================= */
//   useEffect(() => {
//     if (timer > 0) {
//       const t = setTimeout(() => setTimer(timer - 1), 1000);
//       return () => clearTimeout(t);
//     }
//   }, [timer]);

//   /* =========================
//      🔢 INPUT
//   ========================= */
//   const handleChange = (value, index) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   /* =========================
//      🔐 VERIFY
//   ========================= */
//   // const verifyOtp = async () => {
//   //   const finalOtp = otp.join("");

//   //   try {
//   //     await axios.post("http://127.0.0.1:8000/api/verify-otp/", {
//   //       email,
//   //       otp: finalOtp
//   //     });

//   //     toast.success("OTP Verified ✅");

//   //     // 🔥 SAVE VERIFY FLAG
//   //     localStorage.setItem("otpVerified", "true");

//   //     navigate("/register");

//   //   } catch (err) {
//   //     toast.error("Invalid OTP ❌");
//   //   }
//   // };

//   const verifyOtp = async () => {
//   const finalOtp = otp.join("");

//   // 🔴 EMPTY CHECK
//   if (finalOtp.length !== 6) {
//     toast.error("Enter full OTP ❌");
//     return;
//   }

//   try {
//     const res = await axios.post(
//       "https://e-commerce-app-8jg4.onrender.com/api/verify-otp/",
//       {
//         email,
//         otp: finalOtp
//       }
//     );

//     // 🟢 ONLY IF SUCCESS
//     if (res.data.message) {
//       toast.success("OTP Verified ✅");

//       localStorage.setItem("otpVerified", "true");

//       navigate("/register");
//     }

//   } catch (err) {
//     console.log(err.response?.data);

//     // 🔴 WRONG OTP
//     toast.error("Invalid OTP ❌");
//   }
// };

//   /* =========================
//      🔁 RESEND
//   ========================= */
//   const resendOtp = async () => {
//     if (timer > 0) return;

//     await axios.post("https://e-commerce-app-8jg4.onrender.com/api/send-otp/", {
//       email
//     });

//     toast.success("OTP Resent 📧");
//     setTimer(60);
//   };

//  return (
//   <div className="otp-container">
//     <div className="otp-box">

//       <h2>Enter OTP 🔐</h2>

//       <div className="otp-inputs">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputs.current[index] = el)}
//             value={digit}
//             onChange={(e) => handleChange(e.target.value, index)}
//             maxLength="1"
//           />
//         ))}
//       </div>

//       <button onClick={verifyOtp}>
//         Verify OTP ✅
//       </button>

//       <button disabled={timer > 0} onClick={resendOtp}>
//         {timer > 0 ? `Resend in ${timer}s ⏱️` : "Resend OTP 🔁"}
//       </button>

//     </div>
//   </div>
// );
// }

// export default OTP;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function OTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);

  // 🔥 ADD THIS
  const [otpSent, setOtpSent] = useState(true);

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
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter full OTP ❌");
      return;
    }

    try {
      const res = await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/verify-otp/",
        {
          email,
          otp: finalOtp,
          type: "register" // 🔥 IMPORTANT
        }
      );

      if (res.data.message) {
        toast.success("OTP Verified ✅");

        localStorage.setItem("otpVerified", "true");

        // 🔥 HIDE MESSAGE AFTER VERIFY
        setOtpSent(false);

        navigate("/register");
      }

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Invalid OTP ❌");
    }
  };

  /* =========================
     🔁 RESEND
  ========================= */
  const resendOtp = async () => {
    if (timer > 0) {
      toast.error("Wait before resend ⏳");
      return;
    }

    try {
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/send-otp/",
        { email }
      );

      toast.success("OTP Resent 📧");

      setTimer(60);
      setOtpSent(true); // 🔥 SHOW MESSAGE AGAIN

    } catch (err) {
      toast.error("Resend failed ❌");
    }
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

        {/* 🔥 OTP INFO MESSAGE */}
        {otpSent && (
          <div style={{
            background: "#e7f3ff",
            color: "#0c5460",
            padding: "10px",
            borderRadius: "6px",
            marginTop: "10px",
            fontSize: "13px"
          }}>
            📧 OTP sent! Check Inbox / Spam folder.
            📧 Didn’t receive OTP? Wait 60 seconds.
            {timer > 0
              ? ` Resend in ${timer}s`
              : " Didn't receive? Try again."}
          </div>
        )}

      </div>
    </div>
  );
}

export default OTP;