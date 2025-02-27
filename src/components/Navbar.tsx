"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import ModalWrapper from "@/hoc/modalWrapper";
import CreateSnippetForm from "./Forms/createSnippet";

const Navbar = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const hadleCloseModal = () => {
        setOpenModal(false);
    }
    return (
        <>
            <nav className="bg-gray-800  backdrop-blur-lg shadow-lg fixed w-full top-0 left-0 flex items-center justify-between py-4 px-6 md:px-10 z-50">
                {/* Logo */}
                <aside className="flex items-center">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="../logo.png" />
                        <AvatarFallback>Logo</AvatarFallback>
                    </Avatar>
                    <span className="ml-3 text-xl hidden lg:block md:block font-bold text-gray-100">SnippetNest</span>
                </aside>

                {/* Navigation Links */}
                <main className="flex gap-4   items-center flex-wrap">
                    <Link href="/" className="text-gray-300 hover:text-white transition-all text-lg font-medium">
                        Home
                    </Link>
                    <Button onClick={() => setOpenModal(!openModal)} variant="default">Create Snippet</Button>
                    <Link href="/snippets" className="text-gray-300 hover:text-white transition-all text-lg font-medium">
                        Snippets
                    </Link>
                    <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md">
                        <Link href="/generate">AI Generator</Link>
                    </Button>
                    {/* <Button asChild className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow-md">
                    <Link href="/login">Login</Link>
                </Button> */}


                </main>
            </nav>
            {openModal && (
                <ModalWrapper handleClose={hadleCloseModal
                }
                    heading={"Create Snippet"}
                >
                    <CreateSnippetForm handleClose={hadleCloseModal} />
                </ModalWrapper >
            )}
        </>
    );
};

export default Navbar;
