// import axios from "axios";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {

//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [verified, setVerified] = useState(false);

//   // 🔥 TIMER STATE
//   const [timer, setTimer] = useState(0);

//   /* =========================
//      ⏱ TIMER EFFECT
//   ========================= */
//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [timer]);

//   /* =========================
//      📧 SEND OTP
//   ========================= */
//   const sendOtp = async () => {

//     if (!email || !username) {
//       toast.error("Enter username & email ❌");
//       return;
//     }

//     try {
//       await axios.post(
//         "https://e-commerce-app-8jg4.onrender.com/api/forgot-password-otp/",
//         { email, username }
//       );

//       toast.success("OTP sent 📧");

//       // 🔥 START 60 SEC TIMER
//       setTimer(60);

//     } catch (err) {
//       toast.error(err.response?.data?.error || "OTP failed ❌");
//     }
//   };

//   /* =========================
//      🔐 VERIFY OTP
//   ========================= */
//   const verifyOtp = async () => {

//     if (!otp) {
//       toast.error("Enter OTP ❌");
//       return;
//     }

//     try {
//       await axios.post(
//         "https://e-commerce-app-8jg4.onrender.com/api/verify-otp/",
//         { email, otp }
//       );

//       toast.success("OTP verified ✅");
//       setVerified(true);

//     } catch (err) {
//       toast.error(err.response?.data?.error || "Invalid OTP ❌");
//     }
//   };

//   /* =========================
//      🔑 RESET PASSWORD
//   ========================= */
//   const resetPassword = async () => {

//     if (!verified) {
//       toast.error("Verify OTP first ❌");
//       return;
//     }

//     if (!password) {
//       toast.error("Enter new password ❌");
//       return;
//     }

//     try {
//       await axios.post(
//         "https://e-commerce-app-8jg4.onrender.com/api/reset-password/",
//         { email, password }
//       );

//       toast.success("Password updated successfully 🎉");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);

//     } catch (err) {
//       toast.error(err.response?.data?.error || "Reset failed ❌");
//     }
//   };

//   return (
//     <div className="forgot-container">
//       <div className="forgot-box">

//         <h2>Forgot Password 🔑</h2>

//         <input
//           placeholder="Username"
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* 🔥 SEND OTP BUTTON WITH TIMER */}
//         <button onClick={sendOtp} disabled={timer > 0}>
//           {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP 📧"}
//         </button>

//         <input
//           placeholder="Enter OTP"
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <button onClick={verifyOtp} disabled={verified}>
//           {verified ? "Verified ✅" : "Verify OTP 🔐"}
//         </button>

//         <input
//           type="password"
//           placeholder="New Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button onClick={resetPassword}>
//           Reset Password 🔑
//         </button>

//       {otpSent && (
//   <div style={{
//     background: "#e7f3ff",
//     color: "#0c5460",
//     padding: "10px",
//     borderRadius: "6px",
//     marginTop: "10px",
//     fontSize: "13px"
//   }}>
//     📧 OTP sent! Check Inbox / Spam folder and refresh your email.
//     📧 Didn’t receive OTP? Wait 30 seconds and try again.
//     {timer > 0 ? ` Resend OTP in ${timer}s` : " Didn't receive? Try again."}
//   </div>
// )}

//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);

  // 🔥 ADD THIS (missing state)
  const [otpSent, setOtpSent] = useState(false);

  // 🔥 TIMER STATE
  const [timer, setTimer] = useState(0);

  /* =========================
     ⏱ TIMER EFFECT
  ========================= */
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  /* =========================
     📧 SEND OTP
  ========================= */
  const sendOtp = async () => {

    if (!email || !username) {
      toast.error("Enter username & email ❌");
      return;
    }

    // 🔥 prevent spam click
    if (timer > 0) {
      toast.error("Wait before resending OTP ⏳");
      return;
    }

    try {
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/forgot-password-otp/",
        { email, username }
      );

      toast.success("OTP sent 📧");

      setTimer(60);
      setOtpSent(true);   // 🔥 FIX

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
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/verify-otp/",
        { email, otp, type: "forgot_password" }

      );

      toast.success("OTP verified ✅");
      setVerified(true);

      setOtpSent(false); // 🔥 optional UX

    } catch (err) {
      console.log(err.response?.data);  // 🔥 ADD THIS
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
      await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/reset-password/",
        { email, password }
      );

      toast.success("Password updated successfully 🎉");

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

        <button onClick={sendOtp} disabled={timer > 0}>
          {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP 📧"}
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

        {/* 🔥 FIXED MESSAGE BOX */}
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
              ? ` Resend OTP in ${timer}s`
              : " Didn't receive? Try again."}
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;