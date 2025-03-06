import AppSidebar from "@/components/admin_component/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel | SnippetNest",
    description: "Admin dashboard for managing SnippetNest",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" type="image/png" href="/admin-logo.png" />
            </head>
            <body className="min-h-screen bg-gray-300">
                <SidebarProvider>
                    <div className="flex min-h-screen w-screen">


                        <AppSidebar />


                        <main className="flex-1 p-6">
                            <SidebarTrigger />
                            <div className="bg-white rounded-lg shadow-md p-4">{children}</div>
                        </main>

                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}
