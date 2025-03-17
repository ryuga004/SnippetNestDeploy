import { Facebook, Github, Heart, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">

                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-bold text-white">SnippetNest</h2>
                    <p className="mt-2 text-sm text-gray-400">Building the future, one template at a time.</p>
                </div>


                <nav className="flex flex-wrap justify-center gap-6 text-sm">
                    <Link href="/" className="hover:text-white transition-all">Home</Link>
                    <Link href="/snippets" className="hover:text-white transition-all">Snippets</Link>
                    <Link href="/generate" className="hover:text-white transition-all">AI Generator</Link>
                    <Link href="/problems" className="hover:text-white transition-all">Practice</Link>


                </nav>


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


            <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-400">
                <p>© {new Date().getFullYear()} SnippetNest. All rights reserved.</p>

                <div className="mt-2 flex justify-center items-center gap-1">
                    Created by <span className="text-white font-semibold">Rahul Singh</span>
                    <Heart className="text-red-500 fill-red-500" size={16} strokeWidth={0} />
                </div>
                <div className="mt-2 flex justify-center items-center gap-4">
                    <a href="https://linkedin.com/in/rahul-singh-546676240" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="text-gray-400 hover:text-white transition-all" size={18} />
                    </a>
                    <a href="https://github.com/ryuga001" target="_blank" rel="noopener noreferrer">
                        <Github className="text-gray-400 hover:text-white transition-all" size={18} />
                    </a>
                    <a href="mailto:rahul0singh003@gmail.com">
                        <Mail className="text-gray-400 hover:text-white transition-all" size={18} />
                    </a>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
