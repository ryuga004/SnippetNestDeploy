import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 1100) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    // custom hook to added for media query usage 
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
