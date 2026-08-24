"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type StatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success" | "info";
};

export default function StatusModal({
  isOpen,
  onClose,
  title,
  message,
  type = "error",
}: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          {type === "error" && (
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
          )}
          {type === "success" && (
            <div className="w-11 h-11 rounded-2xl bg-[#38b6ff]/10 border border-[#38b6ff]/20 text-[#38b6ff] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
          {type === "info" && (
            <div className="w-11 h-11 rounded-2xl bg-[#8c52ff]/10 border border-[#8c52ff]/20 text-[#8c52ff] flex items-center justify-center shrink-0">
              <Info className="w-6 h-6" />
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-mono">TradeSlot Platform Notification</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 brand-gradient hover:opacity-90 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-[#38b6ff]/20"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
