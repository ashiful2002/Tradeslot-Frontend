"use client";

import React from "react";
import StripeConnectCard from "@/components/trader/StripeConnectCard";
import { CreditCard, DollarSign } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export default function PayoutsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-400" />
          <span>Stripe Connect & Payouts</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your payout account and track direct customer payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Platform Payout Split"
          value="$5.00 Flat Fee"
          subtitle="Automatic fee split per completed job"
          icon={DollarSign}
          iconColor="text-emerald-400"
          valueColor="text-emerald-400"
        />
        <StatCard
          title="Payout Schedule"
          value="Instant Express"
          subtitle="Direct deposit to linked bank account"
          icon={CreditCard}
          iconColor="text-indigo-400"
          valueColor="text-indigo-400"
        />
      </div>

      <StripeConnectCard />
    </div>
  );
}
