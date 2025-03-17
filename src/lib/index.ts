import { Home, FileText, Code, List, LayoutDashboard, Users } from "lucide-react";

import { toast } from "sonner";

export const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700 border border-green-300  hover:bg-color-green-300",
    medium: "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-color-yellow-300",
    hard: "bg-red-100 text-red-700 border border-red-300 hover:bg-color-red-300",
};
export const difficultyOrder = { easy: 0, medium: 1, hard: 2 };


export const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    toast[type](message, {
        position: "top-center",
        duration: 2000,
        className: "text-lg font-semibold text-white bg-transparent px-6 py-3 rounded-md shadow-lg flex items-center justify-between",
        dismissible: true,
        closeButton: true,
    });
};


export const Icons = [
    {
        name: "Home",
        icon: Home,
    },
    {
        name: "Snippets",
        icon: FileText,
    },
    {
        name: "Practice",
        icon: Code,
    },
    {
        name: "Problems",
        icon: List,
    },
    {
        name: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Users",
        icon: Users,
    },
];


export const removeTypename = <T>(obj: T): T => {
    if (Array.isArray(obj)) {
        return obj.map(removeTypename) as T;
    } else if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj)
                .filter(([key]) => key !== "__typename")
                .map(([key, value]) => [key, removeTypename(value)])
        ) as T;
    }
    return obj;
};