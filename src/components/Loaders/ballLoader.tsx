"use client";

import { motion } from "framer-motion";

const bounceVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const BallLoader = () => {
  return (
    <div className="flex justify-center h-full w-full mt-12 align-center items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 bg-blue-500 rounded-full"
          variants={bounceVariants}
          animate="animate"
          transition={{ delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export default BallLoader;
