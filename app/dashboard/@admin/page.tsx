"use client";

import React from "react";
import {
  BarChart3,
  Calendar,
  CreditCard,
  RefreshCw,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useGetAllBookings, useGetAllTraders } from "@/hooks/useTradeSlot";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

export default function AdminParallelDashboard() {
  const { data: bookingsRes, isLoading: isBookingsLoading, refetch: refetchBookings } =
    useGetAllBookings();
  const { data: tradersRes, refetch: refetchTraders } = useGetAllTraders();

  const bookings = bookingsRes?.data || [];
  const traders = tradersRes?.data || [];

  const handleRefresh = () => {
    refetchBookings();
    refetchTraders();
  };

  const totalPlatformFees = bookings.length * 5.0; // $5.00 flat fee per booking

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="Platform system wide"
          icon={Calendar}
          iconColor="text-purple-400"
          valueColor="text-white"
        />

        <StatCard
          title="Active Traders"
          value={traders.length}
          subtitle="Verified service providers"
          icon={Wrench}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />

        <StatCard
          title="Captured Platform Fees"
          value={`$${totalPlatformFees.toFixed(2)} USD`}
          subtitle="$5.00 flat fee per booking"
          icon={CreditCard}
          iconColor="text-teal-400"
          valueColor="text-teal-400"
        />

        <StatCard
          title="System Health"
          value="100% OK"
          subtitle="Operational status"
          icon={ShieldAlert}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />
      </div>

      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Platform Administration Oversight
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Global system analytics, Stripe fee collection monitoring, and platform user controls.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5 text-purple-400" />}
          className="cursor-pointer self-start"
        >
          Refresh Analytics
        </Button>
      </div>

      {/* All Bookings Oversight Table */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>Global Platform Activity Stream</span>
        </h3>

        {isBookingsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-slate-950 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No platform bookings recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Trader</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Quoted Fee</th>
                  <th className="p-3 text-right">Platform Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono text-purple-300">
                      {b.id.substring(0, 8)}...
                    </td>
                    <td className="p-3 font-semibold text-white">
                      {b.trader?.businessName || "Trader"}
                    </td>
                    <td className="p-3 text-slate-400">
                      {b.customer?.user
                        ? `${b.customer.user.firstName} ${b.customer.user.lastName}`
                        : "Guest"}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">${b.quotedAmount}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      $5.00
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
