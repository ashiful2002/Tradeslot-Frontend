'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle, MapPin, Navigation, Plus } from 'lucide-react';
import { traderService } from '@/services/trader.service';
import { WorkArea } from '@/types';

type Props = {
  onSuccess?: (workArea: WorkArea) => void;
};

export default function WorkAreaForm({ onSuccess }: Props) {
  const [workDate, setWorkDate] = useState(new Date().toISOString().split('T')[0]);
  const [postalCodePrefix, setPostalCodePrefix] = useState('SW1');
  const [city, setCity] = useState('London');
  const [radiusKm, setRadiusKm] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCodePrefix.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await traderService.setWorkArea({
        workDate,
        postalCodePrefix: postalCodePrefix.trim().toUpperCase(),
        city: city.trim() || undefined,
        radiusKm,
      });

      setMessage(`Work area for postal prefix ${postalCodePrefix.toUpperCase()} saved for ${workDate}!`);
      if (onSuccess && res.data) {
        onSuccess(res.data);
      }
    } catch (err: any) {
      setMessage(`Error: ${err?.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 text-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Set Daily Postal Coverage</h3>
            <p className="text-[11px] text-slate-400">Define coverage prefix area for specific work dates</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Work Date</span>
            </label>
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Postal Code Prefix</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SW1, EC1, E1"
              value={postalCodePrefix}
              onChange={(e) => setPostalCodePrefix(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">City / Region</label>
            <input
              type="text"
              placeholder="e.g. Central London"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Coverage Radius (Km)</label>
            <input
              type="number"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
              message.startsWith('Error')
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isLoading ? 'Saving Coverage Zone...' : 'Save Daily Coverage Area'}</span>
        </button>
      </form>
    </div>
  );
}
