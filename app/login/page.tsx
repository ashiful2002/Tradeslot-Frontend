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
} from "lucide-react";
import { useLogin } from "@/hooks/useTradeSlot";

const DEMO_USERS = [
  {
    label: "Demo Plumber (Arthur Pendelton)",
    email: "trader1@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Electrician (Elena Rostova)",
    email: "trader2@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Heating Specialist (Marcus Vance)",
    email: "trader3@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Carpenter (David Miller)",
    email: "trader4@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Roofer (Sarah Jenkins)",
    email: "trader5@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Painter & Decorator (Carlos Mendoza)",
    email: "trader6@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Landscaper (Oliver Greenwood)",
    email: "trader7@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Tile & Stone Specialist (Sofia Bianchi)",
    email: "trader8@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo 24/7 Locksmith (Jack O'Connor)",
    email: "trader9@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo HVAC Tech (Liam Gallagher)",
    email: "trader10@tradeslot.com",
    password: "password123",
    role: "TRADER",
  },
  {
    label: "Demo Customer (Property Owner)",
    email: "customer@tradeslot.com",
    password: "password123",
    role: "CUSTOMER",
  },
  {
    label: "Demo System Administrator",
    email: "admin@tradeslot.com",
    password: "password123",
    role: "ADMIN",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();

  const handleSelectDemoUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedDemoIndex(val);
    if (val !== "") {
      const idx = parseInt(val, 10);
      const user = DEMO_USERS[idx];
      if (user) {
        setEmail(user.email);
        setPassword(user.password);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loginMutation.isPending) return;

    setErrorMessage(null);

    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res?.data?.user) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
        "Invalid email or password. Please try again or select a demo user.",
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


          <h1 className="text-3xl font-black text-white tracking-tight">
            Welcome Back to <span className="text-emerald-400">TradeSlot</span>
          </h1>


        </div>

        {/* Quick Demo Select Dropdown */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
          <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Account Selector (20 Seeded Traders)</span>
          </label>
          <select
            value={selectedDemoIndex}
            onChange={handleSelectDemoUser}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="">-- Choose Demo Account --</option>
            {DEMO_USERS.map((u, i) => (
              <option key={i} value={i}>
                {u.label} ({u.role})
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Selecting a demo user auto-populates credentials for instant testing.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-medium"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 mt-2 cursor-pointer"
          >
            <span>{loginMutation.isPending ? "Authenticating..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href="/register"
            className="text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
