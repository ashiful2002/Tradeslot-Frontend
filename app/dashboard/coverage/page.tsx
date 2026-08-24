"use client";

import React from "react";
import WorkAreaForm from "@/components/trader/WorkAreaForm";
import { useGetWorkAreas } from "@/hooks/useTradeSlot";
import { MapPin, Navigation } from "lucide-react";

export default function CoveragePage() {
  const { data: workAreasRes, refetch } = useGetWorkAreas();
  const workAreas = workAreasRes?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-teal-400" />
          <span>Postal Work Area Coverage</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Set up daily coverage prefixes and travel radii for intelligent slot matching.
        </p>
      </div>

      <WorkAreaForm onSuccess={() => refetch()} />

      <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Active Coverage Zones ({workAreas.length})</span>
        </h2>

        {workAreas.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-500">
            No work area coverage zones added yet. Use the form above to add postal code prefixes.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {workAreas.map((wa) => (
              <div
                key={wa.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-teal-400 text-sm">
                    {wa.postalCodePrefix}
                  </span>
                  <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full">
                    {wa.radiusKm}km radius
                  </span>
                </div>
                <div className="text-slate-300">
                  {wa.city || "Region Coverage"}
                </div>
                <div className="text-[11px] text-slate-500">
                  Date: {new Date(wa.workDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
