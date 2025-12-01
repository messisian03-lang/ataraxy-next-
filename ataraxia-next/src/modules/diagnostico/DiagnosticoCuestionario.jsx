"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import preguntas from "../../data/preguntasDiagnostico.json";
import { useResultados } from "../../context/ResultadosContext";

const ETIQUETAS = {
  1: "Muy en desacuerdo",
  2: "En desacuerdo",
  3: "Neutral",
  4: "De acuerdo",
  5: "Muy de acuerdo",
};

const VARIANTS = {
  pastel: {
    name: "Pastel",
    bar: "from-pink-200 via-pink-300 to-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.3)]",
    active:
      "border-pink-300 ring-1 ring-pink-200 text-white font-bold shadow-[0_0_8px_rgba(244,114,182,0.3)]",
    button: "bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400",
    swatch: "linear-gradient(90deg, #fbcfe8, #f472b6, #fb7185)",
  },
  neon: {
    name: "Neón",
    bar: "from-fuchsia-400 via-pink-500 to-fuchsia-600 shadow-[0_0_16px_rgba(232,121,249,0.8)]",
    active:
      "border-fuchsia-400 ring-2 ring-fuchsia-300 text-white font-bold shadow-[0_0_16px_rgba(232,121,249,0.8)]",
    button: "bg-gradient-to-r from-fuchsia-400 via-pink-500 to-fuchsia-600",
    swatch: "linear-gradient(90deg, #e879f9, #ec4899, #a21caf)",
  },
  aqua: {
    name: "Aqua",
    bar: "from-cyan-300 via-teal-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    active:
      "border-teal-400 ring-2 ring-cyan-300 text-white font-bold shadow-[0_0_12px_rgba(34,211,238,0.6)]",
    button: "bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500",
    swatch: "linear-gradient(90deg, #67e8f9, #2dd4bf, #3b82f6)",
  },
  forest: {
    name: "Bosque",
    bar: "from-green-300 via-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    active:
      "border-emerald-400 ring-2 ring-green-300 text-white font-bold shadow-[0_0_12px_rgba(52,211,153,0.6)]",
    button: "bg-gradient-to-r from-green-300 via-emerald-400 to-teal-500",
    swatch: "linear-gradient(90deg, #86efac, #34d399, #14b8a6)",
  },
  ataraxia: {
    name: "Ataraxia Pro",
    bar: "from-sky-300 via-cyan-400 to-teal-500 shadow-[0_0_16px_rgba(56,189,248,0.7)]",
    active:
      "border-cyan-400 ring-2 ring-sky-300 text-white font-bold shadow-[0_0_16px_rgba(56,189,248,0.7)]",
    button: "bg-gradient-to-r from-sky-300 via-cyan-400 to-teal-500",
    swatch: "linear-gradient(90deg,#7dd3fc,#22d3ee,#14b8a6)",
  },
};

