import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        🎉 Order Placed Successfully!
      </motion.h1>

       <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4 }}
              >

      <p>Thank you for your purchase ❤️</p>
      <p>Your order is on the way 🚚</p>

      <button id="Success-Link"><Link to="/orders" id="Link-text">Back⬅️</Link></button>

      </motion.div>
      </AnimatePresence>

    </div>
  );
}

export default Success;