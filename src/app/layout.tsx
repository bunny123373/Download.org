import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthCheck from "@/components/AuthCheck";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkHub - Link Organizer",
  description: "Smart link organizer for movies, videos, subtitles, and more",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-full bg-[var(--bg-primary)]">
        <Sidebar />
        <main className="lg:ml-[280px] min-h-screen">
          <AuthCheck>{children}</AuthCheck>
        </main>
      </body>
    </html>
  );
}