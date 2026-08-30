"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { useLogout } from "@/hooks/useTradeSlot";
import LogoutModal from "@/components/ui/LogoutModal";

type SidebarProps = {
  currentUser: any;
};

export default function DashboardSidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const logoutMutation = useLogout();

  const role = currentUser?.role || "GUEST";

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Fallback
    } finally {
      setIsLogoutModalOpen(false);
      window.location.href = "/";
    }
  };

  // Route mapped nav items per role
  const traderItems = [
    { label: "Schedule & Bookings", icon: Calendar, href: "/dashboard" },
    { label: "Stripe Payouts", icon: CreditCard, href: "/dashboard/payouts" },
    { label: "Postal Work Areas", icon: MapPin, href: "/dashboard/coverage" },
  ];

  const customerItems = [
    { label: "My Trade Reservations", icon: Calendar, href: "/dashboard/reservations" },
    { label: "Book New Trade", icon: Search, href: "/" },
  ];

  const adminItems = [
    { label: "Platform Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Global Bookings Stream", icon: Calendar, href: "/dashboard/bookings" },
    { label: "Verified Traders", icon: Wrench, href: "/dashboard/traders" },
  ];

  const navItems =
    role === "TRADER"
      ? traderItems
      : role === "CUSTOMER"
        ? customerItems
        : role === "ADMIN"
          ? adminItems
          : traderItems;

  return (
    <>
      <aside
        className={`bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between h-[calc(100vh-5rem)] sticky top-20 rounded-3xl p-4 shadow-2xl ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {/* Sidebar Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-white uppercase tracking-wider">
                    Workspace
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {role} PORTAL
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer mx-auto"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Functional Route Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${isActive
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"
                      }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            <Link
              href="/dashboard/profile"
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer mt-2 ${pathname === "/dashboard/profile"
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
            >
              <User
                className={`w-4 h-4 shrink-0 ${pathname === "/dashboard/profile"
                    ? "text-slate-950"
                    : "text-indigo-400"
                  }`}
              />
              {!isCollapsed && <span>My Profile</span>}
            </Link>

            <Link
              href="/"
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer mt-4 border-t border-slate-800/80 pt-4"
            >
              <Home className="w-4 h-4 shrink-0 text-teal-400" />
              {!isCollapsed && <span>Return to Home</span>}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer User Card */}
        {currentUser && (
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div
              className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "justify-between"
                }`}
            >
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2.5 cursor-pointer group"
                title="View Profile"
              >
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 group-hover:border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xs transition-colors">
                  {currentUser.firstName?.[0] || "U"}
                </div>
                {!isCollapsed && (
                  <div className="text-left text-xs">
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate max-w-[110px]">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{currentUser.role}</span>
                    </div>
                  </div>
                )}
              </Link>

              {!isCollapsed && (
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  disabled={logoutMutation.isPending}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Logout Confirmation Alert Dialog */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isPending={logoutMutation.isPending}
      />
    </>
  );
}
