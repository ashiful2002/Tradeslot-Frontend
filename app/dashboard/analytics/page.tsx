"use client";

import React from "react";
import { BarChart3, CreditCard } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useGetAllBookings } from "@/hooks/useTradeSlot";

export default function AnalyticsPage() {
  const { data: bookingsRes } = useGetAllBookings();
  const bookings = bookingsRes?.data || [];

  const totalFees = bookings.length * 5.0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <span>Platform Analytics & Financials</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics on platform throughput and fee collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Captured Fee Volume"
          value={`$${totalFees.toFixed(2)} USD`}
          subtitle="$5.00 flat fee per completed booking"
          icon={CreditCard}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />
        <StatCard
          title="Processed Bookings"
          value={bookings.length}
          subtitle="System wide total reservations"
          icon={BarChart3}
          iconColor="text-purple-400"
          valueColor="text-purple-400"
        />
      </div>
    </div>
  );
}
