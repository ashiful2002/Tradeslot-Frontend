"use client";

import React from "react";
import { useGetAllBookings } from "@/hooks/useTradeSlot";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function CustomerReservationsPage() {
  const { data: bookingsRes, isLoading } = useGetAllBookings();
  const bookings = bookingsRes?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>My Trade Reservations</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed list of all your scheduled tradesperson bookings.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          No trade reservations found.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">
                  {b.trader?.businessName || "Verified Trader"}
                </span>
                <span className="font-bold text-emerald-400 text-sm">
                  ${b.quotedAmount} USD
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{new Date(b.scheduledStart).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{b.serviceAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
