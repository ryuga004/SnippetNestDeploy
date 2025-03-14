import { useClickOutside } from "@/hooks/onClickOutside";
import { useCloseOnEscape } from "@/hooks/onEscapeClose";
import { useCloseOnScroll } from "@/hooks/onScrollClose";
import { X } from "lucide-react";
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
                className={`relative w-[max-content] h-[max-content]  bg-white  shadow-xl rounded-md ${className}`}
            >
                <button
                    onClick={handleClose}
                    className="absolute right-2 top-2 p-2 "
                >
                    <X color="black" />
                </button>
                {children}
            </div>
        </div>
    );
};


export default CenterModalWrapper;
