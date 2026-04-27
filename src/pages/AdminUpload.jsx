import axios from "axios";
// import Products from "./Products"; 

function AdminUpload() {

  const uploadProducts = async () => {
    try {
      const data = Products(); // 👈 your products array

      await axios.post("http://127.0.0.1:8000/api/add-products/", {
        products: data
      });

      alert("Uploaded 🔥");

    } catch (err) {
       console.log("FULL ERROR 👉", err);
       console.log("BACKEND 👉", err.response?.data);
      alert("Upload failed ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload Products to Backend 🚀</h2>

      <button onClick={uploadProducts}>
        Upload Products 🔥
      </button>
    </div>
  );
}

export default AdminUpload;