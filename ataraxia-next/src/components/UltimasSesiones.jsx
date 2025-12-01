import React, { useContext, useMemo, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function UltimasSesiones() {
  const { resultados } = useContext(ResultadosContext);
  const sesiones = Array.isArray(resultados?.coach?.sesiones)
    ? resultados.coach.sesiones
    : [];

  const ultimas = useMemo(() => sesiones.slice(0, 3), [sesiones]);
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="rounded-3xl p-5 bg-white/80 backdrop-blur border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-slate-800">Últimas sesiones</h3>
        <span className="text-xs text-slate-500">
          {sesiones.length ? `${sesiones.length} total` : "Sin registros"}
        </span>
      </div>

      {!sesiones.length && (
        <div className="text-sm text-slate-600">
          Todavía no guardaste un resumen. Podés iniciar una conversación y
          tocar “Guardar resumen” desde el chat.
        </div>
      )}

      <div className="space-y-3">
        {ultimas.map((s, i) => (
          <div key={s.id || i} className="rounded-2xl border bg-slate-50">
            <button
              className="w-full text-left p-4 flex items-center justify-between"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div>
                <div className="text-sm text-slate-500">
                  {formatDateTime(s.fechaISO)}
                </div>
                <div className="font-medium text-slate-800">
                  {s.resumen?.slice(0, 90) || "Sesión sin resumen"}
                  {s.resumen && s.resumen.length > 90 ? "…" : ""}
                </div>
                {!!s.tags?.length && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {s.tags.map((t, k) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded-lg bg-white border"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-slate-400 text-sm">
                {openIdx === i ? "▲" : "▼"}
              </span>
            </button>

            {openIdx === i && (
              <div className="px-4 pb-4">
                <div className="rounded-xl bg-white border p-3 text-sm text-slate-700">
                  <div className="font-semibold mb-1">Resumen</div>
                  <p className="whitespace-pre-wrap">{s.resumen || "—"}</p>
                </div>
                {!!s.mensajes?.length && (
                  <details className="mt-2">
                    <summary className="text-sm text-slate-600 cursor-pointer">
                      Ver conversación ({s.mensajes.length})
                    </summary>
                    <div className="mt-2 max-h-52 overflow-auto space-y-2 pr-2">
                      {s.mensajes.map((m, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-semibold">
                            {m.autor === "coach" ? "Coach: " : "Usuario: "}
                          </span>
                          <span className="text-slate-700">{m.texto}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
