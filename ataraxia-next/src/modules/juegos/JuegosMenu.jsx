"use client";

import { useRouter } from "next/navigation";
import { useResultados } from "../../context/ResultadosContext";

function formatStatus(modulo) {
  if (!modulo?.completado) return "Pendiente";
  return `Completado · ${modulo?.estiloDominante || "Perfil detectado"}`;
}

function formatScoreLabel(modulo) {
  if (!modulo?.puntajes) return "";
  const entries = Object.entries(modulo.puntajes);
  if (!entries.length) return "";
  const [key, value] = entries.sort((a, b) => b[1] - a[1])[0];
  return `${key} ${value}`;
}

export default function JuegosMenu() {
  const router = useRouter();
  const { resultados } = useResultados();
  const juegos = resultados?.juegos || {};

  return (
    <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
      />
      <div className="absolute inset-0 bg-[#050816]/80 backdrop-blur-md" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-white/12 bg-gradient-to-br from-slate-900/85 via-slate-950/90 to-black/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
            Módulo de Juegos Ataraxia
          </p>
          <h1 className="text-xl md:text-2xl font-semibold mb-1">
            Entrenamiento de Habilidades Blandas
          </h1>
          <p className="text-sm text-[#ffeaea]/80 max-w-2xl">
            Cada juego está diseñado para medir y entrenar aspectos distintos:
            liderazgo, estilos de aprendizaje e inteligencia emocional. Los
            resultados se combinan en tu Mapa de Habilidades y alimentan al
            Coach Virtual.
          </p>
        </section>

        {/* Grid de juegos */}
        <section className="grid gap-4 md:grid-cols-3">
          {/* Juego 1 - Misión en Equipo */}
          <article className="rounded-2xl border border-cyan-400/40 bg-black/70 backdrop-blur-lg p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">
                Juego 1 · Liderazgo
              </p>
              <h2 className="text-sm font-semibold mb-1">Misión en Equipo</h2>
              <p className="text-[13px] text-slate-200/85">
                Tomás decisiones en situaciones de misión y se detecta tu estilo
                de liderazgo predominante: estratégico, empático, directivo o
                facilitador.
              </p>
            </div>
            <div className="text-[11px] text-slate-200/80 space-y-1">
              <p>
                Estado:{" "}
                <span className="font-semibold">
                  {formatStatus(juegos.liderazgo)}
                </span>
              </p>
              {juegos.liderazgo?.puntajes && (
                <p>
                  Estilo más fuerte:{" "}
                  <span className="font-semibold capitalize">
                    {juegos.liderazgo.estiloDominante}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={() => router.push("/juegos/mision-equipo")}
              className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300"
            >
              Iniciar / Repetir misión
            </button>
          </article>

          {/* Juego 2 - Ruta del Conocimiento */}
          <article className="rounded-2xl border border-sky-400/40 bg-black/70 backdrop-blur-lg p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-300/90 mb-1">
                Juego 2 · Aprendizaje
              </p>
              <h2 className="text-sm font-semibold mb-1">
                Ruta del Conocimiento
              </h2>
              <p className="text-[13px] text-slate-200/85">
                Explorás distintas estaciones y se detectan tus preferencias de
                aprendizaje (visual, auditivo, kinestésico, reflexivo, práctico,
                etc.).
              </p>
            </div>
            <div className="text-[11px] text-slate-200/80 space-y-1">
              <p>
                Estado:{" "}
                <span className="font-semibold">
                  {formatStatus(juegos.aprendizaje)}
                </span>
              </p>
              {juegos.aprendizaje?.perfil && (
                <p>
                  Perfil detectado:{" "}
                  <span className="font-semibold">
                    {juegos.aprendizaje.perfil}
                  </span>
                </p>
              )}
            </div>
            <button
              onClick={() => router.push("/juegos/ruta-del-conocimiento")}
              className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300"
            >
              Explorar ruta
            </button>
          </article>

          {/* Juego 3 - Control Emocional */}
          <article className="rounded-2xl border border-emerald-400/40 bg-black/70 backdrop-blur-lg p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/90 mb-1">
              Juego 3 · Inteligencia emocional
              </p>
              <h2 className="text-sm font-semibold mb-1">
                Control Central Emocional
              </h2>
              <p className="text-[13px] text-slate-200/85">
                Respondés a situaciones desafiantes y se miden autorregulación,
                empatía, reconocimiento emocional, decisiones bajo presión y
                comunicación asertiva.
              </p>
            </div>
            <div className="text-[11px] text-slate-200/80 space-y-1">
              <p>
                Estado:{" "}
                <span className="font-semibold">
                  {formatStatus(juegos.emocional)}
                </span>
              </p>
            </div>
            <button
              onClick={() => router.push("/juegos/control-emocional")}
              className="mt-auto inline-flex justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300"
            >
              Activar panel emocional
            </button>
          </article>
        </section>
      </div>
    </div>
  );
}
