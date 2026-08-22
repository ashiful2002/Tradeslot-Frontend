"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  ShieldCheck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import StripeConnectCard from "@/components/trader/StripeConnectCard";
import WorkAreaForm from "@/components/trader/WorkAreaForm";
import { bookingService } from "@/services/booking.service";
import { traderService } from "@/services/trader.service";
import { Booking, BookingStatus, Trader, WorkArea } from "@/types";

export default function TraderDashboardPage() {
  const [profile, setProfile] = useState<Trader | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Load Trader Profile
      const profRes = await traderService.getProfile();
      if (profRes.data) {
        setProfile(profRes.data);
      }

      // 2. Load Trader Bookings
      const bookRes = await bookingService.getAllBookings();
      if (bookRes.data) {
        setBookings(bookRes.data);
      }

      // 3. Load Active Work Areas
      const areaRes = await traderService.getWorkAreas();
      if (areaRes.data) {
        setWorkAreas(areaRes.data);
      }
    } catch (err) {
      console.warn("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      loadDashboardData();
    } catch (err: any) {
      alert(
        `Status update failed: ${err?.response?.data?.message || err.message}`,
      );
    }
  };

  const filteredBookings =
    activeTab === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Trader Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase">
              Live MVP
            </span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage daily coverage zones, travel buffers, and Stripe Connect
            payouts.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 self-start"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top Grid: Stripe Connect Payouts & Work Area Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StripeConnectCard />
        <WorkAreaForm onSuccess={() => loadDashboardData()} />
      </div>

      {/* Active Daily Work Area Zones Badge Stream */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Active Work Area Coverage Zones ({workAreas.length})</span>
        </h3>

        {workAreas.length === 0 ? (
          <p className="text-xs text-slate-500">
            No work areas set yet. Use the form above to add daily coverage.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {workAreas.map((wa) => (
              <div
                key={wa.id}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center gap-2 text-slate-300"
              >
                <span className="font-bold text-teal-400">
                  {wa.postalCodePrefix}
                </span>
                <span className="text-slate-500">|</span>
                <span>{new Date(wa.workDate).toLocaleDateString()}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{wa.radiusKm}km radius</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings & Schedule Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <span>Booking Requests & Schedule ({filteredBookings.length})</span>
          </h2>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(
              ["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                  activeTab === tab
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-slate-500">
              Bookings placed via the Web Chatbot will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const start = new Date(booking.scheduledStart);
              const end = new Date(booking.scheduledEnd);
              const statusColor =
                booking.status === "ACCEPTED"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : booking.status === "PENDING"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : booking.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

              return (
                <div
                  key={booking.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 shadow-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold ${statusColor}`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ID: {booking.id.substring(0, 8)}...
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-400">
                        £{booking.quotedAmount}{" "}
                        <span className="text-xs text-slate-400">GBP</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Platform Fee Captured: £5.00 | Net Payout: £
                        {Number(booking.quotedAmount) - 5.0}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">
                        Customer & Address
                      </span>
                      <div className="font-semibold text-white">
                        {booking.customer?.user
                          ? `${booking.customer.user.firstName} ${booking.customer.user.lastName}`
                          : "Guest Customer"}
                      </div>
                      <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {booking.serviceAddress} ({booking.servicePostal})
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">
                        Scheduled Time & Travel Buffer
                      </span>
                      <div className="font-semibold text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          {start.toLocaleDateString()}{" "}
                          {start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-emerald-400/80 text-[11px] mt-0.5">
                        + {booking.bufferMinutes} mins Travel Buffer Reserved
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">
                        Job Notes
                      </span>
                      <div className="text-slate-300 italic">
                        {booking.notes || "No extra notes provided."}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2 text-xs">
                    {booking.status === "PENDING" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "ACCEPTED")
                        }
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Booking</span>
                      </button>
                    )}

                    {booking.status === "ACCEPTED" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "COMPLETED")
                        }
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}

                    {booking.status !== "CANCELLED" &&
                      booking.status !== "COMPLETED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking.id, "CANCELLED")
                          }
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold rounded-xl transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
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
