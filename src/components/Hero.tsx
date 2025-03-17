"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const images = [
    "https://images.unsplash.com/photo-1536148935331-408321065b18?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1463171379579-3fdfb86d6285?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
const words = ['Compile.', 'Debug.', 'Run.'];
const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);
    const router = useRouter();
    return (
        <div className="relative w-full h-[92vh] bg-black overflow-hidden">
            {/* Image Slider with Smooth Transitions */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt="Hero Background"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Overlay Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white"
            >
                <motion.h1
                    className="text-5xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Code. <span className="text-blue-400">{words[index]}</span>
                </motion.h1>
                <p className="text-lg mt-4 text-gray-300">Run, debug, and collaborate on your code in real time.</p>
                <div className="mt-6 flex gap-4">
                    <Button onClick={() => router.push("/problems")} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">Start Coding</Button>
                    <Button onClick={() => router.push("/snippets")} className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg">Explore Snippets</Button>
                </div>
            </motion.div>


            {/* Dot Indicators with Animation */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
            >
                {images.map((_, index) => (
                    <motion.div
                        key={index}
                        animate={{
                            scale: index === currentIndex ? 1.3 : 1,
                            backgroundColor: index === currentIndex ? "#ffffff" : "#a0a0a0",
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-3 h-3 rounded-full"
                    />
                ))}
            </motion.div>
        </div >
    );
};

export default Hero;
