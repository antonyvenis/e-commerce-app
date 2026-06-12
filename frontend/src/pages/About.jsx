import { motion } from "framer-motion";
import Contact from "./Contact";
import HeroBanner from "./HeroBanner";

function About() {
  return (
    <>
    <div className="about premium-bg">

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🍔 About Our Foods
      </motion.h1>

      <motion.p
        className="about-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        We deliver delicious meals with love ❤️  
        Fast delivery + Best quality + Affordable price
      </motion.p>

      <div className="about-grid">
        {["🚀 Fast Delivery", "🥗 Fresh Food", "⭐ Top Quality"].map((item, i) => (
          <motion.div
            key={i}
            className="about-card glass"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            whileHover={{ scale: 1.1, rotate: 2 }}
          >
            {item}
          </motion.div>
        ))}
      </div>

      <div> {<Contact />} </div>

    </div>

    <HeroBanner />
    </>
  );
}

export default About;