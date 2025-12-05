"use client";

import React, { useContext, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import {
  FaUserCircle,
  FaPalette,
  FaBullseye,
  FaBrain,
  FaCheckCircle,
} from "react-icons/fa";

export default function UserProfileForm() {
  const { resultados, setResultados } = useContext(ResultadosContext);

  const perfil = resultados.perfil || {};

  const [nombre, setNombre] = useState(perfil.nombre || "");
  const [pais, setPais] = useState(perfil.pais || "");
  const [idioma, setIdioma] = useState(perfil.idioma || "");
  const [tema, setTema] = useState(perfil.tema || "");
  const [sonido, setSonido] = useState(perfil.sonido ?? true);
  const [avatar, setAvatar] = useState(perfil.avatar || "avatar1");
  const [metas, setMetas] = useState(perfil.metas || []);
  const [preferencias, setPreferencias] = useState(perfil.preferencias || []);

  const avatars = ["avatar1", "avatar2", "avatar3", "avatar4"];
  const metasDisponibles = [
    "Mejorar memoria",
    "Reducir ansiedad",
    "Mejorar concentración",
    "Desarrollar creatividad",
  ];
  const preferenciasDisponibles = [
    "Visual",
    "Auditivo",
    "Kinestésico",
    "Lector-Escritor",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    setResultados((prev) => ({
      ...prev,
      perfil: {
        nombre,
        pais,
        idioma,
        tema,
        sonido,
        avatar,
        metas,
        preferencias,
      },
    }));

    alert("Perfil actualizado correctamente");
  };

  return (
    <div className="w-full px-4 md:px-10 py-10">
      <form
        onSubmit={handleSubmit}
        className="grid gap-10 max-w-4xl mx-auto"
      >
        {/* INFO BÁSICA */}
        <div className="bg-[#0e1320]/80 text-white backdrop-blur-md rounded-2xl p-6 border border-cyan-400/40 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 tracking-wide">
              <FaUserCircle className="text-cyan-300 text-3xl" /> Información Básica
            </h2>
            {nombre && pais && idioma && (
              <span className="flex items-center gap-2 text-green-400 font-semibold">
                <FaCheckCircle /> Completo
              </span>
            )}
          </div>

          {/* Avatares */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
            {avatars.map((av) => (
              <img
                key={av}
                src={`/avatars/${av}.png`}
                onClick={() => setAvatar(av)}
                className={`w-20 h-20 rounded-full cursor-pointer border-4 transition-all duration-200 ${
                  avatar === av
                    ? "border-cyan-400 scale-110 shadow-xl"
                    : "border-gray-500 opacity-70"
                }`}
                alt={av}
              />
            ))}
          </div>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="w-full p-3 rounded-lg bg-[#1a1f2e] border border-gray-600 text-white mb-4"
            required
          />

          <select
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1a1f2e] border border-gray-600 text-white mb-4"
          >
            <option value="">Selecciona tu país</option>
            <option>Argentina</option>
            <option>México</option>
            <option>España</option>
          </select>

          <select
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1a1f2e] border border-gray-600 text-white"
          >
            <option value="">Selecciona tu idioma</option>
            <option>Español</option>
            <option>Inglés</option>
          </select>
        </div>

        {/* PERSONALIZACIÓN */}
        <div className="bg-[#0e1320]/80 text-white backdrop-blur-md rounded-2xl p-6 border border-purple-400/40 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <FaPalette className="text-purple-300 text-3xl" /> Personalización
            </h2>
            {tema && (
              <span className="flex items-center gap-2 text-green-400 font-semibold">
                <FaCheckCircle /> Completo
              </span>
            )}
          </div>

          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1a1f2e] border border-gray-600 text-white mb-4"
          >
            <option value="">Tema de color</option>
            <option>Claro</option>
            <option>Oscuro</option>
            <option>Neón</option>
          </select>

          <div className="flex items-center justify-between">
            <span>Sonido y Música</span>
            <input
              type="checkbox"
              checked={sonido}
              onChange={(e) => setSonido(e.target.checked)}
              className="w-6 h-6"
            />
          </div>
        </div>

        {/* METAS */}
        <div className="bg-[#0e1320]/80 text-white backdrop-blur-md rounded-2xl p-6 border border-red-400/40 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <FaBullseye className="text-red-300 text-3xl" /> Metas Personales
            </h2>
            {metas.length > 0 && (
              <span className="flex items-center gap-2 text-green-400 font-semibold">
                <FaCheckCircle /> Completo
              </span>
            )}
          </div>

          <div className="space-y-3">
            {metasDisponibles.map((meta) => (
              <label key={meta} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={metas.includes(meta)}
                  onChange={() =>
                    setMetas((prev) =>
                      prev.includes(meta)
                        ? prev.filter((m) => m !== meta)
                        : [...prev, meta]
                    )
                  }
                  className="w-5 h-5"
                />
                {meta}
              </label>
            ))}
          </div>
        </div>

        {/* PREFERENCIAS */}
        <div className="bg-[#0e1320]/80 text-white backdrop-blur-md rounded-2xl p-6 border border-green-300/40 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <FaBrain className="text-green-300 text-3xl" /> Preferencias Cognitivas
            </h2>
            {preferencias.length > 0 && (
              <span className="flex items-center gap-2 text-green-400 font-semibold">
                <FaCheckCircle /> Completo
              </span>
            )}
          </div>

          <div className="space-y-3">
            {preferenciasDisponibles.map((pref) => (
              <label key={pref} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferencias.includes(pref)}
                  onChange={() =>
                    setPreferencias((prev) =>
                      prev.includes(pref)
                        ? prev.filter((p) => p !== pref)
                        : [...prev, pref]
                    )
                  }
                  className="w-5 h-5"
                />
                {pref}
              </label>
            ))}
          </div>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-xl text-lg font-semibold tracking-wide shadow-lg"
        >
          Guardar Perfil
        </button>
      </form>
    </div>
  );
}
