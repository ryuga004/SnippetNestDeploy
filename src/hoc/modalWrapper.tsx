
import { useClickOutside } from "@/hooks/onClickOutside";
import { useCloseOnEscape } from "@/hooks/onEscapeClose";
import { useCloseOnScroll } from "@/hooks/onScrollClose";
import { X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

interface ModalWrapperProps {
    children: ReactNode;
    handleClose: () => void;
    heading?: string;
    isOpen: boolean;
}

const ModalWrapper = ({ children, handleClose, heading, isOpen }: ModalWrapperProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(modalRef, handleClose);
    useCloseOnEscape(handleClose);
    useCloseOnScroll(handleClose);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Animation effect
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.classList.add('modal-enter');
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.classList.remove('modal-enter');
                    modalRef.current.classList.add('modal-entered');
                }
            }, 10);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div
                ref={modalRef}
                className="w-max-content h-[max-content] transform transition-all duration-300 opacity-0 scale-95 modal-enter"
                style={{ maxHeight: '90vh' }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        {heading && (
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {heading}
                            </h2>
                        )}
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ml-auto"
                            aria-label="Close modal"
                        >
                            <X size={20} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </header>

                    <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalWrapper;