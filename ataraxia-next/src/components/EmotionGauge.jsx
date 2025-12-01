import React from "react";

export default function EmotionGauge({ value = 50, accent = "#EC4899" }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>Calmado</span>
        <span>Equilibrado</span>
        <span>Activo</span>
      </div>
      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
        <div
          className="h-full transition-all"
          style={{
            width: `${v}%`,
            background:
              `linear-gradient(90deg, #22d3ee 0%, ${accent} 100%)`,
          }}
        />
        <div
          className="absolute -top-1 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent"
          style={{
            left: `calc(${v}% - 4px)`,
            borderBottomColor: accent,
          }}
        />
      </div>
      <div className="mt-1 text-xs text-slate-600">
        Nivel actual: <span className="font-semibold">{Math.round(v)}</span>/100
      </div>
    </div>
  );
}
