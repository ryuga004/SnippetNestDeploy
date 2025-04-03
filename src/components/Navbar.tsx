"use client";

import CenterModalWrapper from "@/hoc/modals/centerModalWrapper";
import { showToast } from "@/lib";
import { LOGOUT_USER } from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { removeUser } from "@/redux/slice/userSlice";
import { useMutation } from "@apollo/client";
import {
  Calendar,
  ChevronDown,
  Clipboard,
  Code,
  FileText,
  Home,
  LayoutDashboard,
  List,
  LogOutIcon,
  Menu,
  Sparkles,
  UserCircleIcon,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import CreateSnippetForm from "./Forms/createSnippet";
import LoginRegister from "./Forms/login";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { isLoggedIn, isAdmin, user } = useAppSelector((state) => state.user);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
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

  const [logoutUser] = useMutation(LOGOUT_USER);
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data.logoutUser.success) {
        dispatch(removeUser());
        setMenuOpen(false);
        showToast(res.data.logoutUser.message, "success");
      } else {
        console.log("Logout Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  // const hideBackButton = pathname === "/" || window.history.length <= 1;
  return (
    <>
      <nav
        className={`${
          scrolled ? "bg-transparent" : "bg-gray-900 shadow-md"
        } absolute w-full  px-8 py-4 top-0 left-0 flex items-center justify-between px-6 md:px-10 py-4 z-50`}
      >
        <div className="flex flex-center">
          {/* {!hideBackButton && (
                        // <Button variant="default" className="flex absolute left-0 items-center gap-2" onClick={() => router.back()}>
                        //     <ArrowLeft className="w-5 h-5" />

                        // </Button>)} */}
          <Link
            href="/"
            className={`${
              scrolled ? "text-red-800" : "text-white"
            } text-xl flex items-center gap-3 font-bold`}
          >
            <Avatar className="cursor-pointer">
              <AvatarImage src="/logo.png" alt="Logo" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <span>SnippetNest</span>
          </Link>
        </div>
        {isAdmin && (
          <Button
            onClick={() => {
              setShowAdminPanel(!showAdminPanel);
              router.push(!showAdminPanel ? "/admin" : "/");
            }}
            asChild
            className="flex items-center bg-red-800 justify-center p-2 rounded-lg transition-all duration-300 hover:bg-red-900 cursor-pointer"
          >
            <UserCog size={70} className="text-white bg-blue-500 rounded-md " />
          </Button>
        )}
        <div className="hidden md:flex gap-6">
          {showAdminPanel ? (
            <>
              <NavLink href="/admin" pathname={pathname}>
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </NavLink>
              <NavLink href="/admin/snippets" pathname={pathname}>
                <FileText className="w-5 h-5 mr-2" />
                Snippets
              </NavLink>
              <NavLink href="/admin/problems" pathname={pathname}>
                <List className="w-5 h-5 mr-2" />
                Problems
              </NavLink>
              <NavLink href="/admin/users" pathname={pathname}>
                <Users className="w-5 h-5 mr-2" />
                Users
              </NavLink>
            </>
          ) : (
            <>
              <NavLink href="/" pathname={pathname}>
                <Home className="w-5 h-5 mr-2" />
                Home
              </NavLink>
              <NavLink href="/snippets" pathname={pathname}>
                <FileText className="w-5 h-5 mr-2" />
                Snippets
              </NavLink>
              <NavLink href="/problems" pathname={pathname}>
                <Code className="w-5 h-5 mr-2" />
                Practice
              </NavLink>
              <NavLink href="/events" pathname={pathname}>
                <Calendar className="w-5 h-5 mr-2" />
                Challeges
              </NavLink>
              <NavLink href="/generate" pathname={pathname}>
                <Sparkles className="w-5 h-5 mr-2" />
                AI Generator
              </NavLink>
            </>
          )}

          <div>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex justify-center items-center gap-1 cursor-pointer">
                    <Avatar
                      className={`${scrolled ? "bg-gray-400" : "bg-white"}`}
                    >
                      <AvatarImage
                        src={isLoggedIn ? user.avatar : "/user_logo.png"}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        {user.username?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="m-auto" size={15} color="gray" />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md p-2"
                >
                  <DropdownMenuItem
                    onClick={() => router.push(`/profile/${user.id}`)}
                    className="flex gap-2 items-center px-4 py-2 hover:bg-gray-700 rounded-md"
                  >
                    <UserCircleIcon /> {user.username}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setOpenModal(true)}
                    className="flex gap-2 items-center px-4 py-2 hover:bg-gray-700 rounded-md"
                  >
                    <Clipboard /> Create Snippet
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex gap-2 items-center px-4 py-2 text-red-500 hover:bg-gray-700 rounded-md"
                  >
                    <LogOutIcon /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                onClick={() => setOpenLoginModal(true)}
                className="w-full bg-orange-500 text-left px-4 py-2 hover:bg-orange-700 rounded-md"
              >
                Login
              </Button>
            )}
          </div>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          ref={menuRef}
          className="z-20 absolute top-16 left-0 w-full bg-gray-900 p-4 flex flex-col items-center gap-4 md:hidden"
        >
          <NavLink
            href="/"
            pathname={pathname}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            href="/snippets"
            pathname={pathname}
            onClick={() => setMenuOpen(false)}
          >
            Snippets
          </NavLink>
          <NavLink
            href="/problems"
            pathname={pathname}
            onClick={() => setMenuOpen(false)}
          >
            Practice
          </NavLink>
          <NavLink
            href="/generate"
            pathname={pathname}
            onClick={() => setMenuOpen(false)}
          >
            AI Generator
          </NavLink>

          <Button
            onClick={() => {
              setOpenModal(true);
              setMenuOpen(false);
            }}
          >
            Create Snippet
          </Button>
        </div>
      )}

      {openModal && (
        <CenterModalWrapper handleClose={() => setOpenModal(false)}>
          <CreateSnippetForm handleClose={() => setOpenModal(false)} />
        </CenterModalWrapper>
      )}

      {openLoginModal && (
        <CenterModalWrapper handleClose={() => setOpenLoginModal(false)}>
          <LoginRegister handleClose={() => setOpenLoginModal(false)} />
        </CenterModalWrapper>
      )}
    </>
  );
};

const NavLink = ({
  href,
  pathname,
  children,
  onClick,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg flex gap-2 ${
        isActive ? "bg-red-500 text-white" : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
