'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2, CreditCard, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { paymentService } from '@/services/payment.service';

export default function StripeConnectCard() {
  const [status, setStatus] = useState<{
    stripeAccountId: string | null;
    onboardingComplete: boolean;
    detailsSubmitted: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await paymentService.checkConnectStatus();
      if (res.data) {
        setStatus(res.data);
      }
    } catch (err) {
      console.warn('Connect status error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStartOnboarding = async () => {
    setIsGenerating(true);
    try {
      const res = await paymentService.onboardStripeConnect();
      if (res.data?.onboardingUrl) {
        window.location.href = res.data.onboardingUrl;
      }
    } catch (err: any) {
      alert(`Stripe Onboarding Failed: ${err?.response?.data?.message || err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse text-xs text-slate-500">
        Loading Stripe Connect onboarding status...
      </div>
    );
  }

  const isComplete = status?.onboardingComplete;

  return (
    <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <span>Stripe Connect Payouts</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </h3>
            <p className="text-[11px] text-slate-400">Direct earnings payout with automated £5.00 flat platform fee</p>
          </div>
        </div>

        {isComplete ? (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active & Verified</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
            Action Required
          </span>
        )}
      </div>

      <div className="text-xs space-y-2 text-slate-300">
        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Stripe Account ID:</span>
          <span className="font-mono text-indigo-300">{status?.stripeAccountId || 'Not Connected'}</span>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Platform Fee Split:</span>
          <span className="font-medium text-emerald-400">£5.00 flat fee per completed booking</span>
        </div>
      </div>

      {!isComplete ? (
        <button
          onClick={handleStartOnboarding}
          disabled={isGenerating}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <ExternalLink className="w-4 h-4" />
          <span>{isGenerating ? 'Generating Onboarding Link...' : 'Complete Stripe Express Onboarding'}</span>
        </button>
      ) : (
        <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your bank account is linked to receive instant customer payouts after booking acceptance!</span>
        </div>
      )}
    </div>
  );
}
