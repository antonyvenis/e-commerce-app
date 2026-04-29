import axios from "axios";
import Products from "./Products"; // 👈 your products array


const upload = async () => {
  const products = Products();

  for (let item of products) {
    try {
      await axios.post("https://e-commerce-app-8jg4.onrender.com/api/add-product/", item);
      console.log("Added:", item.name);
    } catch (err) {
      console.error("Error:", item.name);
    }
  }
};

upload();