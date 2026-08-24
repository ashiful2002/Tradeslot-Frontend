"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { Trader } from "@/types";
import TraderCard from "@/components/ui/TraderCard";
import WebChatWidget from "@/components/chatbot/WebChatWidget";
import { useGetAllTraders } from "@/hooks/useTradeSlot";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChatTrader, setActiveChatTrader] = useState<Trader | null>(null);

  // TanStack Query GET hook for fetching traders
  const { data: tradersRes, isLoading } = useGetAllTraders({
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });

  const traders = tradersRes?.data || [];
  // Show only 9 traders on the home page as requested
  const homeTraders = traders.slice(0, 9);

  const categoriesList = [
    "ALL",
    "Plumbing",
    "Electrical",
    "Heating",
    "Carpentry",
    "Roofing",
    "Painting",
    "Landscaping",
    "Tiling",
    "Locksmith",
    "HVAC",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-[#38b6ff] selection:text-slate-950">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] gradient-glow pointer-events-none -z-10 opacity-70" />

      {/* =========================================================================
          SECTION 1: HERO HEADER & INTELLIGENT SEARCH
          ========================================================================= */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] text-xs font-semibold uppercase tracking-wider shadow-lg shadow-[#38b6ff]/5">
          <Sparkles className="w-4 h-4 text-[#8c52ff]" />
          <span>Multi-Channel Trade Booking Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Find, Chat, & Book Local Tradespeople{" "}
          <span className="brand-gradient-text">
            In Seconds
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Intelligent schedule optimization with automatic 30-minute travel buffers,
          instant AI Web chatbot intake, and transparent Stripe payouts.
        </p>

        {/* Search & Category Filter */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-3xl mx-auto pt-4 flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trade (Plumbing, Electrical) or business name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#38b6ff] shadow-2xl transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-4 brand-gradient hover:opacity-95 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-[#38b6ff]/20 flex items-center justify-center gap-2 text-sm whitespace-nowrap cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Trades</span>
          </button>
        </form>

        {/* Trade Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all border font-medium cursor-pointer ${
                selectedCategory === cat
                  ? "brand-gradient text-slate-950 border-[#38b6ff] font-bold shadow-md shadow-[#38b6ff]/20"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: VERIFIED TRADES DIRECTORY (LIMITED TO 9 TRADERS)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Wrench className="w-6 h-6 text-[#38b6ff]" />
              <span>Verified Featured Traders</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Displaying 9 top-rated local professionals with active travel buffers.
            </p>
          </div>
          <span className="text-xs text-[#38b6ff] font-mono px-3 py-1 bg-[#38b6ff]/10 border border-[#38b6ff]/20 rounded-full self-start sm:self-auto">
            ⚡ 30-min Travel Buffer Active
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : homeTraders.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Traders Found</h3>
            <p className="text-slate-400 text-xs">
              Try selecting a different category or clearing your search filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeTraders.map((trader) => (
              <TraderCard
                key={trader.id}
                trader={trader}
                onChatClick={(t) => setActiveChatTrader(t)}
              />
            ))}
          </div>
        )}

        {/* Interactive Animated "View All Traders" Button */}
        <div className="pt-4 text-center">
          <Link
            href="/all-traders"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 brand-gradient hover:opacity-95 text-slate-950 font-black rounded-2xl text-sm transition-all duration-300 shadow-xl shadow-[#38b6ff]/20 hover:shadow-[#38b6ff]/30 hover:scale-[1.02] cursor-pointer group"
          >
            <span>View All Traders ({traders.length} Available)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW TRADESLOT WORKS (3-STEP WORKFLOW)
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">
            How TradeSlot Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Zero friction booking in 3 automated steps for customers and local service professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] flex items-center justify-center mx-auto text-xl font-black">
              01
            </div>
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#38b6ff]" />
              <span>AI Chatbot Intake</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your repair issue or service request via Web Chatbot. The AI extracts service address, duration, and urgency.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-[#8c52ff]/10 border border-[#8c52ff]/20 text-[#8c52ff] flex items-center justify-center mx-auto text-xl font-black">
              02
            </div>
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-[#8c52ff]" />
              <span>Smart Travel Buffer</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our scheduling engine automatically reserves a 30-minute travel buffer before & after each job to guarantee punctual arrivals.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] flex items-center justify-center mx-auto text-xl font-black">
              03
            </div>
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5 text-[#38b6ff]" />
              <span>Stripe Direct Checkout</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confirm slot with transparent pricing. Funds are transferred to the trader via Stripe Connect with an automated $5 flat fee split.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: KEY PLATFORM FEATURES & BENEFITS GRID
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#38b6ff] font-mono">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Built For Seamless Trade Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">30-Min Travel Buffer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates double bookings and scheduling stress by guarding travel time between jobs.
            </p>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c52ff]/10 border border-[#8c52ff]/20 text-[#8c52ff] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Channel Chat</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accept job intakes seamlessly across intelligent AI Web widgets and multi-channel backend.
            </p>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Stripe Express Payouts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct earnings transfers to trader bank accounts with transparent $5 flat fee split.
            </p>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#8c52ff]/10 border border-[#8c52ff]/20 text-[#8c52ff] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Postal Area Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configurable daily postal code prefixes ensuring tradespeople work within preferred zones.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER & TRADER TESTIMONIALS
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Trusted By Property Owners & Tradespeople
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real feedback from early platform adopters in Central & Greater London.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-1 text-[#38b6ff]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#38b6ff]" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &quot;The 30-minute travel buffer means I never get caught in traffic and arrive late to clients. My bookings are smooth and stress-free.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-8 h-8 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] font-bold flex items-center justify-center text-xs">
                AP
              </div>
              <div>
                <div className="text-xs font-bold text-white">Arthur Pendleton</div>
                <div className="text-[10px] text-slate-500">Master Plumber, SW1</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-1 text-[#38b6ff]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#38b6ff]" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &quot;I booked an electrician via the Web Chatbot within 2 minutes. The instant price estimate and confirmation gave me complete peace of mind.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-8 h-8 rounded-full bg-[#8c52ff]/10 text-[#8c52ff] font-bold flex items-center justify-center text-xs">
                SL
              </div>
              <div>
                <div className="text-xs font-bold text-white">Sarah Lawson</div>
                <div className="text-[10px] text-slate-500">Homeowner, EC1</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center gap-1 text-[#38b6ff]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#38b6ff]" />
              ))}
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              &quot;Stripe Connect payouts are instant and the $5 flat fee split is completely transparent. The best scheduling tool for independent trades.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
              <div className="w-8 h-8 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] font-bold flex items-center justify-center text-xs">
                ER
              </div>
              <div>
                <div className="text-xs font-bold text-white">Elena Rostova</div>
                <div className="text-[10px] text-slate-500">Electrician, BrightSpark</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: RICH FOOTER
          ========================================================================= */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div className="space-y-4 md:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#38b6ff] cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#38b6ff]/20">
                  TS
                </div>
                <span>
                  Trade<span className="text-white">Slot</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] border border-[#38b6ff]/20 uppercase">
                  MVP
                </span>
              </Link>
              <p className="text-slate-400 text-xs leading-relaxed">
                Intelligent multi-channel trade booking platform with automated travel buffers and Stripe Connect integration.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm">Platform Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/all-traders" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    All Traders Directory
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Role-Based Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Sign In to Portal
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Trade Categories */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm">Popular Trades</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/all-traders" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Plumbing & Heating
                  </Link>
                </li>
                <li>
                  <Link href="/all-traders" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Electrical & Smart Lighting
                  </Link>
                </li>
                <li>
                  <Link href="/all-traders" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Carpentry & Cabinetry
                  </Link>
                </li>
                <li>
                  <Link href="/all-traders" className="hover:text-[#38b6ff] transition-colors cursor-pointer">
                    Roofing & Guttering
                  </Link>
                </li>
              </ul>
            </div>

            {/* Trust & Guarantee */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm">TradeSlot Security</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8c52ff] shrink-0" />
                  <span>Verified Professional Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#38b6ff] shrink-0" />
                  <span>Stripe Encrypted Payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#8c52ff] shrink-0" />
                  <span>$5 Fixed Flat Platform Fee</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
            <div>
              &copy; {new Date().getFullYear()} TradeSlot Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Cookie Preferences</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Web Chatbot Drawer */}
      {activeChatTrader && (
        <WebChatWidget
          trader={activeChatTrader}
          isOpen={!!activeChatTrader}
          onClose={() => setActiveChatTrader(null)}
        />
      )}
    </div>
  );
}
