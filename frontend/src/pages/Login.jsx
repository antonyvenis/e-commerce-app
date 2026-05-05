import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!data.username || !data.password) {
      toast.error("Enter username & password ⚠️");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://e-commerce-app-8jg4.onrender.com/api/login/",
        data
      );

      const username = res.data.username;

      localStorage.setItem("user", JSON.stringify({ username }));

      // ❤️ Likes
      const likesRes = await axios.get(
        "https://e-commerce-app-8jg4.onrender.com/api/likes/",
        { params: { username } }
      );
      localStorage.setItem("likes", JSON.stringify(likesRes.data));

      // 🛒 Cart
      const cartRes = await axios.get(
        "https://e-commerce-app-8jg4.onrender.com/api/cart/",
        { params: { username } }
      );
      localStorage.setItem("cart", JSON.stringify(cartRes.data));

      // 📦 Orders
      const ordersRes = await axios.get(
        "https://e-commerce-app-8jg4.onrender.com/api/orders/",
        { params: { username } }
      );
      localStorage.setItem("orders", JSON.stringify(ordersRes.data));

      toast.success("Login Success 🔥");

      navigate("/profile");

    } catch (err) {

      const error = err.response?.data;

      if (error?.error) {
        toast.error(error.error);
      } else {
        toast.error("Login failed ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login Page</h2>

      <input
        placeholder="Username"
        value={data.username}
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={handleLogin}>
        {loading ? "Logging..." : "Login"}
      </button>

      <h4>or</h4>

      <button className="secondary-btn" onClick={() => navigate("/forgot-password")}>
        Forgot Password? 🔐
      </button>

      <button className="secondary-btn" onClick={() => navigate("/register")}>
        Don't have an account? Register
      </button>
    </div>
    </div>
  );
}

export default Login;