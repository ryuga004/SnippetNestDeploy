"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import ModalWrapper from "@/hoc/modalWrapper";
import CreateSnippetForm from "./Forms/createSnippet";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { removeUser } from "@/redux/slice/userSlice";
import LoginRegister from "./Forms/login";
import CenterModalWrapper from "@/hoc/modals/centerModalWrapper";

const Navbar = () => {
    const [openModal, setOpenModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState<boolean>(false);
    const { isLoggedIn, user } = useAppSelector(state => state.user);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const [openLoginModal, setOpenLoginModal] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleLogout = () => {
        dispatch(removeUser());
        setMenuOpen(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className={`${scrolled ? "bg-transparent" : "bg-gray-900 shadow-md"} fixed w-full  px-8 py-4 top-0 left-0 flex items-center justify-between px-6 md:px-10 py-4 z-50`}>
                {/* Logo */}
                <Link href="/" className={`${scrolled ? "text-red-800" : "text-white"} text-xl font-bold`}>
                    SnippetNest
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6">
                    <NavLink href="/" pathname={pathname}>Home</NavLink>
                    <NavLink href="/snippets" pathname={pathname}>Snippets</NavLink>
                    <NavLink href="/problems" pathname={pathname}>Practice</NavLink>
                    <NavLink href="/generate" pathname={pathname}>AI Generator</NavLink>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className={`${scrolled ? "bg-red-400" : "bg-white"} cursor-pointer`}>
                                <AvatarImage src={isLoggedIn ? user.avatar : "/user_logo.png"} alt="User Avatar" />
                                <AvatarFallback>{user.username?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            {isLoggedIn ? (
                                <>
                                    <DropdownMenuItem disabled className="font-semibold">{user.username}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setOpenModal(true)}>Create Snippet</DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">Logout</DropdownMenuItem>
                                </>
                            ) : (
                                <DropdownMenuItem onClick={() => setOpenLoginModal(true)}>Login</DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div ref={menuRef} className="z-20 absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col items-center gap-4 md:hidden">
                    <NavLink href="/" pathname={pathname} onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink href="/snippets" pathname={pathname} onClick={() => setMenuOpen(false)}>Snippets</NavLink>
                    <NavLink href="/problems" pathname={pathname} onClick={() => setMenuOpen(false)}>Practice</NavLink>
                    <NavLink href="/generate" pathname={pathname} onClick={() => setMenuOpen(false)}>AI Generator</NavLink>

                    <Button onClick={() => { setOpenModal(true); setMenuOpen(false); }}>Create Snippet</Button>
                </div>
            )}

            {/* Modal */}

            <ModalWrapper handleClose={() => setOpenModal(false)} heading="Create Snippet" isOpen={openModal}>
                <CreateSnippetForm handleClose={() => setOpenModal(false)} />
            </ModalWrapper>

            {openLoginModal && <CenterModalWrapper handleClose={() => setOpenLoginModal(false)} >
                <LoginRegister handleClose={() => setOpenLoginModal(false)} />
            </CenterModalWrapper>}
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
