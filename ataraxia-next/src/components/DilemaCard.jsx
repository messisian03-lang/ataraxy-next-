import React, { useState } from "react";
import useSound from "../hooks/useSound";

export default function DilemaCard({
  etapa = 1,
  total = 5,
  titulo,
  situacion,
  pregunta,
  opciones = [],
  accent = "#3B82F6",
  onElegir,
}) {
  const [selected, setSelected] = useState(null);
  const { play } = useSound();

  const handle = (opt) => {
    setSelected(opt.key);
    play("select");
    setTimeout(() => {
      play("advance");
      onElegir?.(opt);
    }, 250);
  };

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border shadow-sm relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 400px at 10% -10%, #DBEAFE55 0%, transparent 60%), radial-gradient(1200px 400px at 110% 110%, #C7F9E655 0%, transparent 60%), linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
        borderColor: "#e5e7eb",
      }}
    >
      {/* patrón sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "#0ea5e9",
        }}
      />

      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="text-lg font-bold text-slate-800">
          Etapa {etapa} de {total} — {titulo}
        </h3>
        <span className="text-sm text-slate-500">Dilema #{etapa}</span>
      </div>

      <div className="grid md:grid-cols-[1.2fr,1fr] gap-6 relative">
        <div>
          <p className="text-slate-700 mb-3">
            <span className="font-semibold">Situación:</span> {situacion}
          </p>
          <p className="text-slate-700 mb-5">
            <span className="font-semibold">Pregunta:</span> {pregunta}
          </p>

          <div className="grid gap-3">
            {opciones.map((opt) => {
              const isSel = selected === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handle(opt)}
                  onMouseEnter={() => play("hover")}
                  className={`text-left px-4 py-3 rounded-xl border transition-all relative overflow-hidden ${
                    isSel ? "scale-[0.99]" : "hover:-translate-y-[1px] hover:shadow"
                  }`}
                  style={{
                    background: "linear-gradient(180deg, #FFFFFF 0%, #FBFEFF 100%)",
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
                      {opt.hint && (
                        <p className="text-xs text-slate-600 mt-1">{opt.hint}</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip del coach */}
        <div className="rounded-2xl p-4 bg-slate-50 border">
          <p className="text-sm text-slate-600">
            <span className="font-semibold">Tip del coach:</span> Buscá equilibrio entre
            resultados y clima del equipo. La decisión ideal comunica, distribuye y cuida la motivación.
          </p>
          <div className="mt-4 text-xs text-slate-500">
            Seleccioná una opción para continuar automáticamente.
          </div>
        </div>
      </div>
    </div>
  );
}
