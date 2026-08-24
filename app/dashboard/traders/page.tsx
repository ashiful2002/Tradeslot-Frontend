"use client";

import React from "react";
import { useGetAllTraders } from "@/hooks/useTradeSlot";
import { Wrench } from "lucide-react";

export default function VerifiedTradersPage() {
  const { data: tradersRes, isLoading } = useGetAllTraders();
  const traders = tradersRes?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-400" />
          <span>Verified Platform Traders</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Directory of all onboarded service providers on TradeSlot.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : traders.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          No verified traders registered yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {traders.map((t) => (
            <div
              key={t.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">
                  {t.businessName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                  {t.tradeCategory}
                </span>
              </div>
              <p className="text-slate-400">
                Hourly Rate: <strong className="text-white">${t.hourlyRate}/hr</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
