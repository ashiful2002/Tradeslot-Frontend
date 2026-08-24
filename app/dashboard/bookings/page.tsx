"use client";

import React from "react";
import { useGetAllBookings } from "@/hooks/useTradeSlot";
import { Calendar } from "lucide-react";

export default function GlobalBookingsPage() {
  const { data: bookingsRes, isLoading } = useGetAllBookings();
  const bookings = bookingsRes?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          <span>Global Bookings Stream</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete log of all customer booking transactions across the platform.
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
      ) : bookings.length === 0 ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          No booking records found.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-white">
                  Booking #{b.id.substring(0, 8)}
                </div>
                <div className="text-slate-400">
                  Trader: {b.trader?.businessName || "Trader"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-emerald-400">${b.quotedAmount} USD</div>
                <div className="text-[10px] text-slate-500">{b.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
