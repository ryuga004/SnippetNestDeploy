import { useEffect } from "react";

export const useClickOutside = (modalRef: React.RefObject<HTMLDivElement | null>, handleClose: () => void) => {

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (modalRef.current && !modalRef.current?.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClose, modalRef]);

    return modalRef;
};
