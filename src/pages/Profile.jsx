// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import axios from "axios";

// function Profile() {
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const orders = JSON.parse(localStorage.getItem("orders")) || [];
//   const likes = JSON.parse(localStorage.getItem("likes")) || [];

//   // 📦 User orders filter
//   const myOrders = orders.filter(order => order.user?.id === user?.id);

//   // 🚪 Logout
//   const logout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//     return alert("Logout exits ⬅️");
//   };

//   if (!user) {
//     return (
//       <div id="items-center">
//     <h2 >Please login ⬇️</h2>
//     <div><button><Link to="/login" id="Link-text">login ➡️</Link></button></div>
//     </div>
//   );
//   }

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const loggedUser = JSON.parse(localStorage.getItem("user"));

//     axios.get("http://127.0.0.1:8000/api/profile/", {
//       params: { username: loggedUser.username }
//     })
//     .then(res => setUser(res.data));
//   }, []);

//   if (!user) return <h2>Loading...</h2>;

//   return (
//     <div className="profile">
      
//        <AnimatePresence>
//       <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, x: 100 }}
//                 transition={{ duration: 0.4 }}
//        >

//       <h2>👤 Profile</h2>

//       {/* 👤 User Info */}
//       <div className="profile-card">

//         {/* 🖼️ Profile Image */}
//         <img
//           src={user?.image || "https://via.placeholder.com/100"}
//           alt="profile"
//           width="80"
//           style={{ borderRadius: "50%", marginBottom: "10px" }}
//         />  <Link to="/profilechange" id="Link-Text">✏️ Edit</Link> 

//         <h3>{user.name}</h3>
//         <p>User ID: {user.id}</p>
//       </div>

//        {/* ✏️ Edit Profile */}
//       {/* <Link to="/profilechange" id="Link-Text">✏️ Edit Profile</Link><br></br> */}
//       <button><Link to="/about" id="Link-Text">About ⚡</Link></button>

//       {/* 📊 Stats */}
//       <div className="stats">
//         <div><Link to="/orders" id="Link-Text">📦 Orders: </Link> {myOrders.length}</div>

//         <div>
//           <Link to="/liked" id="Link-Text">❤️ Likes:</Link> {likes.length}
//         </div>
//       </div>

//       {/* 📦 Recent Orders */}
//       <h3>Recent Orders</h3>

//       {myOrders.length === 0 && <p>No orders yet 😢</p>}

//       {myOrders.slice(-2).map(order => (
//         <div key={order.id} className="order-preview">
//           <p>{order.date}</p>
//           <p>Status: {order.status}</p>
//         </div>
//       ))}

//       {/* 🔗 Navigation */}
//       <button onClick={() => navigate("/orders")}>
//         View All Orders 📦
//       </button>


//        <br>
//        </br>


//       <button>
//         <Link to="/logout" id="Link-text">Logout 🚪</Link>
//       </button>

//       </motion.div>
//       </AnimatePresence>

//     </div>
//   );
// }

// export default Profile;

// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import axios from "axios";

// function Profile() {
//   const navigate = useNavigate();

//   const [likedProducts, setLikedProducts] = useState([]);

//   const storedUser = JSON.parse(localStorage.getItem("user"));
//   const orders = JSON.parse(localStorage.getItem("orders")) || [];
//   const likes = JSON.parse(localStorage.getItem("likes")) || [];

//   const [userData, setUserData] = useState(null);

//   // 📦 Orders filter
//   const myOrders = orders.filter(order => order.user?.username === storedUser?.username);

//   // 🚪 Logout
//   const logout = () => {
//     // localStorage.removeItem("user");
//     navigate("/logout");
//     alert("Logout success 🚪");
//   };

//   // ❌ Not logged in
//   if (!storedUser) {
//     return (
//       <div id="items-center">
//         <h2>Please login ⬇️</h2>
//         <button>
//           <Link to="/login" id="Link-text">Login ➡️</Link>
//         </button>
//       </div>
//     );
//   }

//   // 🔥 Fetch profile
//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/api/profile/", {
//       params: { username: storedUser.username }
//     })
//     .then(res => setUserData(res.data))
//     .catch(err => console.log(err));
//   }, []);

//   if (!userData) return <h2>Loading...</h2>;

