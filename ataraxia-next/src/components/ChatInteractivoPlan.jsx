// src/components/ChatInteractivoPlan.jsx
// Componente “estacionado”: UI para conversaciones con plan (no se usa ahora).
// Podés montarlo en alguna ruta o tab cuando decidas reactivar el modo plan.

import React, { useMemo, useRef, useState } from "react";
import { askCoach } from "../api/coach";

/** ----------------- Helpers ----------------- **/
const norm = (s = "") => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
const safeStr = (v, max = 280) => String(v ?? "").slice(0, max);

// Normaliza la respuesta del backend en “modo plan”
function normalizePlan(raw) {
  const n = {};
  n.message_to_user = safeStr(raw?.message_to_user || "Ok. Tengo un plan breve para hoy.", 400);
  n.focus_area = safeStr(raw?.focus_area || "enfoque", 40);

  const steps = Array.isArray(raw?.plan) ? raw.plan : [];
  n.plan = steps.slice(0, 6).map((s) => ({
    step: safeStr(s?.step || "Acción", 200),
    why: safeStr(s?.why || "", 200),
    duration_min: Number.isFinite(+s?.duration_min)
      ? Math.max(1, Math.min(60, +s.duration_min))
      : null,
  }));

  n.habit =
    raw?.habit && (raw.habit.name || raw.habit.cadence || raw.habit.start)
      ? {
          name: safeStr(raw.habit.name || "", 120),
          cadence: safeStr(raw.habit.cadence || "", 60),
          start: safeStr(raw.habit.start || "", 40),
        }
      : null;

  n.reflection_prompt = safeStr(raw?.reflection_prompt || "", 280);
  n.sources = Array.isArray(raw?.sources)
    ? raw?.sources.slice(0, 5).map((s) => safeStr(s, 200))
    : [];
  n.game_suggestion = raw?.game_suggestion ?? null;
  return n;
}

/** ----------------- UI del plan ----------------- **/
function PlanPanel({ data, onApplyHabit, onOpenGame }) {
  if (!data) return null;
  const { plan = [], habit, game_suggestion } = data;
  const hasContent = (plan?.length ?? 0) > 0 || !!habit || !!game_suggestion;
  if (!hasContent) return null;

  return (
    <div
      className="mt-3 rounded-xl border p-3 md:p-4 text-slate-900"
      style={{ background: "rgba(255,255,255,0.92)", borderColor: "rgba(15,23,42,0.15)" }}
    >
      {plan.length > 0 && (
        <div className="space-y-2">
          {plan.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-3 w-3 rounded-full bg-emerald-500" />
              <div>
                <div className="text-sm font-semibold">{s.step}</div>
                {s.why && <div className="text-xs opacity-80">¿Por qué? {s.why}</div>}
                {s.duration_min != null && (
                  <div className="text-xs opacity-70">~{s.duration_min} min</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {habit && (
          <button
            className="text-xs px-3 py-1.5 rounded-lg border-slate-300 bg-white hover:bg-slate-50"
            onClick={() => onApplyHabit?.(habit)}
          >
            Crear hábito: {habit.name}
          </button>
        )}
        {game_suggestion && (
          <button
            className="text-xs px-3 py-1.5 rounded-lg border-slate-300 bg-white hover:bg-slate-50"
            onClick={() => onOpenGame?.(game_suggestion)}
          >
            Jugar: {game_suggestion?.slug}
          </button>
        )}
      </div>
    </div>
  );
}

/** ----------------- Componente principal (no montado) ----------------- **/
export default function ChatInteractivoPlan({
  userId = "demo",
  buildExtraContext = () => "",
  onApplyHabit,
  onOpenGame,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [coachText, setCoachText] = useState(""); // mensaje de apertura del coach
  const [plan, setPlan] = useState(null);

  const historyRef = useRef([]);

  const recent = useMemo(
    () => historyRef.current.slice(-10).map((m) => ({ author: m.author, text: m.text })),
    []
  );

  async function handleSend() {
    const texto = input.trim();
    if (!texto || sending) return;
    setInput("");

    // guardar en historial (usuario)
    historyRef.current.push({ author: "user", text: texto });

    // llamada modo plan
    setSending(true);
    try {
      const extraContext = buildExtraContext(); // si querés pasar foco/objetivo
      const resp = await askCoach(texto, userId, recent, {
        preferOllama: true,
        extraContext,
        // 🔽 si lo activás, el backend debe soportar mode:"plan"
        mode: "plan",
      });

      // Mostrar mensaje del coach + panel de plan
      const normalized = normalizePlan(
        typeof resp === "string" ? { message_to_user: resp, plan: [] } : resp || {}
      );
      setCoachText(normalized.message_to_user || "Ok. Tengo un plan breve para hoy.");
      setPlan(normalized);

      // guardar en historial (assistant)
      historyRef.current.push({ author: "assistant", text: normalized.message_to_user || "" });
    } catch (e) {
      console.error("[Plan] error:", e);
      setCoachText("Se cortó la conexión. Probá de nuevo en un momento.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white/70 backdrop-blur p-0 shadow-md overflow-hidden text-slate-900">
      <div className="px-4 py-3 border-b bg-gradient-to-r from-amber-50 to-emerald-50">
        <div className="text-sm font-semibold text-slate-700">Coach Maia — Modo plan (estacionado)</div>
        <div className="text-[11px] text-slate-500">Este componente no está activo en producción.</div>
      </div>

      <div className="p-4 space-y-3">
        {coachText ? (
          <div className="rounded-2xl px-3 py-2 bg-[#F9F6F1] border border-amber-100 shadow-sm">
            {coachText}
          </div>
        ) : (
          <div className="text-sm text-slate-600">
            Escribí un tema o pedido concreto y generamos un plan sugerido.
          </div>
        )}

        {plan && (
          <PlanPanel
            data={plan}
            onApplyHabit={onApplyHabit}
            onOpenGame={onOpenGame}
          />
        )}
      </div>

      <div className="p-3 flex gap-2 border-t bg-white/70">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="¿Qué querés trabajar hoy?"
          className="flex-1 rounded-xl border px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
        />
        <button
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            sending || !input.trim()
              ? "bg-blue-800/40 text-white/60 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {sending ? "Generando…" : "Generar plan"}
        </button>
      </div>
    </div>
  );
}
