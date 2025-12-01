"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useResultados } from "../../context/ResultadosContext";

function getBadge(promedio) {
  if (promedio >= 4.2)
    return {
      label: "Alta autoeficacia",
      tone: "from-emerald-300 via-emerald-400 to-teal-400",
      desc: "Mostrás una base muy sólida de confianza y capacidad para avanzar en tus objetivos.",
    };
  if (promedio >= 3.6)
    return {
      label: "Perfil proactivo",
      tone: "from-sky-300 via-cyan-300 to-blue-400",
      desc: "Tenés buen impulso para moverte y hacer, con margen para pulir hábitos y foco.",
    };
  if (promedio >= 3.0)
    return {
      label: "Potencial en desarrollo",
      tone: "from-amber-300 via-amber-400 to-orange-400",
      desc: "Hay bases interesantes y varias áreas listas para crecer si les das atención.",
    };
  return {
    label: "Necesita foco y hábitos",
    tone: "from-rose-300 via-rose-400 to-red-400",
    desc: "El diagnóstico marca puntos importantes a trabajar: el coach te va a ayudar a ordenarlos.",
  };
}

function getRasgoColor(nivel) {
  switch (nivel) {
    case "alto":
      return "bg-emerald-500/10 border-emerald-300/70 text-emerald-200";
    case "medio":
      return "bg-sky-500/10 border-sky-300/70 text-sky-200";
    default:
      return "bg-amber-500/10 border-amber-300/70 text-amber-200";
  }
}

export default function DiagnosticoResultado() {
  const router = useRouter();
  const { resultados } = useResultados();
  const diagnostico = resultados?.diagnostico;

  // Si no hay datos, mandamos al cuestionario
  if (!diagnostico?.completado) {
    return (
      <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
        <div
          className="absolute inset-0 bg-top bg-no-repeat bg-cover bg-fixed"
          style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
        />
        <div className="absolute inset-0 bg-[#050816]/75 backdrop-blur-sm" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-black/70 rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8 text-center max-w-md">
            <p className="text-lg opacity-90 mb-3">
              Aún no completaste el diagnóstico inicial.
            </p>
            <p className="text-sm text-slate-200/80 mb-5">
              Es el primer paso para que el Coach Virtual pueda conocerte de
              verdad y adaptar las sesiones a tu forma de ser.
            </p>
            <button
              onClick={() => router.push("/diagnostico")}
              className="bg-[#FFEEEE] text-slate-950 font-bold py-2.5 px-6 rounded-xl hover:bg-white transition"
            >
              Ir al cuestionario
            </button>
          </div>
        </div>
      </div>
    );
  }

  const promedio = diagnostico.promedio ?? 0;
  const resumen = diagnostico.resumen ?? "Resumen no disponible.";
  const respuestasCount = diagnostico.respuestas
    ? Object.keys(diagnostico.respuestas).length
    : 0;
  const perfilTexto = diagnostico.perfilTexto || "";
  const rasgos = diagnostico.rasgos || [];
  const badge = getBadge(promedio);

  return (
    <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
      {/* Fondo Ataraxia diagnóstico */}
      <div
        className="absolute inset-0 bg-top bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
      />
      <div className="absolute inset-0 bg-[#050816]/80 backdrop-blur-md" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* Header principal */}
        <section className="rounded-3xl border border-white/12 bg-gradient-to-br from-slate-900/85 via-slate-950/90 to-black/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
                Resultado del diagnóstico inicial
              </p>
              <h1 className="text-xl md:text-2xl font-semibold">
                Tu Perfil Cognitivo &amp; Estilos
              </h1>
              <p className="text-sm text-[#ffeaea]/80 max-w-xl mt-1">
                Este resumen combina tus respuestas en un mapa de fortalezas y
                áreas a trabajar. El Coach Virtual va a usar esto como base para
                las próximas sesiones.
              </p>
              <p className="mt-3 text-[13px] text-slate-200/85">
                <span className="font-semibold">
                  {respuestasCount} respuestas registradas
                </span>{" "}
                · Escala 1 a 5 (1 = Muy en desacuerdo · 5 = Muy de acuerdo)
              </p>
            </div>

            {/* Bloque numérico + badge */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-[11px] text-slate-300/80 mb-1">
                  Promedio general
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-semibold">
                    {promedio.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-300/80">/ 5</span>
                </div>
              </div>
              <div className="inline-flex flex-col items-end gap-1">
                <div className="inline-flex px-3 py-1 rounded-full bg-gradient-to-r border border-white/40 shadow-lg">
                  <span
                    className={`bg-gradient-to-r ${badge.tone} bg-clip-text text-transparent text-[11px] font-semibold uppercase tracking-[0.18em]`}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-200/85 max-w-xs text-right">
                  {badge.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de “llenado” general */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-slate-300/80 mb-1">
              <span>Intensidad global del perfil</span>
              <span>{Math.round((promedio / 5) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${badge.tone}`}
                style={{ width: `${(promedio / 5) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* Rasgos clave en tarjetas */}
        <section className="grid md:grid-cols-3 gap-4">
          {rasgos.map((r) => (
            <article
              key={r.id}
              className={`rounded-2xl border bg-black/45 backdrop-blur-md p-4 ${getRasgoColor(
                r.nivel
              )}`}
            >
              <h2 className="text-sm font-semibold mb-1">{r.label}</h2>
              <p className="text-[11px] mb-1">
                Nivel:{" "}
                <span className="font-semibold capitalize">
                  {r.nivel === "en desarrollo" ? "en desarrollo" : r.nivel}
                </span>
              </p>
              <p className="text-[11px]">
                Puntaje total:{" "}
                <span className="font-semibold">{r.puntaje}</span>
              </p>
            </article>
          ))}
        </section>

        {/* Interpretación larga del perfil */}
        <section className="rounded-2xl border border-white/12 bg-black/60 backdrop-blur-md p-5 shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
          <h2 className="text-sm font-semibold mb-2">
            Interpretación de tu perfil
          </h2>
          {perfilTexto ? (
            <p className="whitespace-pre-line text-sm text-[#ffeaea]/88 leading-relaxed">
              {perfilTexto}
            </p>
          ) : (
            <p className="text-sm text-slate-200/80 italic">
              Todavía no se generó una interpretación extendida. Más adelante
              el coach podrá ayudarte a crearla en base a tus juegos y avances.
            </p>
          )}
        </section>

        {/* Bloque de próximos pasos + CTAs */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-lg p-4">
          <div className="text-[12px] text-slate-200/85 max-w-md">
            <p className="font-semibold mb-1">Próximos pasos sugeridos</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                Usar el <span className="font-semibold">Coach Virtual</span>{" "}
                para traducir estos resultados en metas concretas.
              </li>
              <li>
                Completar los <span className="font-semibold">Juegos</span> de
                liderazgo, aprendizaje y control emocional para ampliar tu mapa.
              </li>
              <li>
                Revisar tu <span className="font-semibold">Perfil</span> y
                anotar 1–3 objetivos claros para los próximos 30 días.
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => router.push("/diagnostico")}
              className="text-xs px-4 py-2 rounded-xl border border-white/30 bg-black/40 hover:bg-black/70 transition"
            >
              Rehacer cuestionario
            </button>
            <button
              onClick={() => router.push("/juegos")}
              className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 text-slate-950 font-semibold hover:brightness-110"
            >
              Ir a Juegos Ataraxia
            </button>
            <button
              onClick={() => router.push("/coach")}
              className="text-xs px-4 py-2 rounded-xl bg-[#FFEEEE] text-slate-950 font-semibold hover:bg-white"
            >
              Hablar con el Coach
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
