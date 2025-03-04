import { useClickOutside } from "@/hooks/onClickOutside";
import { useCloseOnEscape } from "@/hooks/onEscapeClose";
import { useCloseOnScroll } from "@/hooks/onScrollClose";
import { ReactNode, useRef } from "react";

interface ModalProps {
    children: ReactNode,
    handleClose: () => void
    className?: string,
}

function CenterModalWrapper({ handleClose, className, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, handleClose);
    useCloseOnEscape(handleClose);
    useCloseOnScroll(handleClose);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div ref={modalRef}
                className={`relative w-[max-content] h-[max-content]  bg-white p-6 shadow-xl rounded-lg ${className}`}
            >
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-800"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};


export default CenterModalWrapper;
