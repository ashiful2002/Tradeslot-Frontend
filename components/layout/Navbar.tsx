"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  UserPlus,
  Wrench,
} from "lucide-react";
import { authService } from "@/services/auth.service";
import { User as UserType } from "@/types";
import { useGetMe, useLogout } from "@/hooks/useTradeSlot";
import LogoutModal from "@/components/ui/LogoutModal";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { data: meRes } = useGetMe();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (meRes?.data) {
      setCurrentUser(meRes.data);
    } else {
      setCurrentUser(authService.getCurrentUser());
    }
  }, [meRes]);

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (_err) {
      // Fallback
    } finally {
      setCurrentUser(null);
      setIsLogoutModalOpen(false);
      window.location.href = "/";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#38b6ff] cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#38b6ff]/20">
              TS
            </div>
            <span className="font-extrabold text-white">
              Trade<span className="text-[#38b6ff]">Slot</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-[#38b6ff]/10 text-[#38b6ff] border border-[#38b6ff]/20 uppercase font-mono">
              MVP
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className="hover:text-[#38b6ff] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#38b6ff]" />
              <span>Find Traders</span>
            </Link>

            {/* Dashboard link only visible to authenticated logged-in users */}
            {currentUser && (
              <Link
                href="/dashboard"
                className="hover:text-[#8c52ff] transition-colors flex items-center gap-1.5 text-[#8c52ff] font-bold cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                {/* Profile Avatar Navigates to /dashboard/profile */}
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity"
                  title="View My Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 group-hover:border-[#38b6ff] flex items-center justify-center text-slate-300 group-hover:text-[#38b6ff] text-xs font-semibold transition-colors">
                    {currentUser.firstName?.[0] || "U"}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-medium text-white group-hover:text-[#38b6ff] transition-colors">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-[10px] text-[#8c52ff] font-mono font-semibold">
                      {currentUser.role}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  disabled={logoutMutation.isPending}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-900 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 pl-4 border-l border-slate-800">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 hover:border-[#38b6ff]/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#38b6ff]" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl brand-gradient hover:opacity-90 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-[#38b6ff]/20 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Alert Dialog Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isPending={logoutMutation.isPending}
      />
    </>
  );
}
