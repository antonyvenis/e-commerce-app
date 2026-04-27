// import { Link, useNavigate } from "react-router-dom";

// function Logout() {
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("likes");
//     localStorage.removeItem("cart");
//     localStorage.removeItem("orders");

//     navigate("/login");
//     return alert("Logout exists ⬅️")
//   };

//   return (
//     <div className="header fade-in">

//       <h1>🫂</h1>

//       {/* 👤 USER NAME */}
//       <h3>Bye, {user?.username} 👋</h3>
//       <h2>THANK YOU FOR VISITING 🤝</h2>
//       <h5>come again , {user?.username} 💫👍 </h5>

//       <button onClick={logout} >Logout 🚪</button>

//     </div>
//   );
// }

// export default Logout;

import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  // 🔥 store user BEFORE logout
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    // 🔐 clear only session data
    localStorage.removeItem("user");
    localStorage.removeItem("likes");
    localStorage.removeItem("cart");
    localStorage.removeItem("orders");

    alert("Logout successful 👋");

    navigate("/login");
  };

  return (
    <div className="header fade-in">

      <h1>🫂</h1>

      {/* 👤 USER NAME SAFE */}
      <h3>Bye, {user?.username || "User"} 👋</h3>

      <h2>THANK YOU FOR VISITING 🤝</h2>

      <h5>Come again, {user?.username || "User"} 💫👍</h5>

      <button onClick={logout}>Logout 🚪</button>

    </div>
  );
}

export default Logout;