"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-emerald-400",
  valueColor = "text-white",
}: StatCardProps) {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2 shadow-xl hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold">{title}</span>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className={`text-2xl font-black ${valueColor}`}>{value}</div>
      {subtitle && <div className="text-[11px] text-slate-500">{subtitle}</div>}
    </div>
  );
}
