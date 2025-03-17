"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const RouteLoader = () => {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [loading, startTransition] = useTransition();
    console.log(loading);
    useEffect(() => {
        startTransition(() => {
            setProgress(20);
        });

        return () => {
            setProgress(100);
            setTimeout(() => setProgress(0), 300); // Reset
        };
    }, [pathname]);

    if (progress === 0) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-50">
            <Progress value={progress} className="h-1 bg-blue-500 transition-all duration-300" />
        </div>
    );
};

export default RouteLoader;
