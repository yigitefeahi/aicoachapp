import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppNav } from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme-toggle";
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
  title: "AI Interview Coach",
  description: "Multimodal AI interview coach with text, audio, video and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppNav />
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}