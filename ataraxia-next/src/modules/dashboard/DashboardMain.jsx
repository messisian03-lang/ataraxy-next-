"use client";

import Link from "next/link";
import { useResultados } from "../../context/ResultadosContext";
import {
  FaBrain,
  FaGamepad,
  FaUser,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

export default function DashboardMain() {
  const { resultados } = useResultados() || {};
  const perfil = resultados?.perfil || {};
  const nombre = perfil?.nombre || "Explorador/a";
  const avatarUrl = perfil?.avatarUrl || "/assets/avatar-coach.png";

  return (
    <div className="space-y-6">
      {/* Header con avatar y saludo */}
      <section className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-cyan-300/70 shadow-lg shadow-cyan-500/30 overflow-hidden bg-black/40">
            <img
              src={avatarUrl}
              alt="Avatar de usuario"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
              Centro de mando Ataraxia
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#FFEEEE] drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]">
              Hola, {nombre}
            </h1>
            <p className="text-[13px] text-slate-200/80 max-w-xl">
              Desde aquí podés acceder a tu diagnóstico, juegos de habilidades,
              coach virtual y mapa integrado de habilidades blandas.
            </p>
          </div>
        </div>
      </section>

      {/* Tarjetas principales */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          href="/diagnostico"
          icon={FaBrain}
          title="Diagnóstico Inicial"
          subtitle="Explorá tu perfil cognitivo, estilos y rasgos clave."
          accent="from-cyan-400/80 via-sky-500/70 to-emerald-400/60"
        />

        <DashboardCard
          href="/juegos"
          icon={FaGamepad}
          title="Juegos Ataraxia"
          subtitle="Evalúa liderazgo, aprendizaje y control emocional jugando."
          accent="from-purple-400/80 via-fuchsia-500/70 to-pink-400/60"
        />

        <DashboardCard
          href="/coach"
          icon={FaComments}
          title="Coach Virtual"
          subtitle="Sesiones guiadas con tu coach ontológico + IA."
          accent="from-emerald-400/80 via-teal-500/70 to-cyan-400/60"
        />

        <DashboardCard
          href="/perfil"
          icon={FaUser}
          title="Perfil"
          subtitle="Metas, preferencias, idioma, temas y personalización."
          accent="from-amber-400/80 via-orange-500/70 to-rose-400/60"
        />

        <DashboardCard
          href="/mapa-habilidades"
          icon={FaChartLine}
          title="Mapa de Habilidades"
          subtitle="Radar combinado de diagnóstico y juegos."
          accent="from-blue-400/80 via-cyan-500/70 to-indigo-400/60"
        />
      </section>
    </div>
  );
}

function DashboardCard({ href, icon: Icon, title, subtitle, accent }) {
  return (
    <Link
      href={href}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 rounded-2xl"
    >
      <article
        className={`
          relative overflow-hidden rounded-2xl border border-white/10
          bg-black/40 backdrop-blur-xl p-4 md:p-5
          transition-transform transition-shadow duration-200
          group-hover:-translate-y-0.5 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]
        `}
      >
        {/* Glow */}
        <div
          className={`
            pointer-events-none absolute -inset-20 opacity-0
            bg-gradient-radial ${accent}
            blur-3xl transition-opacity duration-300
            group-hover:opacity-60
          `}
        />

        <div className="relative flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950/80 border border-cyan-300/40 shadow-md shadow-cyan-500/40">
            <Icon className="text-xl text-cyan-300" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#FFEEEE] mb-1">
              {title}
            </h2>
            <p className="text-[12px] text-slate-200/80 leading-relaxed">
              {subtitle}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
              Abrir módulo
              <span className="text-xs">↗</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
