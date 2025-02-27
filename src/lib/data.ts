import { Snippet, User } from "./types";


export const snippets: Snippet[] = [
    {
        id: '1',
        title: 'Modern Portfolio',
        description: 'A sleek portfolio template for creative professionals',
        tags: ['Minimal', 'Dark Mode', 'Responsive'],
        language: "react",
        source_code: `
import React from "react";

export default function Portfolio() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <header className="w-full bg-blue-600 text-white p-6 text-center">
                <h1 className="text-3xl font-bold">Modern Portfolio</h1>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <p className="text-xl">Welcome to your portfolio!</p>
            </main>
            <footer className="w-full p-4 bg-gray-800 text-white text-center">
                &copy; 2025 Portfolio Inc.
            </footer>
        </div>
    );
}`,
        author: {
            author_id: '101',
            username: 'Alex Chen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&fit=crop'
        },

    },
    {
        id: '2',
        title: 'E-commerce Pro',
        description: 'Complete e-commerce solution with modern design',
        tags: ['Shop', 'Cart', 'Dashboard'],
        language: "react",
        source_code: `
import React from "react";

export default function ECommerce() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <h1 className="text-4xl font-bold text-gray-800">E-commerce Pro</h1>
            <p className="text-lg text-gray-600">A powerful e-commerce solution</p>
        </div>
    );
}`,

        author: {
            author_id: '102',
            username: 'Sarah Miller',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&fit=crop'
        },
    },
    {
        id: '3',
        title: 'Blog Master',
        description: 'Professional blog template with multiple layouts',
        tags: ['Content', 'SEO', 'Responsive'],
        language: "react",
        source_code: `
import React from "react";

export default function Blog() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-3xl font-semibold text-gray-800">Blog Master</h1>
            <p className="text-lg text-gray-600">Your go-to blog template</p>
        </div>
    );
}`,
        author: {
            author_id: '103',
            username: 'Mike Johnson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&fit=crop'
        },
    }
];



export const featuredSnippets = snippets.slice(0, 3);


export const categories = [
    'All',
    'Portfolio',
    'E-commerce',
    'Blog',
    'Landing Page',
    'Dashboard',
    'Mobile App'
];


export const mockUser: User = {
    id: '1',
    username: 'JohnDoe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&fit=crop',
    // role: 'user'
};

