import { useEffect } from "react";

export const useCloseOnScroll = (handleClose: () => void) => {
    useEffect(() => {
        const handleScroll = () => handleClose();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleClose]);
};
