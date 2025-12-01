"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const SoundCtx = createContext(null);

export function useSound() {
  return useContext(SoundCtx);
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);

  // Evitar localStorage en SSR: inicializamos en useEffect
  useEffect(() => {
    try {
      const savedEnabled = JSON.parse(localStorage.getItem("sound_enabled"));
      const savedVolume = Number(localStorage.getItem("sound_volume"));

      if (savedEnabled !== null) setEnabled(savedEnabled);
      if (!isNaN(savedVolume)) setVolume(savedVolume);
    } catch (err) {
      console.warn("SoundContext: no se pudo leer localStorage");
    }
  }, []);

  // Guardar cambios
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sound_enabled", JSON.stringify(enabled));
      localStorage.setItem("sound_volume", String(volume));
    }
  }, [enabled, volume]);

  const api = {
    enabled,
    volume,
    setEnabled,
    setVolume,
    play(soundUrl) {
      if (!enabled) return;
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().catch(() => {});
    },
  };

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>;
}
