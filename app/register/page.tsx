"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";
import { useRegister } from "@/hooks/useTradeSlot";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "TRADER">("CUSTOMER");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName || registerMutation.isPending)
      return;

    setErrorMessage(null);

    try {
      await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Registration failed. Please check your information and try again.",
      );
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 gradient-glow pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join TradeSlot Platform</span>
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight">
            Create Your <span className="text-emerald-400">Account</span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm">
            Sign up as a customer or trader to access intelligent booking management.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Choice */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  role === "CUSTOMER"
                    ? "bg-indigo-600/20 border-indigo-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <User className="w-5 h-5 text-indigo-400" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("TRADER")}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                  role === "TRADER"
                    ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                <Wrench className="w-5 h-5 text-emerald-400" />
                <span>Tradesperson</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2"
          >
            <span>
              {registerMutation.isPending
                ? "Creating Account..."
                : "Create Account & Sign In"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Login */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="text-emerald-400 font-bold hover:underline"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
