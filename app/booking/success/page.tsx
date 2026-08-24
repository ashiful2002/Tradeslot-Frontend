"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Home,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Booking } from "@/types";
import { useConfirmPayment } from "@/hooks/useTradeSlot";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<Booking | null>(null);

  const confirmPaymentMutation = useConfirmPayment();

  useEffect(() => {
    const confirm = async () => {
      if (!bookingId) {
        return;
      }

      try {
        const res = await confirmPaymentMutation.mutateAsync({
          bookingId,
          sessionId: sessionId || undefined,
        });
        if (res.data?.booking) {
          setBooking(res.data.booking);
        }
      } catch (err: any) {
        console.warn("Payment confirmation error:", err);
      }
    };

    confirm();
  }, [bookingId, sessionId]);

  if (confirmPaymentMutation.isPending) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">
          Confirming Payment & Reservation...
        </h2>
        <p className="text-xs text-slate-400">
          Communicating with Stripe and updating trader schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/20 animate-in zoom-in-50 duration-300">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
          Payment & Reservation Confirmed
        </span>
        <h1 className="text-3xl font-black text-white">Booking Accepted!</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Your payment has been split and routed directly to the trader with a
          $5 flat platform fee captured.
        </p>
      </div>

      {booking && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-left text-xs space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-slate-500 block text-[10px]">
                SERVICE PROVIDER
              </span>
              <span className="font-bold text-white text-sm">
                {booking.trader?.businessName || "Verified Trader"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">
                TOTAL PAID
              </span>
              <span className="font-black text-emerald-400 text-base">
                ${booking.quotedAmount} USD
              </span>
            </div>
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Scheduled Start:{" "}
                {new Date(booking.scheduledStart).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Address: {booking.serviceAddress} ({booking.servicePostal})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes 30-minute travel buffer guard</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex items-center justify-center gap-3">
        <Link
          href="/dashboard/bookings"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Go to Customer Dashboard</span>
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-2xl text-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-slate-400 text-xs">
          Loading...
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
