"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import { useGetAllBookings } from "@/hooks/useTradeSlot";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";

export default function CustomerParallelDashboard() {
  const { data: bookingsRes, isLoading, refetch } = useGetAllBookings();
  const bookings = bookingsRes?.data || [];

  const totalSpent = bookings
    .filter((b) => b.status === "COMPLETED" || b.status === "ACCEPTED")
    .reduce((sum, b) => sum + Number(b.quotedAmount), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Reservations"
          value={bookings.length}
          subtitle="All time trade bookings"
          icon={Calendar}
          iconColor="text-indigo-400"
          valueColor="text-white"
        />
        <StatCard
          title="Active & Pending"
          value={bookings.filter((b) => b.status === "PENDING" || b.status === "ACCEPTED").length}
          subtitle="Upcoming scheduled jobs"
          icon={Clock}
          iconColor="text-amber-400"
          valueColor="text-amber-400"
        />
        <StatCard
          title="Total Spend"
          value={`$${totalSpent.toFixed(2)} USD`}
          subtitle="Confirmed trade payments"
          icon={MapPin}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />
      </div>

      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Customer Portal & Booking History
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            View active trade reservations, travel buffer estimates, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5 text-indigo-400" />}
            className="cursor-pointer"
          >
            Refresh
          </Button>

          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Book New Trade</span>
          </Link>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>My Trade Reservations</span>
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
            <User className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Active Bookings</h4>
            <p className="text-xs text-slate-400">
              Browse our directory of verified tradespeople to schedule your first job.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Find Local Trades
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => {
              const start = new Date(b.scheduledStart);
              const statusColor =
                b.status === "ACCEPTED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : b.status === "PENDING"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : b.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

              return (
                <div
                  key={b.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border font-semibold ${statusColor}`}>
                        {b.status}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {b.trader?.businessName || "Verified Trader"}
                      </span>
                    </div>
                    <span className="font-bold text-indigo-400 text-sm">
                      ${b.quotedAmount} USD
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{start.toLocaleString()} (+{b.bufferMinutes}m travel buffer)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{b.serviceAddress} ({b.servicePostal})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
