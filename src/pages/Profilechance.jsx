// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// function ProfileChange() {
//   const storedUser = JSON.parse(localStorage.getItem("user"));

//   const [user, setUser] = useState(storedUser);
//   const navigate = useNavigate();

//   // ✏️ Edit fields
//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   // 🖼️ Image upload
//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = () => {
//       const updatedUser = { ...user, image: reader.result };
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//     };

//     reader.readAsDataURL(file);
//   };

//   // 💾 Save profile
//   const saveProfile = () => {
//     localStorage.setItem("user", JSON.stringify(user));
//     alert("Profile updated ✅");
//     navigate("/profile")
//   };

//   return (
//     <div className="profile-page">
//        <AnimatePresence>
//      <motion.div

//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, x: 100 }}
//                 transition={{ duration: 0.4 }}
//      >

//       <h2>👤 Profile</h2>

//       {/* 🖼️ Image */}
//       <p>image:</p><img
//         src={user?.image || "https://via.placeholder.com/100"}
//         width="100"
//         style={{ borderRadius: "50%" }}
//       />

//       <input type="file" onChange={handleImage} />

//       {/* ✏️ Edit */}
//       <p>Name:</p><input
//         name="name"
//         value={user?.name}
//         onChange={handleChange}
//       />
//       <br>
//       </br>
//       <button onClick={saveProfile}>Save ✏️</button>

//       </motion.div>
//       </AnimatePresence>

//     </div>
//   );
// }

// export default ProfileChange;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileChange() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const navigate = useNavigate();

  // ✏️ Edit
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🖼️ Image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setUser({ ...user, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  // 💾 Save
  const saveProfile = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/update-profile/", user);

      localStorage.setItem("user", JSON.stringify(user));

      alert("Profile updated ✅");
      navigate("/profile");

    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile Edit</h2>

      <img
        src={user?.image || "https://via.placeholder.com/100"}
        width="100"
      />

      <input type="file" onChange={handleImage} />

      <p>Username:</p>
   <input
  name="username"
  value={user?.username || ""}
  onChange={handleChange} 
  />
      
      <p>Email:</p>
      <input
        name="email"
        value={user?.email || ""}
        onChange={handleChange}
        placeholder="Email"
      />
       
      <p>Phone:</p>
      <input
        name="phone"
        value={user?.phone || ""}
        onChange={handleChange}
        placeholder="Phone"
      />

      <button onClick={saveProfile}>Save</button>
    </div>
  );
}

export default ProfileChange;