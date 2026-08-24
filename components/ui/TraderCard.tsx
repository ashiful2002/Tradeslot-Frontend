"use client";

import React from "react";
import { Bot, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Trader } from "@/types";

type TraderCardProps = {
  trader: Trader;
  onChatClick: (trader: Trader) => void;
};

export default function TraderCard({ trader, onChatClick }: TraderCardProps) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-[#38b6ff]/40 rounded-3xl p-6 transition-all duration-300 space-y-4 flex flex-col justify-between shadow-xl hover:shadow-[#38b6ff]/10 group hover:-translate-y-1">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] border border-[#38b6ff]/20 text-[10px] font-semibold uppercase tracking-wider">
              {trader.tradeCategory}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-[#38b6ff] transition-colors mt-2">
              {trader.businessName}
            </h3>
            <p className="text-xs text-slate-400">
              {trader.user?.firstName} {trader.user?.lastName}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xl font-black text-[#38b6ff]">
              ${trader.hourlyRate || 65.0}
              <span className="text-xs text-slate-500 font-normal">/hr</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Excl. $5 fee</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {trader.bio ||
            "Professional trade services with guaranteed quality and fast turnaround."}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#8c52ff]" />
            <span>Verified Trade</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#38b6ff]" />
            <span>30-min Buffer</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={() => onChatClick(trader)}
          className="w-full py-3.5 btn-primary rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#38b6ff]/10 cursor-pointer active:scale-98"
        >
          <Bot className="w-4 h-4" />
          <span>Instant AI Chat & Book</span>
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
