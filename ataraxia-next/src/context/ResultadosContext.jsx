"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  applyRunRewards,
  rollDailyQuests,
  todayKey,
  shouldUnlock,
} from "../gamification/core";

export const ResultadosContext = createContext(null);

// --- helpers seguros para localStorage ---
function safeLocalGet(key) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

// --- COACH ---
function ensureCoach(base) {
  const coachPrev = base.coach || {};
  return {
    ...base,
    coach: {
      objetivos: Array.isArray(coachPrev.objetivos) ? coachPrev.objetivos : [],
      habitos: Array.isArray(coachPrev.habitos) ? coachPrev.habitos : [],
      sesiones: Array.isArray(coachPrev.sesiones) ? coachPrev.sesiones : [],
      checkins: Array.isArray(coachPrev.checkins) ? coachPrev.checkins : [],
      historial: Array.isArray(coachPrev.historial) ? coachPrev.historial : [],
      conversaciones: Array.isArray(coachPrev.conversaciones)
        ? coachPrev.conversaciones
        : [],
      suggestedNext: coachPrev.suggestedNext || null,
      convState: coachPrev.convState || { stage: "encuadre", step: 0 },
      pendingReflection:
        typeof coachPrev.pendingReflection === "string"
          ? coachPrev.pendingReflection
          : null,
      preferences: {
        ...(coachPrev.preferences || {}),
        lastTone: coachPrev.preferences?.lastTone || "equilibrada",
        toneStats:
          coachPrev.preferences?.toneStats || {
            empatica: 0,
            equilibrada: 1,
            directa: 0,
            motivadora: 0,
          },
      },
      __initialized: true,
    },
  };
}

// --- GAMIFICACIÓN ---
function ensureGamificacion(base) {
  const g = base.gamificacion || {};
  const today = todayKey();
  let quests = g.quests;

  if (!quests || quests.date !== today) {
    quests = { date: today, daily: rollDailyQuests(Math.random()) };
  }

  const level = g.level || 1;
  const starsTotal = g.starsTotal || 0;

  return {
    ...base,
    gamificacion: {
      xp: g.xp || 0,
      level,
      coins: g.coins || 0,
      streak: g.streak || { count: 0, last: null },
      starsTotal,
      quests,
      unlocks: g.unlocks || shouldUnlock({ level, starsTotal }),
      __initialized: true,
    },
  };
}

function ensureAll(base) {
  return ensureGamificacion(ensureCoach(base || {}));
}

export function useResultados() {
  return React.useContext(ResultadosContext);
}

// ----------------------------------
// PROVIDER
// ----------------------------------
export function ResultadosProvider({ children }) {
  // Estado inicial seguro para SSR (sin localStorage)
  const [resultados, setResultados] = useState(() => ensureAll({}));

  // Cargar desde localStorage cuando estamos en el cliente
  useEffect(() => {
    const guardado = safeLocalGet("resultados");
    if (!guardado) return;

    try {
      const parsed = JSON.parse(guardado);
      setResultados(ensureAll(parsed));
    } catch (e) {
      console.error("Error parseando resultados:", e);
    }
  }, []);

  // Persistir cada vez que cambien los resultados
  useEffect(() => {
    safeLocalSet("resultados", JSON.stringify(resultados));
  }, [resultados]);

  // Helpers
  const genId = () => Math.random().toString(36).slice(2, 10);

  const resetResultados = () => {
    safeLocalSet("resultados", "{}");
    setResultados(ensureAll({}));
  };

  const addCheckin = ({ animo, energia, nota }) => {
    setResultados((prev) => {
      const base = ensureAll(prev);
      return {
        ...base,
        coach: {
          ...base.coach,
          checkins: [
            {
              fechaISO: new Date().toISOString(),
              animo: typeof animo === "number" ? animo : null,
              energia: typeof energia === "number" ? energia : null,
              nota: nota?.trim() || null,
            },
            ...base.coach.checkins,
          ],
        },
      };
    });
  };

  const addObjetivo = ({ texto, horizonte }) => {
    const t = texto?.trim();
    if (!t) return;

    const obj = {
      id: genId(),
      texto: t,
      estado: "abierto",
      creadoISO: new Date().toISOString(),
      horizonte: horizonte || "2-4 semanas",
    };

    setResultados((prev) => {
      const base = ensureAll(prev);
      return {
        ...base,
        coach: {
          ...base.coach,
          objetivos: [obj, ...base.coach.objetivos],
        },
      };
    });
    return obj;
  };

  const upsertHabito = (hab) => {
    setResultados((prev) => {
      const base = ensureAll(prev);
      const list = [...base.coach.habitos];
      const idx = list.findIndex((h) => h.id === hab.id);

      if (idx >= 0) list[idx] = { ...list[idx], ...hab };
      else list.unshift({ id: genId(), streak: 0, activo: true, ...hab });

      return {
        ...base,
        coach: { ...base.coach, habitos: list },
      };
    });
  };
const actualizarJuego = (claveJuego, payload) => {
  setResultados((prev) => {
    const juegosPrev = prev?.juegos || {};
    const previo = juegosPrev[claveJuego] || {};
    return {
      ...prev,
      juegos: {
        ...juegosPrev,
        [claveJuego]: {
          ...previo,
          ...payload,
        },
      },
    };
  });
};
  const addSesion = ({ mensajes, resumen, tags }) => {
    const sesion = {
      id: genId(),
      fechaISO: new Date().toISOString(),
      mensajes: mensajes || [],
      resumen: resumen || null,
      tags: tags || [],
    };

    setResultados((prev) => {
      const base = ensureAll(prev);
      return {
        ...base,
        coach: {
          ...base.coach,
          sesiones: [sesion, ...base.coach.sesiones],
        },
      };
    });
  };

  const addConversacion = (payload) => {
    const conv = {
      id: genId(),
      fechaISO: new Date().toISOString(),
      tipo: "oipe",
      ...payload,
    };

    setResultados((prev) => {
      const base = ensureAll(prev);
      return {
        ...base,
        coach: {
          ...base.coach,
          conversaciones: [conv, ...base.coach.conversaciones],
        },
      };
    });
  };

  const bumpTone = (tone) => {
    setResultados((prev) => {
      const base = ensureAll(prev);
      const prefs = base.coach.preferences;
      const stats = { ...(prefs.toneStats || {}) };
      stats[tone] = (stats[tone] || 0) + 1;

      return {
        ...base,
        coach: {
          ...base.coach,
          preferences: {
            ...prefs,
            lastTone: tone || prefs.lastTone || "equilibrada",
            toneStats: stats,
          },
        },
      };
    });
  };

  const applyRewardsFromRun = ({ gameKey, score, playMinutes = 3 }) => {
    setResultados((prev) =>
      ensureAll(applyRunRewards(prev, { gameKey, score, playMinutes }))
    );
  };

  const clearRewardMeta = () => {
    setResultados((prev) => {
      if (!prev?.metaUltimaRecompensa) return prev;
      const next = { ...prev };
      delete next.metaUltimaRecompensa;
      return next;
    });
  };

  return (
    <ResultadosContext.Provider
      value={{
        resultados,
        setResultados,
        resetResultados,
        addCheckin,
        addObjetivo,
        upsertHabito,
        addSesion,
        addConversacion,
        bumpTone,
        applyRewardsFromRun,
        clearRewardMeta,
      }}
    >
      {children}
    </ResultadosContext.Provider>
  );
}
