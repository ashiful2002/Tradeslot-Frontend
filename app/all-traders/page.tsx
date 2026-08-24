"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Trader } from "@/types";
import TraderCard from "@/components/ui/TraderCard";
import WebChatWidget from "@/components/chatbot/WebChatWidget";
import { useGetAllTraders } from "@/hooks/useTradeSlot";

const CATEGORIES = [
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
  "Handyman",
  "Masonry",
  "Glazing",
  "Solar Installation",
  "Flooring",
  "Cleaning",
  "Appliance Repair",
  "Plastering",
  "Security Systems",
  "Pest Control",
];

const ITEMS_PER_PAGE = 9;

export default function AllTradersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeChatTrader, setActiveChatTrader] = useState<Trader | null>(null);

  // Fetch all traders using TanStack Query
  const { data: tradersRes, isLoading } = useGetAllTraders({
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    searchTerm: searchTerm.trim() || undefined,
  });

  const traders = useMemo(() => tradersRes?.data || [], [tradersRes]);

  // Reset to page 1 on category/search change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(traders.length / ITEMS_PER_PAGE) || 1;
  const paginatedTraders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return traders.slice(start, start + ITEMS_PER_PAGE);
  }, [traders, currentPage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#38b6ff] selection:text-slate-950">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 gradient-glow pointer-events-none -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Back Navigation */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#38b6ff] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#8c52ff]" />
                <span>Complete Trade Network Directory</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <Wrench className="w-8 h-8 text-[#38b6ff]" />
                <span>Explore All Verified Traders</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Browse our verified service professionals, filter by specialization, and book 30-minute buffer-protected slots instantly.
              </p>
            </div>

            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-right self-start md:self-auto shrink-0">
              <div className="text-xl font-black text-[#38b6ff] font-mono">
                {traders.length} Traders
              </div>
              <div className="text-[10px] text-slate-500">
                Verified & Slot Ready
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="space-y-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by business name or trade..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#38b6ff] transition-all font-medium"
              />
            </div>

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-2xl transition-all cursor-pointer whitespace-nowrap"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Trade Category Tabs */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Filter className="w-3.5 h-3.5 text-[#38b6ff]" />
              <span>Filter by Specialization Category:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "brand-gradient text-slate-950 border-[#38b6ff] font-bold shadow-md shadow-[#38b6ff]/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="h-64 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : paginatedTraders.length === 0 ? (
          <div className="p-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <Wrench className="w-16 h-16 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Matching Traders Found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              We couldn&apos;t find any verified traders matching your search criteria. Try choosing another trade category or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-6 py-2.5 brand-gradient hover:opacity-90 text-slate-950 font-bold rounded-2xl text-xs transition-all cursor-pointer shadow-lg shadow-[#38b6ff]/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTraders.map((trader) => (
              <TraderCard
                key={trader.id}
                trader={trader}
                onChatClick={(t) => setActiveChatTrader(t)}
              />
            ))}
          </div>
        )}

        {/* Interactive Pagination Section */}
        {totalPages > 1 && (
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="text-xs text-slate-400">
              Showing{" "}
              <strong className="text-white">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, traders.length)}
              </strong>{" "}
              of <strong className="text-[#38b6ff]">{traders.length}</strong> traders
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      currentPage === p
                        ? "brand-gradient text-slate-950 border-[#38b6ff] shadow-md shadow-[#38b6ff]/20"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

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
