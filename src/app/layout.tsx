import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";

export const metadata: Metadata = {
  title: "Anonymous Messaging App",
  description: "A secure anonymous messaging platform built with Next.js",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </AuthProvider>
    </html>
  );
}
