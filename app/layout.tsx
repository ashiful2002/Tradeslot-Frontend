import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import QueryProvider from "../providers/QueryProvider";
import GlobalFloatingChatbot from "../components/chatbot/GlobalFloatingChatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeSlot — Booking Platform for Tradespeople",
  description:
    "Book verified local tradespeople with automated scheduling, travel buffers, and Stripe Connect payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white">
            {children}
          </main>
          {/* Global Floating AI Booking Chatbot Button on ALL pages */}
          <GlobalFloatingChatbot />
        </QueryProvider>
      </body>
    </html>
  );
}
