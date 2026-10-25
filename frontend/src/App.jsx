import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ProtectedRoute from "./auth/ProtectedRoute";

/* 🔥 NEW IMPORT */
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import HeroBanner from "./pages/HeroBanner";
import Privacy from "./pages/Privacy";

// Home renders its own <Footer />
const NO_FOOTER = ["/", "/login", "/register", "/otp", "/forgot-password", "/herobanner"];

function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />

      {/* 🔔 GLOBAL TOAST */}
      <Toaster position="top-center" reverseOrder={false} />

      <main key={pathname} className="page">
      <Routes>
        {/* 🌍 Public */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/food" element={<Food />} />
        <Route path="/food2" element={<Food2 />} />
        <Route path="/herobanner" element={<HeroBanner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* 🔐 Needs a login (the API enforces this too) */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/liked" element={<ProtectedRoute><Liked /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profilechange" element={<ProtectedRoute><ProfileChange /></ProtectedRoute>} />

        {/* 🛠️ Admin role only */}
        <Route path="/upload" element={<ProtectedRoute admin><AdminUpload /></ProtectedRoute>} />
      </Routes>
      </main>

      {!NO_FOOTER.includes(pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;