"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import ModalWrapper from "@/hoc/modalWrapper";
import CreateSnippetForm from "./Forms/createSnippet";

const Navbar = () => {
    const [openModal, setOpenModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Navbar */}
            <nav className="bg-gray-900 shadow-md fixed w-full top-0 left-0 flex items-center justify-between px-6 md:px-10 py-4 z-50">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-white">SnippetNest</Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6">
                    <NavLink href="/" pathname={pathname}>Home</NavLink>
                    <NavLink href="/snippets" pathname={pathname}>Snippets</NavLink>
                    <NavLink href="/problems" pathname={pathname}>Practice</NavLink>
                    <NavLink href="/generate" pathname={pathname}>AI Generator</NavLink>
                    <Button onClick={() => setOpenModal(true)}>Create Snippet</Button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="z-20 absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col items-center gap-4 md:hidden">
                    <NavLink href="/" pathname={pathname} onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink href="/snippets" pathname={pathname} onClick={() => setMenuOpen(false)}>Snippets</NavLink>
                    <NavLink href="/problems" pathname={pathname} onClick={() => setMenuOpen(false)}>Practice</NavLink>
                    <NavLink href="/generate" pathname={pathname} onClick={() => setMenuOpen(false)}>AI Generator</NavLink>
                    <Button onClick={() => { setOpenModal(true); setMenuOpen(false); }}>Create Snippet</Button>
                </div>
            )}

            {/* Modal */}
            {openModal && (
                <ModalWrapper handleClose={() => setOpenModal(false)} heading="Create Snippet">
                    <CreateSnippetForm handleClose={() => setOpenModal(false)} />
                </ModalWrapper>
            )}
        </>
    );
};

const NavLink = ({ href, pathname, children, onClick }: { href: string; pathname: string; children: React.ReactNode; onClick?: () => void }) => {
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg ${isActive ? "bg-blue-500 text-white" : "text-gray-300 hover:text-white"}`}
        >
            {children}
        </Link>
    );
};

export default Navbar;
