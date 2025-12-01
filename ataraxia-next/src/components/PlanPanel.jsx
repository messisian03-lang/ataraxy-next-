import React, { useContext, useEffect, useMemo, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { CheckCircle2, Circle, Clipboard, Link as LinkIcon, CalendarClock, ListChecks, Flame, Download, CheckCheck } from "lucide-react";
import { planHash } from "../utils/planHash";
import { planToICS, downloadICS } from "../utils/ics";

const focusMap = {
  enfoque:     { label: "Enfoque",     tone: "from-sky-300 to-cyan-500" },
  creatividad: { label: "Creatividad", tone: "from-fuchsia-300 to-pink-500" },
  hábitos:     { label: "Hábitos",     tone: "from-emerald-300 to-teal-500" },
  resiliencia: { label: "Resiliencia", tone: "from-amber-300 to-orange-500" },
  memoria:     { label: "Memoria",     tone: "from-indigo-300 to-blue-500" },
  velocidad:   { label: "Velocidad",   tone: "from-lime-300 to-emerald-500" },
};

export default function PlanPanel() {
  const { resultados, setResultados } = useContext(ResultadosContext) || {};
  const plan = resultados?.coach?.lastPlan || null;

  const [done, setDone] = useState({});
  const [lsKey, setLsKey] = useState("");

  // map de foco
  const focus = useMemo(() => {
    const f = String(plan?.focus_area || "").toLowerCase();
    return focusMap[f] || { label: plan?.focus_area || "Foco", tone: "from-slate-300 to-slate-500" };
  }, [plan]);

  // clave estable por plan para persistir checks
  useEffect(() => {
    if (!plan) return;
    const key = planHash(plan);
    setLsKey(key);
    try {
      const raw = localStorage.getItem(`${key}:done`);
      setDone(raw ? JSON.parse(raw) : {});
    } catch { setDone({}); }
  }, [plan]);

  // persistir cuando cambia
  useEffect(() => {
    if (!lsKey) return;
    try { localStorage.setItem(`${lsKey}:done`, JSON.stringify(done)); } catch {}
  }, [done, lsKey]);

  const toggle = (idx) => setDone((d) => ({ ...d, [idx]: !d[idx] }));
  const allChecked = useMemo(() => {
    const steps = Array.isArray(plan?.plan) ? plan.plan.length : 0;
    if (!steps) return false;
    for (let i = 0; i < steps; i++) if (!done[i]) return false;
    return true;
  }, [done, plan]);

  const copyPlan = async () => {
    try {
      const lines = [];
      if (plan?.message_to_user) lines.push(plan.message_to_user);
      if (plan?.focus_area) lines.push(`Foco: ${plan.focus_area}`);
      if (Array.isArray(plan?.plan)) {
        lines.push("Pasos:");
        plan.plan.forEach((p, i) => {
          const mins = p.duration_min ? ` (${p.duration_min}′)` : "";
          const why = p.why ? ` — ${p.why}` : "";
          lines.push(`  ${i + 1}. ${p.step}${mins}${why}`);
        });
      }
      if (plan?.habit?.name) lines.push(`Hábito: ${plan.habit.name} (${plan.habit.cadence || ""})`);
      if (plan?.reflection_prompt) lines.push(`Reflexión: ${plan.reflection_prompt}`);
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {}
  };

  const exportTXT = () => {
    const parts = [];
    parts.push(`Plan Ataraxia — ${plan?.focus_area || "Foco"}`);
    if (plan?.message_to_user) parts.push(plan.message_to_user);
    if (Array.isArray(plan?.plan)) {
      parts.push("");
      plan.plan.forEach((p, i) => {
        const ok = done[i] ? "[x]" : "[ ]";
        parts.push(`${ok} ${i + 1}. ${p.step}${p.duration_min ? ` (${p.duration_min}′)` : ""}${p.why ? ` — ${p.why}` : ""}`);
      });
    }
    if (plan?.habit?.name) parts.push(`\nHábito: ${plan.habit.name} ${plan.habit.cadence ? `— ${plan.habit.cadence}` : ""}`);
    if (plan?.reflection_prompt) parts.push(`Reflexión: ${plan.reflection_prompt}`);

    const blob = new Blob([parts.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "plan_ataraxia.txt" });
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const exportICS = () => {
    try {
      const ics = planToICS(plan);
      downloadICS("plan_ataraxia.ics", ics);
    } catch {}
  };

  const markCompleted = () => {
    if (!setResultados || !plan) return;
    setResultados(prev => {
      const prevCoach = prev?.coach || {};
      const completed = Array.isArray(prevCoach.completed) ? prevCoach.completed : [];
      const snapshot = {
        id: lsKey || planHash(plan),
        dateISO: new Date().toISOString(),
        plan
      };
      return {
        ...(prev || {}),
        coach: { ...prevCoach, completed: [snapshot, ...completed] }
      };
    });
  };

  if (!plan) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-5 h-5 opacity-80" />
          <h3 className="text-sm font-semibold">Plan de hoy</h3>
        </div>
        <p className="text-sm opacity-80">
          Chateá con Maia y acá vas a ver el plan en formato checklist (pasos, hábito, reflexión y fuentes si hay).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r ${focus.tone} text-black`}>
            <Flame className="w-3.5 h-3.5" />
            <span>{focus.label}</span>
          </div>
          {plan.message_to_user && (
            <p className="mt-2 text-base leading-relaxed">{plan.message_to_user}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyPlan}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition text-[13px]"
            title="Copiar plan"
          >
            <Clipboard className="w-4 h-4" /> Copiar
          </button>
          <button
            onClick={exportTXT}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition text-[13px]"
            title="Exportar .txt"
          >
            <Download className="w-4 h-4" /> .txt
          </button>
          <button
            onClick={exportICS}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/15 transition text-[13px]"
            title="Añadir al calendario (.ics)"
          >
            <CalendarClock className="w-4 h-4" /> .ics
          </button>
        </div>
      </div>

      {Array.isArray(plan.plan) && plan.plan.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="w-4 h-4 opacity-80" />
            <h4 className="text-sm font-semibold">Pasos (2–30′)</h4>
          </div>
          <ul className="space-y-2">
            {plan.plan.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <button onClick={() => toggle(i)} className="mt-0.5" aria-label={`Marcar paso ${i+1}`}>
                  {done[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-white/60" />}
                </button>
                <div className="text-sm leading-relaxed">
                  <div className="font-medium">{p.step}</div>
                  <div className="text-white/80 text-[12px]">
                    {p.duration_min ? <span>{p.duration_min}′</span> : null}
                    {p.duration_min && p.why ? <span> • </span> : null}
                    {p.why ? <span>{p.why}</span> : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.habit?.name && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="w-4 h-4 opacity-80" />
            <h4 className="text-sm font-semibold">Hábito sugerido</h4>
          </div>
          <p className="text-sm">
            <span className="font-medium">{plan.habit.name}</span>
            {plan.habit.cadence ? <span className="opacity-80"> — {plan.habit.cadence}</span> : null}
            {plan.habit.start ? <span className="opacity-80"> • inicio: {plan.habit.start}</span> : null}
          </p>
        </div>
      )}

      {plan.reflection_prompt && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-[12px] opacity-75 mb-1">Reflexión</div>
          <p className="text-sm">{plan.reflection_prompt}</p>
        </div>
      )}

      {Array.isArray(plan.sources) && plan.sources.length > 0 && (
        <div className="mt-4">
          <div className="text-[12px] opacity-75 mb-1">Fuentes</div>
          <ul className="text-[13px] space-y-1">
            {plan.sources.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 opacity-70" />
                <span className="truncate">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <button
          onClick={markCompleted}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
            allChecked
              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
              : "bg-white/10 hover:bg-white/15 text-white border-white/20"
          }`}
          title="Guardar en historial"
        >
          <CheckCheck className="w-4 h-4" />
          Marcar plan como completado
        </button>
      </div>
    </div>
  );
}
