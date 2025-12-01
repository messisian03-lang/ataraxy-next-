import React, { useState } from "react";

export default function StationCard({
  estacion,
  titulo,
  descripcion,
  pregunta,
  opciones = [],
  accent = "#10B981",
  onElegir,
}) {
  const [sel, setSel] = useState(null);

  const handle = (opt) => {
    setSel(opt.key);
    setTimeout(() => onElegir?.(opt), 450);
  };

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 400px at 10% -10%, #A7F3D055 0%, transparent 60%), radial-gradient(1200px 400px at 110% 110%, #99F6E455 0%, transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
        borderColor: "#e5e7eb",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "#14b8a6",
        }}
      />

      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="text-lg font-bold text-slate-800">
          Estación {estacion} — {titulo}
        </h3>
        <span className="text-xs text-slate-600">Auto‑avance al elegir</span>
      </div>

      <p className="text-slate-700 mb-2">{descripcion}</p>
      <p className="text-slate-800 font-medium mb-5">{pregunta}</p>

      <div className="grid gap-3 relative">
        {opciones.map((opt) => {
          const isSel = sel === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => handle(opt)}
              className={`text-left px-4 py-3 rounded-xl border transition-all relative overflow-hidden ${
                isSel ? "scale-[0.99]" : "hover:-translate-y-[1px] hover:shadow"
              }`}
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #F7FFFC 100%)",
                borderColor: isSel ? accent : "#e5e7eb",
                boxShadow: isSel ? `0 0 0 2px ${accent}33 inset` : undefined,
              }}
            >
              <span
                aria-hidden
                className="absolute -right-8 -bottom-10 w-40 h-40 rounded-full opacity-20"
                style={{ background: `${accent}` }}
              />
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-sm"
                  style={{ background: `${accent}15`, color: accent }}
                >
                  {opt.icon || "★"}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{opt.label}</p>
                  {opt.hint && <p className="text-xs text-slate-600 mt-1">{opt.hint}</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
