"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, Lock, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { paymentService } from "@/services/payment.service";
import { Booking } from "@/types";

function MockCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  const sessionId = searchParams.get("session_id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [cardName, setCardName] = useState("Demo Customer");

  useEffect(() => {
    if (!bookingId) return;

    bookingService
      .getBookingById(bookingId)
      .then((res) => {
        if (res.data) {
          setBooking(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch booking details:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookingId]);

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || isProcessing) return;

    setIsProcessing(true);

    try {
      // 1. Confirm payment on Express backend
      await paymentService.confirmPayment(bookingId, sessionId || undefined);

      // 2. Direct user straight to Customer Dashboard Bookings view!
      router.push("/dashboard/bookings");
    } catch (err: any) {
      console.warn("Payment Simulation Note:", err);
      router.push("/dashboard/bookings");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-400 font-mono">Loading Stripe Payment Gateway...</div>
      </div>
    );
  }

  const amount = booking?.quotedAmount || 75.0;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
        {/* Stripe Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
              stripe
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                <span>Stripe Test Checkout</span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  DEMO MODE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">TradeSlot Express Direct Settlement</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Total Due</div>
            <div className="text-xl font-black text-emerald-400">${amount} USD</div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Service Provider:</span>
            <span className="font-bold text-white">{booking?.trader?.businessName || "Verified Trader"}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Category:</span>
            <span className="text-slate-300">{booking?.trader?.tradeCategory || "General Trade"}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Service Address:</span>
            <span className="text-slate-300 font-medium">{booking?.serviceAddress || "SW1, London"}</span>
          </div>
          <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-2 mt-2">
            <span>Platform Fee ($5 flat):</span>
            <span className="text-emerald-400 font-mono">Included</span>
          </div>
        </div>

        {/* Demo Payment Form */}
        <form onSubmit={handleSimulatePayment} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
              <span>Card Number</span>
              <span className="text-[10px] text-indigo-400 font-mono">Stripe Test Card</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <CreditCard className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-300">Expires</label>
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-300">CVC</label>
              <input
                type="text"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300">Cardholder Name</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 active:scale-[0.98]"
          >
            {isProcessing ? (
              <span>Processing Payment & Verifying Webhook...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ${amount} USD with Demo Card & Go to Customer Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted 256-bit SSL Connection &bull; Powered by Stripe Connect</span>
        </div>
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-slate-400 text-xs">
          Loading Stripe Checkout Simulator...
        </div>
      }
    >
      <MockCheckoutContent />
    </Suspense>
  );
}
