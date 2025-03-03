"use client";
import { ReactNode } from "react";

interface SectionWrapperProps {
    children: ReactNode;
}

const SectionWrapper = ({ children }: SectionWrapperProps) => {
    return (
        <section
            className="bg-gray-200 w-xl h-full  px-8 py-4 h-full "
        >
            {children}
        </section>
    );
};

export default SectionWrapper;
