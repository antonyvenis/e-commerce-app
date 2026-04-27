import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Cart from "./pages/Cart";
import Navbar from "./pages/Navbar";
import "./App.css";
import Menu from "./pages/Menu";
import Home from "./pages/Home";
import Liked from "./pages/Liked";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Orders from "./pages/Orders";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProfileChange from "./pages/Profilechance";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Food from "./pages/Food";
import Food2 from "./pages/Food2";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";
import AdminUpload from "./pages/AdminUpload";

/* 🔥 NEW IMPORT */
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* 🔔 GLOBAL TOAST */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />

        {/* 🔥 ADD THIS ROUTE */}
        <Route path="/product/:id" element={<Menu />} />

        {/* 🔐 Protected Route Example */}
        <Route
          path="/orders"
          element={true ? <Orders /> : <Navigate to="/login" />}
        />

        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profilechange" element={<ProfileChange />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/food" element={<Food />} />
        <Route path="/food2" element={<Food2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/upload" element={<AdminUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;