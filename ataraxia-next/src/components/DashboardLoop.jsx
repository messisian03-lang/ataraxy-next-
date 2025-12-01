// src/components/DashboardLoop.jsx
import React, { useContext, useMemo } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import CheckInCard from "./CheckInCard";
import ReflectionPendingCard from "./ReflectionPendingCard";

function TimelineMini({ data = [] }) {
  const last7 = data.slice(-7);
  if (last7.length === 0) return (
    <div className="text-xs text-slate-500">Sin datos aún. Registrá tu primer check-in ☝️</div>
  );
  return (
    <div className="flex items-end gap-2 h-24">
      {last7.map((d, i) => {
        const avg = Math.round(((d.animo ?? 3) + (d.energia ?? 3)) / 2);
        const h = 10 + avg * 14; // 1..5 → altura
        return (
          <div key={i} className="flex-1">
            <div className="w-full rounded-t-md bg-emerald-500" style={{ height: `${h}px` }} />
            <div className="text-[10px] text-center mt-1 text-slate-500">
              {new Date(d.ts || Date.now()).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardLoop({ onOpenChat }) {
  const { resultados, setResultados } = useContext(ResultadosContext);

  const checkins = resultados?.coach?.checkins || [];
  const pendingReflection = resultados?.coach?.pendingReflection || null;

  const saveCheckin = async ({ animo, energia, nota, ts }) => {
    const next = {
      ...(resultados || {}),
      coach: {
        ...(resultados?.coach || {}),
        checkins: [...checkins, { animo, energia, nota, ts }]
      }
    };
    try { localStorage.setItem("ataraxy_checkins", JSON.stringify(next.coach.checkins)); } catch {}
    setResultados?.(next);
  };

  const stats = useMemo(() => {
    if (checkins.length === 0) return { avgAnimo: "-", avgEnergia: "-" };
    const avg = (k) => (checkins.reduce((a,c)=>a + (Number(c[k])||0), 0) / checkins.length).toFixed(1);
    return { avgAnimo: avg("animo"), avgEnergia: avg("energia") };
  }, [checkins]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <CheckInCard onSave={saveCheckin} />
        <div className="bg-white/80 rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-800">Tu semana en una mirada</h3>
            <div className="text-xs text-slate-600">
              Promedios · ánimo <b>{stats.avgAnimo}</b> · energía <b>{stats.avgEnergia}</b>
            </div>
          </div>
          <div className="mt-3">
            <TimelineMini data={checkins} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <ReflectionPendingCard
          reflection={pendingReflection}
          onResume={() => onOpenChat?.()}
        />
        <div className="bg-white/80 rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="text-xs text-slate-500">Tip</div>
          <p className="text-sm text-slate-800 mt-1">
            Un micro-check-in por día te da mejores devoluciones de Maia y un mapa más preciso.
          </p>
        </div>
      </div>
    </div>
  );
}
