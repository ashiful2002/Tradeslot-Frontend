"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useGetMe } from "@/hooks/useTradeSlot";
import { authService } from "@/services/auth.service";
import DashboardSidebar from "@/components/dashboard/Sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  trader: React.ReactNode;
  customer: React.ReactNode;
  admin: React.ReactNode;
};

export default function DashboardParallelLayout({
  children,
  trader,
  customer,
  admin,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: meRes, isLoading } = useGetMe();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (meRes?.data) {
      setCurrentUser(meRes.data);
    } else {
      setCurrentUser(authService.getCurrentUser());
    }
  }, [meRes]);

  const userRole = currentUser?.role;
  const isBaseDashboard = pathname === "/dashboard";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Interactive Accessible Sidebar Block */}
        <DashboardSidebar currentUser={currentUser} />

        {/* Main Dashboard Area */}
        <div className="flex-1 space-y-6">
          {/* Active Slot Header Bar */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black text-white flex items-center gap-2">
                  <span>TradeSlot Interactive Portal</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-mono font-bold">
                    Authenticated Slot
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Role:{" "}
                  {userRole ? (
                    <strong className="text-emerald-400 uppercase font-bold">
                      @{userRole.toLowerCase()} workspace
                    </strong>
                  ) : (
                    <span className="text-amber-400">Unauthenticated</span>
                  )}
                </p>
              </div>
            </div>

            {/* Authenticated User Badge */}
            {currentUser ? (
              <div className="flex items-center gap-3 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-2xl">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  {currentUser.firstName?.[0] || "U"}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span>{currentUser.firstName} {currentUser.lastName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 self-start sm:self-auto cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Access Workspace</span>
              </Link>
            )}
          </div>

          {/* Render Content or Parallel Slot */}
          <main className="min-h-[500px]">
            {isLoading ? (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading workspace data...</p>
              </div>
            ) : !currentUser ? (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                  <LogIn className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">Authentication Required</h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Please sign in to access your role-based dashboard slot (@trader, @customer, or @admin).
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Go to Login Page</span>
                </Link>
              </div>
            ) : isBaseDashboard ? (
              <>
                {userRole === "TRADER"
                  ? trader
                  : userRole === "CUSTOMER"
                    ? customer
                    : userRole === "ADMIN"
                      ? admin
                      : trader}
              </>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