//   return (
//     <div className="profile">
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, x: 100 }}
//           transition={{ duration: 0.4 }}
//         >
//           <h2>👤 Profile</h2>

//           {/* 👤 User Info */}
//           <div className="profile-card">
//             <img
//               src={userData.image || "https://via.placeholder.com/100"}
//               alt="profile"
//               width="80"
//               style={{ borderRadius: "50%", marginBottom: "10px" }}
//             /> <Link to="/profilechange" id="Link-Text">✏️ Edit</Link> 

//             <h3>{userData.username}</h3>
//             <p>Email: {userData.email}</p>
//             <p>Phone: {userData.phone}</p>
//           </div>

//           <button>
//             <Link to="/about" id="Link-text">Aboutℹ️</Link>
//           </button>

//           {/* 📊 Stats */}
//           <div className="stats">
//             <div>
//               <button><Link to="/cart" id="Link-Text">Cart 🛒 </Link></button>
//             </div>

//             <div>
//               <button><Link to="/liked" id="Link-Text">Wishlist ❤️</Link></button>
//             </div>
//           </div>

//           {/* 📦 Orders */}
//           <h3>Recent Orders</h3>

//           {myOrders.length === 0 && <p>No orders yet 😢</p>}

//           {myOrders.slice(-2).map(order => (
//             <div key={order.id} className="order-preview">
//               <p>{order.date}</p>
//               <p>Status: {order.status}</p>
//             </div>
//           ))}

//           <button onClick={() => navigate("/orders")}>
//             View Orders 📦
//           </button>

//           <br />

//           <button onClick={logout}>
//             Logout 🚪
//           </button>

//         </motion.div>
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Profile;

import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]); // 🔥 NEW

  // 🚪 Logout
  const logout = () => {
    navigate("/logout");
    alert("Logout success 🚪");
  };

  // ❌ Not logged in
  if (!storedUser) {
    return (
      <div id="items-center">
        <h2>Please login ⬇️</h2>
        <button>
          <Link to="/login" id="Link-text">Login ➡️</Link>
        </button>
      </div>
    );
  }

  /* =========================================
     👤 FETCH PROFILE
  ========================================= */
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/profile/", {
      params: { username: storedUser.username }
    })
    .then(res => setUserData(res.data))
    .catch(err => console.log(err));
  }, []);

  /* =========================================
     📦 FETCH ORDERS (🔥 FIX)
  ========================================= */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/orders/", {
          params: { username: storedUser.username }
        });

        setOrders(res.data);

      } catch (err) {
        console.log("ORDER ERROR 👉", err);
      }
    };

    fetchOrders();
  }, []);

  if (!userData) return <h2>Loading...</h2>;

  return (
    <div className="profile">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4 }}
        >
          <h2>👤 Profile</h2>

          {/* 👤 User Info */}
          <div className="profile-card">
            <img
              src={userData.image || "https://via.placeholder.com/100"}
              alt="profile"
              width="80"
              style={{ borderRadius: "50%", marginBottom: "10px" }}
            />

            <Link to="/profilechange" id="Link-Text">✏️ Edit</Link> 

            <h3>{userData.username}</h3>
            <p>Email: {userData.email}</p>
            <p>Phone: {userData.phone}</p>
          </div>

          <button>
            <Link to="/about" id="Link-text">Aboutℹ️</Link>
          </button>

          {/* 📊 Stats */}
          <div className="stats">
            <div>
              <button>
                <Link to="/cart" id="Link-Text">Cart 🛒</Link>
              </button>
            </div>

            <div>
              <button>
                <Link to="/liked" id="Link-Text">Wishlist ❤️</Link>
              </button>
            </div>
          </div>

          {/* 📦 Orders */}
          <h3>Recent Orders</h3>

          {orders.length === 0 && <p>No orders yet 😢</p>}

          {/* 🔥 LAST 2 ORDERS */}
          {orders.slice(-2).map(order => (
            <div key={order.id} className="order-preview">
              <p>{new Date(order.created_at).toLocaleString()}</p>
              <p>Status: {order.status}</p>
            </div>
          ))}

          <button onClick={() => navigate("/orders")}>
            View Orders 📦
          </button>

          <br />

          <button onClick={logout}>
            Logout 🚪
          </button>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Profile;