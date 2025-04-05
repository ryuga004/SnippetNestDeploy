"use client";

import MovementWrapper from "@/hoc/Animation/movementWrapper";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

const AISection = () => {
  const [isHovering, setIsHovering] = useState(false);

  const fullText = `#include <iostream>
#include <string>
using namespace std;

// Function to greet the user
void greetUser(const string& name) {
    cout << "Hello, " << name << "! Welcome to C++ programming." << endl;
}

int main() {
    // Variable to hold user input
    string userName;
    // Ask for user input
    cout << "Enter your name: ";
    cin >> userName;
    // Greet the user
    greetUser(userName);
    // Display a motivational message
    cout << "Keep learning and coding!" << endl;
    return 0;
}`;

  // Split code into characters
  const characters = fullText.split("");

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.015, // Typing speed
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <div className="bg-white rounded-lg flex flex-col lg:flex-row gap-6 items-center h-full p-4">
      <motion.div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        tabIndex={0}
        className="w-full max-w-[500px] h-[500px] p-4 border border-gray-700 bg-gray-900 text-green-400 font-mono whitespace-pre overflow-auto shadow-xl rounded-2xl relative text-sm"
        initial={{ rotateX: 20, rotateY: 0, rotateZ: -10 }}
        whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        {isHovering ? (
          <motion.pre
            className="font-mono whitespace-pre-wrap text-green-400 w-[440px]"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {characters.map((char, index) => (
              <motion.span
                key={index}
                variants={charVariants}
                dangerouslySetInnerHTML={{
                  __html: char === "<" ? "&lt;" : char === ">" ? "&gt;" : char,
                }}
              />
            ))}
            <motion.span
              className="animate-pulse ml-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              |
            </motion.span>
          </motion.pre>
        ) : (
          <pre className="text-green-400 opacity-60">Hover to animate...</pre>
        )}
      </motion.div>

      <div className="container px-4 mx-auto">
        <MovementWrapper direction="none" triggerOnScroll={true}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Not finding what you need?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let our AI create a custom snippet tailored to your specific
              requirements. Just describe what you need and we will generate it
              for you.
            </p>
            <Link href="/generate">
              <Button size="lg" className="gap-2">
                Try AI Generator
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </MovementWrapper>
      </div>
    </div>
  );
};

export default AISection;
