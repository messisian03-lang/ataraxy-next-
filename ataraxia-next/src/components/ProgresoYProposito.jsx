import React, { useContext, useMemo } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { Link } from "react-router-dom";

function prettyDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function ProgresoYProposito() {
  const { resultados } = useContext(ResultadosContext);
  const coach = resultados?.coach || {};

  const ultimoCheckin = coach.checkins?.[coach.checkins.length - 1] || coach.checkins?.[0] || null;
  const objetivoActivo = useMemo(
    () => (coach.objetivos || []).find((o) => o.estado === "abierto") || null,
    [coach.objetivos]
  );
  const siguientePaso = coach.suggestedNext || null;

  return (
    <div className="rounded-3xl p-5 border shadow-sm bg-white/70 backdrop-blur space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-slate-800">Progreso & Propósito</h3>
        <Link to="/mapa-habilidades" className="text-sm text-emerald-700 hover:underline">
          Ver mapa →
        </Link>
      </div>

      {/* Último check-in */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-xs text-slate-500 mb-1">Último check-in</div>
        {ultimoCheckin ? (
          <div className="flex items-center justify-between">
            <div className="text-slate-800">
              ánimo <span className="font-semibold">{ultimoCheckin.animo ?? "—"}/5</span>, energía{" "}
              <span className="font-semibold">{ultimoCheckin.energia ?? "—"}/5</span>
              {ultimoCheckin.nota ? <span className="text-slate-500"> — {ultimoCheckin.nota}</span> : null}
            </div>
            <div className="text-xs text-slate-500">{prettyDate(ultimoCheckin.fechaISO)}</div>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">
            Aún no registraste un check-in. Probá escribirle a Maia: <em>“ánimo 3, energía 4”</em>.
          </div>
        )}
      </div>

      {/* Objetivo activo */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-xs text-slate-500 mb-1">Objetivo activo</div>
        {objetivoActivo ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-slate-800 font-medium">{objetivoActivo.texto}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Estado: <span className="font-medium">{objetivoActivo.estado}</span> • Horizonte:{" "}
                {objetivoActivo.horizonte || "2–4 semanas"}
              </div>
            </div>
            <div className="text-xs text-slate-500">{prettyDate(objetivoActivo.creadoISO)}</div>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">
            No hay objetivos activos. Podés pedirle a Maia: <em>“Quiero crear un objetivo”</em>.
          </div>
        )}
      </div>

      {/* Siguiente paso sugerido */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-xs text-slate-500 mb-1">Siguiente paso sugerido</div>
        {siguientePaso ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-slate-800">{siguientePaso.texto}</div>
              {Array.isArray(siguientePaso.tags) && siguientePaso.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {siguientePaso.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-slate-500 whitespace-nowrap">
              {prettyDate(siguientePaso.fechaISO)}
            </div>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">
            Aún no hay sugerencias. Chateá con Maia y pedile algo concreto, por ejemplo:{" "}
            <em>“Estoy trabado con X, ¿qué primer paso me sugerís?”</em>
          </div>
        )}
      </div>
    </div>
  );
}

