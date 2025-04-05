"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  SiCplusplus,
  SiGo,
  SiJavascript,
  SiPython,
  SiRust,
} from "react-icons/si";

const languages = [
  { name: "C++", icon: <SiCplusplus />, color: "#00599C" },
  { name: "Python", icon: <SiPython />, color: "#3776AB" },
  { name: "JavaScript", icon: <SiJavascript />, color: "#F7DF1E" },
  { name: "Java", icon: <SiGo />, color: "#f89820" },
  { name: "Go", icon: <SiGo />, color: "#00ADD8" },
  { name: "Rust", icon: <SiRust />, color: "#000000" },
];

const bubbleVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const FloatingLanguages = () => {
  const [selectedLang, setSelectedLang] = useState("C++");

  return (
    <div className="relative w-full h-full flex flex-wrap justify-center items-center gap-6">
      {languages.map((lang) => (
        <motion.div
          key={lang.name}
          variants={bubbleVariants}
          animate="float"
          whileHover={{ scale: 1.2 }}
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-full shadow-lg cursor-pointer transition-all duration-300 ${
            selectedLang === lang.name ? "ring-4 ring-green-500" : ""
          }`}
          style={{
            backgroundColor: lang.color,
            color: "#fff",
          }}
          onClick={() => setSelectedLang(lang.name)}
        >
          <div className="text-2xl">{lang.icon}</div>
          <div className="text-xs mt-1">{lang.name}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingLanguages;
