import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PortfolioAI — GitHub to Portfolio Generator",
  description:
    "Transform your GitHub profile into a stunning, AI-enhanced portfolio in seconds. Premium designs, zero configuration.",
  keywords: ["portfolio", "github", "ai", "generator", "developer", "next.js"],
  authors: [{ name: "PortfolioAI" }],
  openGraph: {
    title: "PortfolioAI — GitHub to Portfolio Generator",
    description:
      "Transform your GitHub profile into a stunning, AI-enhanced portfolio in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-[#050505] text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
