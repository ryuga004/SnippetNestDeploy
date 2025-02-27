import { useClickOutside } from "@/hooks/onClickOutside";
import { useCloseOnEscape } from "@/hooks/onEscapeClose";
import { useCloseOnScroll } from "@/hooks/onScrollClose";
import { ReactNode, useRef } from "react";

interface ModalWrapperProps {
    children: ReactNode;
    handleClose: () => void;
    heading?: string;
}

const ModalWrapper = ({ children, handleClose, heading }: ModalWrapperProps) => {
    const childRef = useRef<HTMLDivElement | null>(null);

    // useClickOutside(childRef, handleClose);
    useCloseOnScroll(handleClose);
    useCloseOnEscape(handleClose);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div
                ref={childRef}
                className="bg-gray-800 flex flex-col gap-4 shadow-xl rounded-lg p-2  w-11/12 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg relative"
            >

                <header className=" text-white flex justify-between items-center p-2 ">
                    {heading && <h2 className="text-xl font-bold">{heading}</h2>}
                    <button
                        onClick={handleClose}
                        className="text-white   text-2xl font-semibold"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </header>
                <main >
                    {children}
                </main>

            </div>
        </div>
    );
};

export default ModalWrapper;
