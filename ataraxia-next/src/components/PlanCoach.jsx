// src/components/PlanCoach.jsx
import { CheckCircle2, Play, Target } from "lucide-react";

export default function PlanCoach({ data, onApplyHabit, onOpenGame }) {
  if (!data) return null;
  const { message_to_user, plan = [], habit, game_suggestion } = data;

  return (
    <div className="mt-3 rounded-xl border p-3 md:p-4"
         style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.18)" }}>
      {message_to_user && <p className="mb-3 opacity-90">{message_to_user}</p>}

      {plan.length > 0 && (
        <div className="space-y-2">
          {plan.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 mt-0.5 opacity-70" />
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white/10 hover:bg-white/15"
            onClick={() => onApplyHabit?.(habit)}
            title="Crear hábito sugerido"
          >
            <Target className="w-4 h-4" /> Crear hábito: {habit.name}
          </button>
        )}
        {game_suggestion && (
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white/10 hover:bg-white/15"
            onClick={() => onOpenGame?.(game_suggestion)}
            title="Ir al juego sugerido"
          >
            <Play className="w-4 h-4" /> Jugar: {game_suggestion.slug}
          </button>
        )}
      </div>
    </div>
  );
}
