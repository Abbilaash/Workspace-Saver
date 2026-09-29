import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Workspace Saver — Save and Restore Your Browser Workspace",
  description: "Save your browser tabs, groups, scroll positions, selected text and notes as projects. Restore your entire workspace with one click.",
  keywords: ["browser extension", "workspace manager", "tab saver", "productivity tool", "context switching", "chrome extension"],
  authors: [{ name: "Workspace Saver" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title: "Workspace Saver — Save and Restore Your Browser Workspace",
    description: "Save your tabs, groups, scroll positions, selected text, and notes as a project — then restore your entire workspace with one click.",
    type: "website",
    url: "https://workspacesaver.app",
    siteName: "Workspace Saver",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workspace Saver — Save and Restore Your Browser Workspace",
    description: "Save your workspace. Pick up exactly where you left off.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090a0f] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
