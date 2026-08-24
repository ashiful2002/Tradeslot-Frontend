"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  XCircle,
} from "lucide-react";
import StripeConnectCard from "@/components/trader/StripeConnectCard";
import WorkAreaForm from "@/components/trader/WorkAreaForm";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import { BookingStatus } from "@/types";
import {
  useGetAllBookings,
  useGetTraderProfile,
  useGetWorkAreas,
  useUpdateBookingStatus,
} from "@/hooks/useTradeSlot";

export default function TraderParallelDashboard() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "ALL">("ALL");

  // TanStack Query Hooks
  const { data: profileRes } = useGetTraderProfile();
  const {
    data: bookingsRes,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useGetAllBookings();
  const {
    data: workAreasRes,
    refetch: refetchWorkAreas,
  } = useGetWorkAreas();

  const updateBookingStatusMutation = useUpdateBookingStatus();

  const bookings = bookingsRes?.data || [];
  const workAreas = workAreasRes?.data || [];
  const trader = profileRes?.data;

  const handleRefresh = () => {
    refetchBookings();
    refetchWorkAreas();
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: BookingStatus,
  ) => {
    try {
      await updateBookingStatusMutation.mutateAsync({
        id: bookingId,
        status: newStatus,
      });
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

  // Derive Overview Stats
  const totalEarnings = bookings
    .filter((b) => b.status === "COMPLETED" || b.status === "ACCEPTED")
    .reduce((sum, b) => sum + (Number(b.quotedAmount) - 5), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Earnings (Net)"
          value={`$${totalEarnings.toFixed(2)} USD`}
          subtitle="Net payouts after $5.00 platform fee"
          icon={Calendar}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />
        <StatCard
          title="Active Requests"
          value={bookings.filter((b) => b.status === "PENDING" || b.status === "ACCEPTED").length}
          subtitle="Pending and accepted jobs"
          icon={Clock}
          iconColor="text-amber-400"
          valueColor="text-amber-400"
        />
        <StatCard
          title="Hourly Service Rate"
          value={`$${trader?.hourlyRate || 85} / hr`}
          subtitle="Base rate per hour"
          icon={MapPin}
          iconColor="text-teal-400"
          valueColor="text-white"
        />
      </div>

      {/* Dashboard Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Trader Workspace & Schedule
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Manage daily coverage zones, travel buffers, and Stripe Connect payouts.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5 text-emerald-400" />}
          className="cursor-pointer"
        >
          Refresh Data
        </Button>
      </div>

      {/* Top Grid: Stripe Connect Payouts & Work Area Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StripeConnectCard />
        <WorkAreaForm onSuccess={() => handleRefresh()} />
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
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Booking Requests & Schedule ({filteredBookings.length})</span>
          </h3>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {(
              ["ALL", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg transition-all font-medium cursor-pointer ${
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

        {isBookingsLoading ? (
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
                        ${booking.quotedAmount}{" "}
                        <span className="text-xs text-slate-400">USD</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Platform Fee Captured: $5.00 | Net Payout: $
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
                      <Button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "ACCEPTED")
                        }
                        isLoading={updateBookingStatusMutation.isPending}
                        variant="primary"
                        size="sm"
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="cursor-pointer"
                      >
                        Accept Booking
                      </Button>
                    )}

                    {booking.status === "ACCEPTED" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "COMPLETED")
                        }
                        isLoading={updateBookingStatusMutation.isPending}
                        variant="secondary"
                        size="sm"
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="cursor-pointer"
                      >
                        Mark Completed
                      </Button>
                    )}

                    {booking.status !== "CANCELLED" &&
                      booking.status !== "COMPLETED" && (
                        <Button
                          onClick={() =>
                            handleStatusUpdate(booking.id, "CANCELLED")
                          }
                          isLoading={updateBookingStatusMutation.isPending}
                          variant="danger"
                          size="sm"
                          icon={<XCircle className="w-3.5 h-3.5" />}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
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
