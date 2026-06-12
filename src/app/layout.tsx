import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "ScriptViral — AI Viral Video Script Generator",
    description:
        "Generate viral video scripts, hooks, narration, and AI video prompts for YouTube, TikTok, and Reels.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={cn("dark font-sans", inter.variable)}>
            <body className="min-h-screen antialiased">
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
