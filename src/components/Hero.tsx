"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "https://img.freepik.com/free-photo/mythical-dragon-beast-anime-style_23-2151112835.jpg?w=1800",
    "https://img.freepik.com/free-photo/men-women-embrace-sunset-generative-ai_188544-12581.jpg?w=1800",
    "https://img.freepik.com/free-photo/anime-moon-landscape_23-2151645914.jpg?w=1800",
    "https://img.freepik.com/free-photo/anime-style-portrait-traditional-japanese-samurai-character_23-2151499086.jpg?w=1800",
    "https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546166.jpg?w=1380",
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[70vh]  overflow-hidden">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl font-bold drop-shadow-lg"
                >
                    Welcome to Our Store
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl mt-2"
                >
                    Discover amazing website templates
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    <Button
                        className="px-8 py-3 mt-4 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all"
                        variant="outline"
                        asChild
                    >
                        <Link href="/snippets">Explore Snippets</Link>
                    </Button>
                </motion.div>
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
        </div>
    );
};

export default Hero;
