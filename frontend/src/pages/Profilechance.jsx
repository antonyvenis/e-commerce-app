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
      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/update-profile/", user);

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