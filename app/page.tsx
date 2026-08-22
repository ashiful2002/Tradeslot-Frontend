'use client';

import React, { useEffect, useState } from 'react';
import { Bot, Calendar, Clock, MapPin, Search, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react';
import { traderService } from '@/services/trader.service';
import { Trader } from '@/types';
import WebChatWidget from '@/components/chatbot/WebChatWidget';

export default function HomePage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChatTrader, setActiveChatTrader] = useState<Trader | null>(null);

  const fetchTraders = async () => {
    setIsLoading(true);
    try {
      const res = await traderService.getAllTraders({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        searchTerm: searchTerm.trim() || undefined,
      });
      if (res.data) {
        setTraders(res.data);
      }
    } catch (err) {
      console.warn('Error fetching traders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTraders();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTraders();
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 gradient-glow pointer-events-none -z-10" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Channel Booking Platform for Tradespeople</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Find, Chat, & Book Local Tradespeople <span className="text-emerald-400">In Seconds</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Intelligent schedule optimization with 30-minute travel buffers, instant WhatsApp/Web chatbot intake, and automated Stripe Connect payouts.
        </p>

        {/* Search & Category Filter */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto pt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by trade (Plumbing, Heating) or business name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>Search Trades</span>
          </button>
        </form>

        {/* Trade Category Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          {['ALL', 'Plumbing', 'Electrical', 'Heating', 'Carpentry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl transition-all border font-medium ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>Available Verified Traders ({traders.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">30-min Travel Buffer Active</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : traders.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Traders Found</h3>
            <p className="text-slate-400 text-xs">Try selecting a different category or clearing search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traders.map((trader) => (
              <div
                key={trader.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 transition-all space-y-4 flex flex-col justify-between shadow-xl hover:shadow-emerald-500/5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
                        {trader.tradeCategory}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mt-2">
                        {trader.businessName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {trader.user.firstName} {trader.user.lastName}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-400">
                        £{trader.hourlyRate || 65.0}
                        <span className="text-xs text-slate-500 font-normal">/hr</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Excl. £5 platform fee</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {trader.bio || 'Professional trade services with guaranteed quality and fast turnaround.'}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verified Trade</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>30-min Travel Buffer</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <button
                    onClick={() => setActiveChatTrader(trader)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Chat & Book Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating AI Web Chatbot Drawer */}
      {activeChatTrader && (
        <WebChatWidget
          trader={activeChatTrader}
          isOpen={!!activeChatTrader}
          onClose={() => setActiveChatTrader(null)}
        />
      )}
    </div>
  );
}
