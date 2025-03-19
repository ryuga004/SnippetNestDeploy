import React from "react";
import { motion } from "framer-motion";

const CircularLoader: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.div
        style={{
          width: 50,
          height: 50,
          border: "5px solid #e0e0e0",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default CircularLoader;
