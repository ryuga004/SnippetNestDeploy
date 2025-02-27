import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                {/* Left Section - Brand & Description */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold text-white">SnippetNest</h2>
                    <p className="mt-2 text-sm text-gray-400">Building the future, one template at a time.</p>
                </div>

                {/* Middle Section - Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-6 text-sm">
                    <Link href="/" className="hover:text-white transition-all">Home</Link>
                    <Link href="/snippets" className="hover:text-white transition-all">Templates</Link>
                    <Link href="/generate" className="hover:text-white transition-all">AI Generator</Link>
                    {/* <Link href="/contact" className="hover:text-white transition-all">Contact</Link> */}
                </nav>

                {/* Right Section - Social Media Icons */}
                <div className="flex gap-4 mt-6 md:mt-0">
                    <Link href="#" className="hover:text-white transition-all">
                        <Facebook className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white transition-all">
                        <Twitter className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white transition-all">
                        <Instagram className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="hover:text-white transition-all">
                        <Linkedin className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Bottom Section - Copyright */}
            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
                © {new Date().getFullYear()} SnippetNest. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
