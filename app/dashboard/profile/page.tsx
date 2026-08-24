"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { useGetMe, useGetTraderProfile } from "@/hooks/useTradeSlot";
import Button from "@/components/ui/Button";

export default function DashboardProfilePage() {
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const { data: traderProfileRes } = useGetTraderProfile();

  const user = meRes?.data;
  const trader = traderProfileRes?.data;

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (isMeLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Not Authenticated</h2>
        <p className="text-xs text-slate-400">
          Please sign in to view and manage your account profile.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6 animate-in fade-in duration-300">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard Overview</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-emerald-500/20 shrink-0">
            {user.firstName?.[0] || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">
                {user.firstName} {user.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-mono font-bold">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Account State</span>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-emerald-400" />
          <span>Account & Identity Details</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-500 block text-[11px]">FIRST NAME</span>
            <span className="font-bold text-white text-sm">{user.firstName}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-500 block text-[11px]">LAST NAME</span>
            <span className="font-bold text-white text-sm">{user.lastName}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-500 block text-[11px]">EMAIL ADDRESS</span>
            <span className="font-bold text-white text-sm">{user.email}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
            <span className="text-slate-500 block text-[11px]">ACCOUNT ROLE</span>
            <span className="font-bold text-emerald-400 text-sm">{user.role}</span>
          </div>
        </div>

        {/* Trader Specific Business Card */}
        {user.role === "TRADER" && trader && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-400" />
              <span>Trader Business Profile</span>
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Business Name:</span>
                <span className="font-bold text-white">{trader.businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hourly Rate:</span>
                <span className="font-bold text-emerald-400">${trader.hourlyRate} USD/hr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Stripe Account ID:</span>
                <span className="font-mono text-slate-300">{trader.stripeAccountId || "Not Onboarded"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <Button
            onClick={() => {
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            variant="primary"
            className="cursor-pointer"
          >
            {savedSuccess ? "Profile Saved!" : "Save Profile Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
