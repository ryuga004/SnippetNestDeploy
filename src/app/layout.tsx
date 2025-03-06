import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import StoreProvider from "@/redux/storeProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  description: "SnippetNest is a online coding website to run , compile and share code snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <>
            {<Navbar />}

            <div className="py-16 bg-gray-200">
              <Toaster richColors position="top-center" />
              {children}
            </div>
            <Footer />
          </>
        </StoreProvider>
      </body>
    </html>
  );
}
