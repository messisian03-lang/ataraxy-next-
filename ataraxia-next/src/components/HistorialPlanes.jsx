import React, { useContext } from "react";
import { ResultadosContext } from "../context/ResultadosContext";

export default function HistorialPlanes() {
  const { resultados } = useContext(ResultadosContext) || {};
  const items = resultados?.coach?.completed || [];
  if (!items.length) return null;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-4 text-white">
      <div className="text-sm font-semibold mb-2">Planes completados</div>
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={it.id + i} className="border border-white/10 rounded-lg p-3">
            <div className="opacity-75 text-[12px]">{new Date(it.dateISO).toLocaleString()}</div>
            <div className="font-medium">{it.plan?.focus_area || "Foco"}</div>
            <div className="opacity-80 text-[13px] truncate">{it.plan?.message_to_user}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
