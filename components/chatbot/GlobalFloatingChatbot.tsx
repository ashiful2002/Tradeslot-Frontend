"use client";

import React, { useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import WebChatWidget from "./WebChatWidget";
import { Trader } from "@/types";

const DEFAULT_TRADER: Trader = {
  id: "clx_default_trader_id",
  userId: "clx_default_user_id",
  businessName: "TradeSlot Intake Assistant",
  tradeCategory: "General Trade Intake",
  hourlyRate: 75.0,
  bio: "Automated booking intake & trader matching system.",
  isVerified: true,
  currency: "USD",
  stripeOnboardingComplete: true,
  user: {
    email: "assistant@tradeslot.com",
    firstName: "TradeSlot",
    lastName: "AI Assistant",
  },
};

export default function GlobalFloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 brand-gradient hover:opacity-95 text-slate-950 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group cursor-pointer flex items-center gap-2.5 border border-[#38b6ff]/30 shadow-[#38b6ff]/20"
          aria-label="Open AI Booking Chatbot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8c52ff] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8c52ff] rounded-full" />
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline text-slate-950 tracking-tight">
            Book via AI Assistant
          </span>
          <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
        </button>
      )}

      {/* Embedded WebChatWidget */}
      <WebChatWidget
        trader={DEFAULT_TRADER}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