export default function DiagnosticoCuestionario() {
  const router = useRouter();
  const { setResultados } = useResultados();
  const firstQuestionRef = useRef(null);

  // Estado de respuestas
  const [respuestas, setRespuestas] = useState({});
  const [showIntro, setShowIntro] = useState(true);
  const [variant, setVariant] = useState("ataraxia");
  const [error, setError] = useState("");

  const total = preguntas.length;
  const contestadas = Object.keys(respuestas).length;
  const progreso = useMemo(
    () => Math.round((contestadas / total) * 100),
    [contestadas, total]
  );

  const styles = VARIANTS[variant];

  // Leer tema desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("diagTheme");
    if (saved && VARIANTS[saved]) {
      setVariant(saved);
    }
  }, []);

  // Guardar tema
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("diagTheme", variant);
  }, [variant]);

  // Navegación con teclas 1–5
  useEffect(() => {
    if (showIntro) return;
    const onKey = (e) => {
      if (!["1", "2", "3", "4", "5"].includes(e.key)) return;
      const focused = document.activeElement;
      if (focused && focused.tagName === "INPUT" && focused.type === "radio") {
        focused.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showIntro]);

  const handleChange = (preguntaId, valor) => {
    setError("");
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contestadas < total) {
      setError("Por favor, respondé todas las preguntas para continuar.");
      return;
    }

    const valores = Object.values(respuestas);
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    const promedio2 = Number(promedio.toFixed(2));

    // Resumen general
    let resumen = "";
    if (promedio <= 2) resumen = "Necesitás trabajar en varias áreas clave.";
    else if (promedio <= 3.5)
      resumen = "Buen punto de partida, con áreas a mejorar.";
    else resumen = "Muy buen desempeño inicial, tenés fortalezas destacadas.";

    // Bloques de rasgos (1–15 analítico, 16–30 creativo, 31–45 empático)
    let analitico = 0,
      creativo = 0,
      empatico = 0;

    Object.entries(respuestas).forEach(([id, valor]) => {
      const num = parseInt(id, 10);
      if (num <= 15) analitico += valor;
      else if (num <= 30) creativo += valor;
      else empatico += valor;
    });

    let perfilTexto = "";
    perfilTexto +=
      analitico >= 45
        ? "🧠 Pensamiento analítico sólido: decidís con lógica y resolvés problemas con criterio.\n\n"
        : "🧠 Pensamiento analítico en desarrollo: entrená observación y evaluación crítica.\n\n";
    perfilTexto +=
      creativo >= 45
        ? "🎨 Creatividad alta: generás ideas originales y soluciones innovadoras.\n\n"
        : "🎨 Creatividad media: potenciála explorando nuevas experiencias y enfoques.\n\n";
    perfilTexto +=
      empatico >= 45
        ? "💬 Empatía notable: comunicás y liderás con sensibilidad.\n\n"
        : "💬 Empatía a fortalecer: practicá escucha activa y feedback consciente.\n\n";
    perfilTexto +=
      "🌟 Siguiente paso: sumá datos con Juegos de Habilidades y usá el Coach Virtual para un plan personalizado.";

    // Rasgos estructurados (útil para el coach)
    const rasgos = [
      {
        id: "analitico",
        label: "Pensamiento analítico",
        puntaje: analitico,
        nivel:
          analitico >= 45 ? "alto" : analitico >= 35 ? "medio" : "en desarrollo",
      },
      {
        id: "creativo",
        label: "Creatividad",
        puntaje: creativo,
        nivel:
          creativo >= 45 ? "alto" : creativo >= 35 ? "medio" : "en desarrollo",
      },
      {
        id: "empatico",
        label: "Empatía y comunicación",
        puntaje: empatico,
        nivel:
          empatico >= 45 ? "alto" : empatico >= 35 ? "medio" : "en desarrollo",
      },
    ];

    // Guardar en ResultadosContext con formato pro
    setResultados((prev) => ({
      ...prev,
      diagnostico: {
        completado: true,
        respuestas,
        promedio: promedio2,
        resumen,
        perfilTexto,
        rasgos,
        estilos: [], // reservado para ampliaciones
      },
    }));

    router.push("/diagnostico/resultado");
  };

  const comenzar = () => {
    setShowIntro(false);
    setTimeout(() => firstQuestionRef.current?.focus(), 0);
  };

  return (
  <div className="min-h-screen w-full relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">

      {/* Fondo fijo */}
      <div
        className="fixed inset-0 bg-top bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
      />
      <div className="fixed inset-0 bg-[#0b1724]/60 backdrop-blur-sm" />

      {/* Contenedor */}
    <div className="relative z-10 h-full max-w-5xl mx-auto px-4">
        {/* Header con selector de tema */}
        <header className="sticky top-0 z-20 pt-6 pb-4 rounded-b-2xl border border-white/10 bg-[#0b1724]/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
                Módulo de diagnóstico inicial
              </p>
              <h1 className="text-xl md:text-2xl font-semibold">
                Perfil Cognitivo &amp; Estilos
              </h1>
              <p className="text-[13px] text-[#ffeaea]/80 max-w-xl">
                Respondé con sinceridad. No hay respuestas buenas o malas: esto
                es un mapa para que el coach te ayude mejor.
              </p>
            </div>

            {/* Selector de tema */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-200/70">
                Tema visual
              </span>
              <div className="flex gap-1.5">
                {Object.entries(VARIANTS).map(([key, v]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVariant(key)}
                    className={`w-7 h-7 rounded-full border border-white/15 ring-1 ring-white/10 overflow-hidden relative group ${
                      variant === key ? "scale-110" : "opacity-80"
                    }`}
                    aria-label={v.name}
                  >
                    <span
                      className="absolute inset-0"
                      style={{ background: v.swatch }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-slate-200/80 mb-1.5">
              <span>{contestadas} de {total} respuestas</span>
              <span>{progreso}% completado</span>
            </div>
            <div className="h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${styles.bar}`}
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-300/80">
              Escala 1 a 5: 1 = Muy en desacuerdo · 5 = Muy de acuerdo.
            </p>
          </div>
        </header>

        {/* Intro o formulario */}
        <main className="py-6 pb-10 h-[calc(100%-120px)] overflow-y-auto">
          {showIntro ? (
            <div className="mt-10 max-w-xl space-y-4">
              <h2 className="text-lg font-semibold">Antes de empezar…</h2>
              <p className="text-sm text-[#ffeaea]/85">
                El diagnóstico inicial te va a devolver un perfil de fortalezas
                y áreas a desarrollar. Después el Coach Virtual va a usar esta
                info junto con tus juegos y tu perfil para darte devoluciones
                personalizadas.
              </p>
              <ul className="text-[13px] text-[#ffeaea]/80 list-disc list-inside space-y-1">
                <li>Elegí la opción que más se acerque a cómo sos hoy.</li>
                <li>Si dudás, pensá en situaciones reales de los últimos meses.</li>
                <li>Pensá en vos, no en lo que “debería ser”.</li>
              </ul>
              <button
                type="button"
                onClick={comenzar}
                className={`mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 shadow-lg bg-gradient-to-r ${styles.button}`}
              >
                Comenzar diagnóstico
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {preguntas.map((p, idx) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-white/10 bg-[#0b1724]/80 shadow-[0_12px_30px_rgba(15,23,42,0.8)] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full border border-cyan-300/60 flex items-center justify-center text-[11px] text-cyan-200">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm mb-2">{p.texto}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.from({ length: 5 }).map((_, valueIdx) => {
                          const value = valueIdx + 1;
                          const id = `${p.id}-${value}`;
                          const checked = respuestas[p.id] === value;
                          return (
                            <label
                              key={id}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] cursor-pointer transition ${
                                checked ? styles.active : "border-white/15 text-slate-200"
                              }`}
                            >
                              <input
                                ref={idx === 0 && value === 1 ? firstQuestionRef : undefined}
                                type="radio"
                                name={`pregunta-${p.id}`}
                                value={value}
                                checked={checked}
                                onChange={() => handleChange(p.id, value)}
                                className="sr-only"
                              />
                              <span className="font-medium">{value}</span>
                              <span className="opacity-80 hidden sm:inline">
                                {ETIQUETAS[value]}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {error && (
                <p className="text-sm text-rose-200 bg-rose-900/40 border border-rose-500/50 rounded-xl px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-950 shadow-lg bg-gradient-to-r ${styles.button}`}
                >
                  Ver resultados del diagnóstico
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
