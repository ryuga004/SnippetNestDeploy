import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import ApolloProviderWrapper from "@/lib/ApolloClient/ApolloClientWrapper"; // Client component
import StoreProvider from "@/redux/storeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnippetNest",
  description: "SnippetNest is an online coding website to run, compile, and share code snippets.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-y-auto hide-scrollbar">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased  min-h-screen bg-gray-200`}>
        <ApolloProviderWrapper>
          <StoreProvider>
            <Navbar />
            <main className="py-16  min-h-screen">

              <Toaster richColors position="top-center" />
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
