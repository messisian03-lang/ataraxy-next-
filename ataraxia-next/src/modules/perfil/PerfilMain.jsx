// src/modules/perfil/PerfilMain.jsx
"use client";

import React from "react";
import { useResultados } from "../../context/ResultadosContext";
import UserProfileForm from "../../components/UserProfileForm";

const BG_URL = "/assets/bg/juegos/juegos-ataraxia.jpg";

export default function PerfilMain() {
  const { resultados } = useResultados() || {};

  const profile = resultados?.profile || {};
  const meta = resultados?.meta || {};

  const nombre = profile.nombre || profile.name || "Explorador/a";
  const rol = profile.rol || profile.role || "Aprendiz Ataraxia";

  const level = meta.level ?? 1;
  const xp = meta.xp ?? 0;
  const starsTotal = meta.starsTotal ?? 0;

  return (
    <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("${BG_URL}")`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl" />

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Header perfil */}
        <header className="rounded-3xl border border-cyan-400/40 bg-slate-950/95 px-5 py-5 md:px-7 md:py-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90">
              Perfil del explorador
            </p>
            <h1 className="text-xl md:text-2xl font-semibold">
              Hola {nombre}, este es tu espacio personal
            </h1>
            <p className="text-xs md:text-sm text-slate-200/90 max-w-xl">
              Acá podés configurar tu avatar, tus datos básicos, tus
              preferencias y objetivos. Toda esta info la usa después MAIA
              (tu coach virtual) para adaptar el acompañamiento y los
              entrenamientos.
            </p>
            <p className="text-[11px] text-slate-300/85">
              Rol actual:{" "}
              <span className="font-semibold text-cyan-200">{rol}</span>
            </p>
          </div>

          {/* Resumen XP / estrellas */}
          <div className="rounded-2xl border border-cyan-400/40 bg-slate-950/90 px-4 py-3 text-xs md:text-sm min-w-[220px] space-y-1.5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/90">
              Progreso Ataraxia
            </p>
            <p>
              Nivel:{" "}
              <span className="font-semibold text-cyan-300">{level}</span>
            </p>
            <p>
              XP acumulada:{" "}
              <span className="font-semibold text-cyan-200">{xp}</span>
            </p>
            <p>
              Estrellas totales:{" "}
              <span className="font-semibold text-amber-300">
                {starsTotal}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              El nivel y las estrellas suben con juegos, habilidades y
              desafíos completados.
            </p>
          </div>
        </header>

        {/* Formulario principal de perfil */}
        <section className="rounded-3xl border border-white/12 bg-slate-950/95 px-4 py-5 md:px-6 md:py-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <UserProfileForm />
        </section>
      </div>
    </div>
  );
}
