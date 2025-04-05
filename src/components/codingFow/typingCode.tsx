"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

type Props = {
  language: string;
};

const codeSnippets: Record<string, string> = {
  "C++": `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  Python: `print("Hello, World!")`,
  JavaScript: `console.log("Hello, World!");`,
  Java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  Go: `package main
import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  Rust: `fn main() {
    println!("Hello, World!");
}`,
};

const TypingCode = ({ language = "C++" }: Props) => {
  const fullText: string =
    codeSnippets[language] || "// No code snippet found.";
  const [displayedText, setDisplayedText] = useState<string>("");
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      setDisplayedText("");
      for (let i = 0; i <= fullText.length; i++) {
        setDisplayedText(fullText.slice(0, i));
        await controls.start({
          transition: { duration: 0.04 },
        });
        setDisplayedText(fullText.slice(0, i));
      }
    };

    sequence();
  }, [language, fullText, controls]);

  return (
    <div className="flex gap-3">
      <motion.div className="flex flex-col gap-3 justify-between">
        <Skeleton className="h-[100px] w-[300px]" />
        <Skeleton className="h-[150px] w-[300px]" />
      </motion.div>
      <div className="w-full max-w-2xl h-[300px] p-4 border border-gray-700 bg-black text-green-400 font-mono whitespace-pre overflow-auto rounded-lg shadow-xl text-sm relative">
        <motion.pre
          animate={controls}
          dangerouslySetInnerHTML={{
            __html: displayedText.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
          }}
        />
        <motion.span
          className="absolute bottom-4 left-4 text-green-400"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          |
        </motion.span>
      </div>
    </div>
  );
};

export default TypingCode;
