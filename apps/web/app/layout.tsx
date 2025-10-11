import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ava - Compliance-Aware Workspace Platform",
  description: "Advisory compliance and task management for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
