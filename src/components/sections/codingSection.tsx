'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const words = ['Compile.', 'Debug.', 'Deploy.'];

export default function CodingSection() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 text-white p-6">
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
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">Start Coding</Button>
                <Button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg">Explore Templates</Button>
            </div>
        </section>
    );
}
