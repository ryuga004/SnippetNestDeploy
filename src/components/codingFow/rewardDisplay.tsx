"use client";

import { motion } from "framer-motion";
import React from "react";
import { BadgeCheck, Star, Trophy } from "lucide-react";

const achievements = [
  {
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    label: "Achievement Unlocked",
  },
  {
    icon: <Star className="w-6 h-6 text-blue-500" />,
    label: "4 Points Earned",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-green-500" />,
    label: "Code Mastery Badge",
  },
];

const RewardDisplay = () => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto flex flex-col items-center gap-6 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-bold text-green-600"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        🎉 Congratulations!
      </motion.h2>
      <motion.p
        className="text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        You’ve successfully completed the challenge and earned rewards!
      </motion.p>

      <div className="w-full space-y-3">
        {achievements.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-center gap-3 bg-gray-100 py-3 px-4 rounded-lg shadow"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.2 }}
          >
            {item.icon}
            <span className="text-sm font-semibold">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RewardDisplay;
