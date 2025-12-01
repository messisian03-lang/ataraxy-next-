import React, { useState } from "react";
import EmotionGauge from "./EmotionGauge";

export default function SceneCard({
  escena,
  total,
  titulo,
  situacion,
  pregunta,
  opciones = [],
  nivel = 50,
  accent = "#EC4899",
  onElegir,
  onHoverSound, // opcional
  onSelectSound, // opcional
  onAdvanceSound, // opcional
}) {
  const [sel, setSel] = useState(null);

  const handle = (opt) => {
    setSel(opt.key);
    onSelectSound?.();
    setTimeout(() => {
      onAdvanceSound?.();
      onElegir?.(opt);
    }, 250);
  };

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 400px at 10% -10%, #FBCFE855 0%, transparent 60%), radial-gradient(1200px 400px at 110% 110%, #FDE68A55 0%, transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #FDF2F8 100%)",
        borderColor: "#e5e7eb",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "#ec4899",
        }}
      />
      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="text-lg font-bold text-slate-800">
          Escena {escena} de {total} — {titulo}
        </h3>
        <span className="text-xs text-slate-600">Auto-avance al elegir</span>
      </div>

      <div className="grid md:grid-cols-[1.1fr,1fr] gap-6 relative">
        <div>
          <div className="mb-4">
            <EmotionGauge value={nivel} accent={accent} />
          </div>
          <p className="text-slate-700 mb-3">
            <span className="font-semibold">Situación:</span> {situacion}
          </p>
          <p className="text-slate-800 font-medium mb-5">{pregunta}</p>

          <div className="grid gap-3">
            {opciones.map((opt) => {
              const isSel = sel === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handle(opt)}
                  onMouseEnter={() => onHoverSound?.()}
                  className={`text-left px-4 py-3 rounded-xl border transition-all relative overflow-hidden ${
                    isSel ? "scale-[0.99]" : "hover:-translate-y-[1px] hover:shadow"
                  }`}
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FFF7FB 100%)",
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
                      {typeof opt.delta === "number" && (
                        <p className="text-[11px] mt-1" style={{ color: accent }}>
                          {opt.delta > 0 ? "↑" : opt.delta < 0 ? "↓" : "•"} impacto emocional {opt.delta > 0 ? `+${opt.delta}` : opt.delta}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-slate-50 border">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Tip del coach:</span> Regulá antes de decidir:
            1) respiración 4-4-6, 2) nombra la emoción, 3) elegí la acción más alineada a tu objetivo.
          </p>
          <div className="mt-4 text-xs text-slate-500">
            El medidor refleja el balance emocional en tiempo real.
          </div>
        </div>
      </div>
    </div>
  );
}
