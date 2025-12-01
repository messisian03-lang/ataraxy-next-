// src/modules/mapa/MapaHabilidades.jsx
"use client";

import React, { useMemo } from "react";
import { useResultados } from "../../context/ResultadosContext";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// Máximo teórico: 7 escenas x 2 puntos = 14
const MAX_PUNTOS_JUEGO = 14;

function calcularNivel(puntajes) {
  if (!puntajes) return 0;
  const valores = Object.values(puntajes);
  if (!valores.length) return 0;
  const max = Math.max(...valores);
  return Math.round((max / MAX_PUNTOS_JUEGO) * 100);
}

export default function MapaHabilidades() {
  const { resultados } = useResultados();

  const liderazgo = resultados?.juegos?.liderazgo;
  const aprendizaje = resultados?.juegos?.aprendizaje;
  const emocional = resultados?.juegos?.controlEmocional;

  const dataRadar = useMemo(() => {
    const data = [];
    if (liderazgo?.puntajes) {
      data.push({
        eje: "Liderazgo",
        valor: calcularNivel(liderazgo.puntajes),
      });
    }
    if (aprendizaje?.puntajes) {
      data.push({
        eje: "Aprendizaje",
        valor: calcularNivel(aprendizaje.puntajes),
      });
    }
    if (emocional?.puntajes) {
      data.push({
        eje: "Gestión emocional",
        valor: calcularNivel(emocional.puntajes),
      });
    }
    return data;
  }, [liderazgo, aprendizaje, emocional]);

  const tieneDatos = dataRadar.length > 0;

  return (
    <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
      />
      <div className="absolute inset-0 bg-[#020617]/88 backdrop-blur-md" />

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-cyan-400/40 bg-slate-950/95 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
                Mapa Integrado de Habilidades Blandas
              </p>
              <h1 className="text-xl md:text-2xl font-semibold mb-1">
                Radar combinado · Liderazgo, Aprendizaje y Emoción
              </h1>
              <p className="text-sm text-[#e5f9ff]/85 max-w-xl">
                Este mapa integra tu diagnóstico inicial con los tres juegos:
                Misión en Equipo (liderazgo), Ruta del Conocimiento
                (aprendizaje) y Control Central Emocional. Es la base para el
                trabajo con tu Coach Virtual.
              </p>
            </div>
            <div className="text-[11px] text-right text-slate-300/85">
              <p>Valores expresados en % de desarrollo relativo</p>
              <p>Nivel 0–100 · Más alto = tendencia más fuerte</p>
            </div>
          </div>
        </section>

        {/* Layout principal: Radar + resumenes */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Radar */}
          <section className="rounded-2xl border border-white/15 bg-slate-950/90 backdrop-blur-xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.75)] flex flex-col">
            <h2 className="text-sm font-semibold mb-2">
              Mapa general de tu perfil
            </h2>
            <p className="text-[12px] text-slate-300/85 mb-3">
              Cada eje refleja el nivel relativo que mostrás hoy en liderazgo,
              aprendizaje y gestión emocional, según tus decisiones en los
              juegos.
            </p>

            <div className="flex-1 min-h-[260px]">
              {tieneDatos ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dataRadar} outerRadius="75%">
                    <PolarGrid stroke="rgba(148, 163, 184, 0.4)" />
                    <PolarAngleAxis
                      dataKey="eje"
                      tick={{ fill: "#E5F9FF", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#94A3B8", fontSize: 10 }}
                      stroke="rgba(148, 163, 184, 0.6)"
                    />
                    <Radar
                      name="Nivel"
                      dataKey="valor"
                      fill="rgba(56, 189, 248, 0.45)"
                      stroke="rgba(56, 189, 248, 0.9)"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-[13px] text-slate-300/80 px-4">
                  Aún no hay suficientes datos para construir tu mapa combinado.
                  Completá los juegos de Liderazgo, Ruta del Conocimiento y
                  Control Emocional para ver tu radar integrado.
                </div>
              )}
            </div>
          </section>

          {/* Resúmenes por área */}
          <section className="space-y-4">
            {/* Liderazgo */}
            <div className="rounded-2xl border border-cyan-400/40 bg-slate-950/90 backdrop-blur-xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">
                Juego 1 · Misión en Equipo
              </p>
              <h3 className="text-sm font-semibold mb-1">
                Liderazgo principal:{" "}
                <span className="text-cyan-300">
                  {liderazgo?.etiquetaEstilo || "Sin datos aún"}
                </span>
              </h3>
              <p className="text-[12px] text-slate-200/85">
                {liderazgo?.resumen ||
                  "Cuando completes Misión en Equipo, acá vas a ver tu tendencia principal de liderazgo y cómo se refleja en situaciones de misión."}
              </p>
            </div>

            {/* Aprendizaje */}
            <div className="rounded-2xl border border-sky-400/40 bg-slate-950/90 backdrop-blur-xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-sky-300/90 mb-1">
                Juego 2 · Ruta del Conocimiento
              </p>
              <h3 className="text-sm font-semibold mb-1">
                Estilo de aprendizaje dominante:{" "}
                <span className="text-sky-300">
                  {aprendizaje?.etiquetaEstilo || "Sin datos aún"}
                </span>
              </h3>
              <p className="text-[12px] text-slate-200/85">
                {aprendizaje?.resumen ||
                  "Cuando completes Ruta del Conocimiento, acá vas a ver cómo procesás mejor la información: visual, auditivo, kinestésico, reflexivo o práctico."}
              </p>
            </div>

            {/* Emocional */}
            <div className="rounded-2xl border border-emerald-400/45 bg-slate-950/90 backdrop-blur-xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/90 mb-1">
                Juego 3 · Control Central Emocional
              </p>
              <h3 className="text-sm font-semibold mb-1">
                Fortaleza emocional principal:{" "}
                <span className="text-emerald-300">
                  {emocional?.etiquetaEstilo || "Sin datos aún"}
                </span>
              </h3>
              <p className="text-[12px] text-slate-200/85">
                {emocional?.resumen ||
                  "Cuando completes el juego emocional, acá vas a ver si tu punto fuerte está en la autorregulación, la empatía, la lectura emocional, las decisiones bajo presión o la comunicación asertiva."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
