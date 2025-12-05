"use client";

import { useContext } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { FaStar, FaChartLine } from "react-icons/fa";

export default function DashboardHeader() {
  const { resultados } = useContext(ResultadosContext);
  const perfil = resultados.perfil || {};

  const nombre = perfil.nombre || "Explorador/a";
  const avatarKey = perfil.avatar || "avatar1";

  return (
    <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
      
      {/* Avatar + info */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-xl bg-cyan-500/40 -z-10" />
          <img
            src={`/avatars/${avatarKey}.png`}
            alt="Avatar usuario"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-cyan-400 shadow-2xl object-cover"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
            Perfil del explorador
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {nombre}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-md">
            Este es tu panel central. Desde acá podés ver tu progreso y habilidades.
          </p>
        </div>
      </div>

      {/* Progreso */}
      <div className="bg-[#0e1320]/80 border border-cyan-400/50 rounded-2xl px-5 py-4 shadow-lg min-w-[260px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Progreso Ataraxia
          </span>
          <FaChartLine className="text-cyan-300" />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-200">
          <div>
            <p className="text-slate-400 text-xs">Nivel actual</p>
            <p className="font-semibold flex items-center gap-1">
              <FaStar className="text-yellow-400" /> 1
            </p>
          </div>

          <div>
            <p className="text-slate-400 text-xs">XP acumulada</p>
            <p className="font-semibold">120</p>
          </div>

          <div>
            <p className="text-slate-400 text-xs">Estado</p>
            <p className="font-semibold text-cyan-300">Descubrimiento</p>
          </div>
        </div>

        {/* Barra */}
        <div className="mt-3">
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
