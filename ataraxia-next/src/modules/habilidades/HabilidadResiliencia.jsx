// src/modules/habilidades/HabilidadResiliencia.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../../components/ProgressBar";
import { ResultadosContext } from "../../context/ResultadosContext";
import useSound from "../../hooks/useSound";
import { VARIANTS, readTheme } from "../../theme/diagThemes";

/* ---------- Fondo + helpers ---------- */
const BG_URL = "/assets/bg/juegos/juegos-ataraxia.jpg";
const hexToRgba = (hex, a = 1) => {
  const h = hex.replace("#", "");
  const N = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(N, 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ---------- Recompensas ---------- */
// 0⭐ <60, 1⭐ 60–74, 2⭐ 75–89, 3⭐ 90–100
const rewardFor = (total) => {
  if (total >= 90) return { stars: 3, xp: 80 };
  if (total >= 75) return { stars: 2, xp: 55 };
  if (total >= 60) return { stars: 1, xp: 35 };
  return { stars: 0, xp: 10 };
};

const StarRow = ({ n }) => (
  <div className="inline-flex items-center gap-1 text-amber-500 text-lg">
    {Array.from({ length: n }).map((_, i) => (
      <span key={i}>⭐</span>
    ))}
    {n === 0 && (
      <span className="text-slate-400 text-sm">sin estrellas</span>
    )}
  </div>
);

/* ---------- Config del juego ---------- */
const REFRAMES = [
  {
    titulo: "Plazo encima",
    situacion:
      "Sentís que el tiempo no alcanza para la entrega y aparecen pensamientos de 'no llego'.",
    opciones: [
      {
        key: "A",
        label:
          "Divido en 1 paso de 25’ hoy + 1 de revisión mañana, y bloqueo esos espacios.",
        why: "Reencuadra el problema en tareas manejables y usa el tiempo como aliado.",
        scores: { resiliencia: 2, mindset: 2, plan: 1 },
      },
      {
        key: "B",
        label: "Trabajo hasta tarde con café",
        why: "Resuelve el corto plazo de hoy, pero erosiona recuperación.",
        scores: { urgencia: 1 },
      },
      {
        key: "C",
        label: "Lo pospongo; no estoy en condiciones",
        why: "Evita malestar; baja autoeficacia si se vuelve patrón.",
        scores: { evasión: 1 },
      },
    ],
    best: "A",
  },
  {
    titulo: "Feedback fuerte",
    situacion:
      "Te dan una devolución muy crítica sobre un trabajo que hiciste con esfuerzo.",
    opciones: [
      {
        key: "A",
        label:
          "Leo todo, subrayo 2–3 puntos accionables y defino el primer ajuste concreto.",
        why: "Transforma el golpe en insumo de mejora.",
        scores: { resiliencia: 2, mindset: 2 },
      },
      {
        key: "B",
        label: "Pienso que no sirvo para esto",
        why: "Generaliza y pega a la identidad.",
        scores: { autoCritica: 2 },
      },
      {
        key: "C",
        label: "Lo leo por encima y sigo igual",
        why: "Reduce impacto emocional, pero no capitaliza el feedback.",
        scores: { negacion: 1 },
      },
    ],
    best: "A",
  },
  {
    titulo: "Cambio de planes",
    situacion:
      "Algo externo (jefe, cliente, familiar) cambia una prioridad y te altera el día.",
    opciones: [
      {
        key: "A",
        label:
          "Reordeno el día: marco 1 cosa innegociable y 2 flexibles, reviso mi energía.",
        why: "Acepta la realidad y reordena con criterio.",
        scores: { resiliencia: 2, flex: 1, plan: 1 },
      },
      {
        key: "B",
        label: "Me quejo, pero sigo como estaba",
        why: "Descarga algo de tensión pero no adapta.",
        scores: { friccion: 1 },
      },
      {
        key: "C",
        label: "Dejo todo para mañana",
        why: "Evita el conflicto a costa de acumular tensión.",
        scores: { evasión: 1 },
      },
    ],
    best: "A",
  },
];

const MICROS = [
  {
    id: "micro-1",
    titulo: "Micro de 5 minutos",
    desc: "Escribí en un papel qué aprendizaje te dejó una situación difícil y qué hiciste bien.",
  },
  {
    id: "micro-2",
    titulo: "Micro de respiración consciente",
    desc: "Aplica 1 ciclo más de respiración 4-4-4-4 antes de revisar tus pendientes.",
  },
  {
    id: "micro-3",
    titulo: "Micro de gratitud realista",
    desc: "Anotá 2 cosas que valorás de vos mismo/a en cómo enfrentás los cambios.",
  },
];

function HabilidadResiliencia() {
  const router = useRouter();
  const { setResultados } = useContext(ResultadosContext) || {};
  const { play } = useSound();

  // Tema visual según theme global
  const variant = readTheme()?.variant || "ataraxia";
  const theme = VARIANTS[variant] || VARIANTS.ataraxia;
  const [c1, c2, c3] = theme.colors;
  const overlay = `linear-gradient(135deg, ${hexToRgba(
    c1,
    0.22
  )} 0%, ${hexToRgba(c2, 0.18)} 45%, ${hexToRgba(c3, 0.26)} 100%)`;

  // steps: 0 portada, 1 respiración, 2 reencuadre, 3 micro, 4 fin
  const [step, setStep] = useState(0);

  /* ---------- Respiration: interactiva con combo ---------- */
  const pace = 4; // segundos por fase
  const targetCycles = 4; // 4 ciclos 4-4-4-4
  const phases = ["Inhalá", "Sostené", "Exhalá", "Sostené"];
  const pRef = useRef(0);
  const [phase, setPhase] = useState("Preparate");
  const [secLeft, setSecLeft] = useState(pace);
  const [cycles, setCycles] = useState(0);
  const [breathingDone, setBreathingDone] = useState(false);
  const phaseStartRef = useRef(null);
  const timerRef = useRef(null);

  // precisión y combo (tap en el cambio de fase)
  const [syncs, setSyncs] = useState(0);
  const [chain, setChain] = useState(0);
  const [bestChain, setBestChain] = useState(0);

  // Reframe + micro
  const [currentReframe, setCurrentReframe] = useState(0);
  const [selected, setSelected] = useState(null);
  const [micro, setMicro] = useState(null);

  // Score final
  const [scores, setScores] = useState({});
  const [scoreNorm, setScoreNorm] = useState(0);
  const [perfil, setPerfil] = useState("");

  /* ---------- Respiración: loop ---------- */
  useEffect(() => {
    if (step !== 1) return;

    phaseStartRef.current = performance.now();
    pRef.current = 0;
    setPhase(phases[0]);
    setSecLeft(pace);
    setCycles(0);
    setBreathingDone(false);
    setSyncs(0);
    setChain(0);
    setBestChain(0);

    const tick = () => {
      const now = performance.now();
      const elapsed = (now - phaseStartRef.current) / 1000;
      const totalPhase = pace;
      const left = Math.max(0, totalPhase - elapsed);
      setSecLeft(Math.ceil(left));

      if (left <= 0.1) {
        // cambio de fase
        const nextP = (pRef.current + 1) % phases.length;
        pRef.current = nextP;
        phaseStartRef.current = performance.now();
        setPhase(phases[nextP]);
        setSecLeft(pace);

        if (nextP === 0) {
          setCycles((c) => {
            const nc = c + 1;
            if (nc >= targetCycles) {
              setBreathingDone(true);
              if (timerRef.current) cancelAnimationFrame(timerRef.current);
            }
            return nc;
          });
        }
      }

      if (!breathingDone) {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [step, pace, breathingDone]);

  const handleSyncTap = () => {
    if (step !== 1 || breathingDone) return;
    const now = performance.now();
    const elapsed = (now - phaseStartRef.current) / 1000;
    const err = Math.abs(elapsed - pace);
    if (err <= 0.35) {
      setSyncs((s) => s + 1);
      setChain((c) => {
        const nc = c + 1;
        setBestChain((b) => Math.max(b, nc));
        return nc;
      });
      play("tap");
    } else {
      setChain(0);
      play("error");
    }
  };

  /* ---------- Reframes ---------- */
  const current = REFRAMES[currentReframe];

  const handleSelect = (opt) => {
    setSelected(opt.key);
  };

  const handleNextReframe = () => {
    if (!selected) {
      play("error");
      return;
    }
    // sumar puntajes
    const opt = current.opciones.find((o) => o.key === selected);
    if (opt?.scores) {
      setScores((prev) => {
        const next = { ...prev };
        for (const [k, v] of Object.entries(opt.scores)) {
          next[k] = (next[k] || 0) + v;
        }
        return next;
      });
    }
    setSelected(null);
    if (currentReframe + 1 < REFRAMES.length) {
      setCurrentReframe((r) => r + 1);
      play("tap");
    } else {
      setStep(3);
      play("tap");
    }
  };

  /* ---------- Micro ---------- */
  const handleSelectMicro = (m) => {
    setMicro(m);
    play("tap");
  };

  /* ---------- Score final ---------- */
  useEffect(() => {
    if (step !== 4) return;
    // Normalizar muy simple
    const base =
      (scores.resiliencia || 0) * 15 +
      (scores.mindset || 0) * 10 +
      (scores.plan || 0) * 8;
    const total = Math.min(100, Math.max(0, base));
    setScoreNorm(total);

    if (total >= 90)
      setPerfil("Alta resiliencia + mindset de crecimiento muy sólido");
    else if (total >= 75)
      setPerfil("Buena base de resiliencia, con hábitos que sostienen");
    else if (total >= 60)
      setPerfil("Base en construcción; buen punto de partida para seguir");
    else setPerfil("Inicio del camino: ideal para construir nuevas micro pautas");
  }, [step, scores]);

  const estrellas = useMemo(() => rewardFor(scoreNorm).stars, [scoreNorm]);
  const perfilLabel = useMemo(() => {
    if (scoreNorm >= 90)
      return "Nervio estable + mentalidad de crecimiento";
    if (scoreNorm >= 75) return "Base fuerte y hábitos consistentes";
    if (scoreNorm >= 60) return "Progreso sostenido";
    return "Inicio — entrenar constancia";
  }, [scoreNorm]);

  /* ---------- Guardar con ⭐/XP ---------- */
  const guardar = () => {
    const rw = rewardFor(scoreNorm);
    setResultados?.((prev) => {
      const base = prev ?? {};
      const metaPrev = base.meta ?? {};
      const bySkillPrev = metaPrev.starsBySkill ?? {};
      const prevSkillStars = bySkillPrev.resilienciaMindset ?? 0;
      const newSkillStars = Math.max(prevSkillStars, rw.stars);
      const delta = newSkillStars - prevSkillStars;

      return {
        ...base,
        habilidades: {
          ...(base.habilidades || {}),
          resilienciaMindset: {
            progreso: 100,
            respiracion: {
              cycles: Math.min(cycles, targetCycles),
              pace,
              syncs,
              bestChain,
            },
            reframe: { total: REFRAMES.length },
            micro: micro ? micro.id : null,
            scores,
            scoreNorm,
            perfil,
            updatedAt: new Date().toISOString(),
          },
        },
        meta: {
          xp: (metaPrev.xp ?? 0) + rw.xp,
          level: metaPrev.level ?? 1,
          starsTotal: (metaPrev.starsTotal ?? 0) + delta,
          starsBySkill: {
            ...bySkillPrev,
            resilienciaMindset: newSkillStars,
          },
          lastReward: {
            skill: "resilienciaMindset",
            stars: rw.stars,
            xp: rw.xp,
            at: new Date().toISOString(),
          },
          achievements: metaPrev.achievements ?? [],
        },
      };
    });
    play("save");
    router.push("/juegos");
  };

  /* ---------- Shell con fondo ---------- */
  const Shell = ({ children }) => (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url("${BG_URL}")` }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: overlay,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-10">
        {children}
      </div>
    </div>
  );

  /* ---------- Render ---------- */
  if (step === 0) {
    return (
      <Shell>
        <div className="rounded-3xl border border-cyan-400/40 bg-slate-950/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">
            Habilidad • Resiliencia & Mindset
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#FFEEEE]">
            Entrenamiento de resiliencia & mente en movimiento
          </h1>
          <p className="text-sm md:text-[15px] text-slate-100/90 max-w-2xl">
            En este ejercicio vas a combinar respiración, reencuadre de
            pensamientos y una micro-acción diseñada para entrenar cómo te
            parás frente al estrés.
          </p>
          <ul className="text-xs md:text-sm text-slate-200/90 space-y-1">
            <li>• 1 bloque de respiración guiada (4 ciclos).</li>
            <li>• 3 situaciones para reencuadrar.</li>
            <li>• 1 micro-acción concreta para cerrar el circuito.</li>
          </ul>
          <div className="flex items-center justify-between pt-2">
            <button
              className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 transition"
              onClick={() => {
                play("tap");
                setStep(1);
              }}
            >
              Empezar entrenamiento
            </button>
            <div className="hidden md:flex flex-col items-end text-xs text-slate-300/85">
              <span>Duración estimada: 6–8 minutos</span>
              <span>Ideal para antes de un día intenso o después.</span>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === 1) {
    const progress = (cycles / targetCycles) * 100;
    return (
      <Shell>
        <div className="rounded-3xl border border-blue-400/40 bg-slate-950/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-blue-300/90">
                Etapa 1 • Respiración activa
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-[#FFEEEE]">
                4 ciclos 4-4-4-4
              </h2>
              <p className="text-xs md:text-sm text-slate-100/90 max-w-xl">
                Seguí el ritmo de la respiración. Podés hacer tap en el botón
                cuando sientas que cambia la fase: eso entrena sincronía y
                foco.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-xs text-slate-300/80">
              <span>Ciclos completos: {cycles} / {targetCycles}</span>
              <span>Sincronías: {syncs}</span>
              <span>Mejor cadena: {bestChain}</span>
            </div>
          </div>

          <ProgressBar value={progress} label="Progreso respiración" />

          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="w-40 h-40 rounded-full border border-blue-400/50 flex items-center justify-center bg-slate-900/60 shadow-[0_0_40px_rgba(56,189,248,0.5)]">
              <div className="text-center">
                <p className="text-xs text-blue-200/90 mb-1">Fase actual</p>
                <p className="text-xl font-semibold text-[#FFEEEE]">
                  {phase}
                </p>
                <p className="text-[11px] text-slate-200/80">
                  {secLeft}s
                </p>
              </div>
            </div>
            <button
              onClick={handleSyncTap}
              className="px-4 py-2 rounded-full border border-blue-400/70 bg-slate-900/80 text-xs text-blue-100 hover:bg-blue-500/10 transition"
            >
              Tap cuando sientas el cambio de fase
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 text-xs text-slate-300/85">
            <span>
              Consejo: si perdés el ritmo, volvé a enfocarte en sentir el
              aire entrando y saliendo.
            </span>
            <button
              className="px-3 py-1.5 rounded-lg border border-slate-600/70 text-[11px] hover:bg-slate-800/80"
              onClick={() => {
                play("tap");
                setStep(2);
              }}
            >
              Pasar a reencuadre
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === 2) {
    const progress =
      ((currentReframe + (selected ? 1 : 0)) / REFRAMES.length) * 100;
    return (
      <Shell>
        <div className="rounded-3xl border border-emerald-400/40 bg-slate-950/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-300/90">
                Etapa 2 • Reencuadre
              </p>
              <h2 className="text-xl md:text-2xl font-semibold text-[#FFEEEE]">
                Situación {currentReframe + 1} de {REFRAMES.length}
              </h2>
              <p className="text-xs md:text-sm text-slate-100/90 max-w-xl">
                Leé la situación y elegí la respuesta que mejor representa una
                mentalidad de resiliencia y crecimiento.
              </p>
            </div>
            <div className="hidden md:flex text-xs text-slate-300/80 flex-col items-end">
              <span>Progreso reencuadre</span>
              <ProgressBar value={progress} compact />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/90">
              Situación
            </p>
            <p className="text-sm md:text-[15px] text-slate-50">
              {current.situacion}
            </p>
          </div>

          <div className="space-y-2">
            {current.opciones.map((opt) => (
              <button
                key={opt.key}
                className={`w-full text-left text-sm rounded-2xl border px-3.5 py-2.5 transition ${
                  selected === opt.key
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                    : "border-slate-600/80 bg-slate-900/70 text-slate-50 hover:border-emerald-400/60 hover:bg-emerald-500/10"
                }`}
                onClick={() => handleSelect(opt)}
              >
                <span className="font-semibold mr-2 text-xs text-emerald-300">
                  {opt.key}
                </span>
                {opt.label}
                {selected === opt.key && opt.why && (
                  <p className="mt-1 text-[11px] text-emerald-200/90">
                    {opt.why}
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition"
              onClick={handleNextReframe}
            >
              {currentReframe + 1 < REFRAMES.length
                ? "Siguiente situación"
                : "Elegir micro-acción"}
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  if (step === 3) {
    return (
      <Shell>
        <div className="rounded-3xl border border-amber-400/40 bg-slate-950/90 px-5 py-6 md:px-7 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-5">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300/90">
              Etapa 3 • Micro-acción
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[#FFEEEE]">
              Elegí 1 micro-acción para cerrar el circuito
            </h2>
            <p className="text-xs md:text-sm text-slate-100/90 max-w-xl">
              Lo que entrenaste recién gana fuerza si lo conectás con un gesto
              concreto en tu día.
            </p>
          </div>

          <div className="space-y-2">
            {MICROS.map((m) => (
              <button
                key={m.id}
                className={`w-full text-left rounded-2xl border px-3.5 py-2.5 text-sm transition ${
                  micro?.id === m.id
                    ? "border-amber-400 bg-amber-500/15 text-amber-100"
                    : "border-slate-600/80 bg-slate-900/70 text-slate-50 hover:border-amber-400/70 hover:bg-amber-500/10"
                }`}
                onClick={() => handleSelectMicro(m)}
              >
                <p className="font-semibold mb-0.5">{m.titulo}</p>
                <p className="text-xs text-slate-200/90">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition disabled:opacity-50"
              onClick={() => {
                if (!micro) {
                  play("error");
                  return;
                }
                setStep(4);
                play("tap");
              }}
              disabled={!micro}
            >
              Ver resultado
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // step 4: resumen final
  return (
    <Shell>
      <div className="rounded-3xl border border-cyan-400/40 bg-slate-950/95 px-5 py-6 md:px-7 md:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">
              Resumen de entrenamiento
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-[#FFEEEE]">
              Resiliencia & Mindset
            </h2>
            <p className="text-xs md:text-sm text-slate-100/90 max-w-xl">
              Esta es una foto rápida de cómo combinaste respiración, reencuadre
              y acción. La idea es que puedas repetir este módulo cuando lo
              necesites.
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-xs text-slate-300/85">Puntaje entreno</p>
            <p className="text-2xl font-semibold text-cyan-300">
              {scoreNorm.toFixed(0)} / 100
            </p>
            <p className="text-[11px] text-slate-300/80">{perfilLabel}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs md:text-sm text-slate-100/90">
          <div className="rounded-2xl border border-blue-400/40 bg-slate-900/80 p-3 space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-300/90">
              Respiración
            </p>
            <p>Ciclos completos: {Math.min(cycles, targetCycles)}</p>
            <p>Sincronías: {syncs}</p>
            <p>Mejor cadena: {bestChain}</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/40 bg-slate-900/80 p-3 space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/90">
              Reencuadre
            </p>
            <p>Escenarios trabajados: {REFRAMES.length}</p>
            <p>
              Foco en resiliencia:{" "}
              <span className="font-semibold">
                {scores.resiliencia || 0}
              </span>
            </p>
            <p>
              Mindset de crecimiento:{" "}
              <span className="font-semibold">
                {scores.mindset || 0}
              </span>
            </p>
          </div>
          <div className="rounded-2xl border border-amber-400/40 bg-slate-900/80 p-3 space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
              Micro-acción
            </p>
            {micro ? (
              <>
                <p className="font-semibold">{micro.titulo}</p>
                <p className="text-xs text-slate-200/90">{micro.desc}</p>
              </>
            ) : (
              <p className="text-slate-300/80">
                Podés elegir una micro-acción concreta la próxima vez que
                quieras reforzar este módulo.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="space-y-1 text-xs text-slate-300/85">
            <p>Recompensa del módulo:</p>
            <StarRow n={estrellas} />
          </div>
          <button
            className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-sm font-semibold hover:bg-cyan-400 transition"
            onClick={guardar}
          >
            Guardar y volver a Juegos
          </button>
        </div>
      </div>
    </Shell>
  );
}

export default HabilidadResiliencia;
