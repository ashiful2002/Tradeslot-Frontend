"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { User as UserType } from "@/types";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-400"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            TS
          </div>
          <span>
            Trade<span className="text-white">Slot</span>
          </span>
          <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
            MVP
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-4 h-4" />
            <span>Find Traders</span>
          </Link>

          {currentUser?.role === "TRADER" && (
            <Link
              href="/dashboard/trader"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-teal-300"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Trader Dashboard</span>
            </Link>
          )}

          {currentUser ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                  {currentUser.firstName[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-white">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {currentUser.role}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <button
                onClick={async () => {
                  // Demo Trader Login
                  await authService.login(
                    "trader@tradeslot.com",
                    "password123",
                  );
                  window.location.reload();
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                Demo Trader Login
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
