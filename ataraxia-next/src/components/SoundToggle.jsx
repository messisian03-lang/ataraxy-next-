import React from "react";
import useSound from "../hooks/useSound";

export default function SoundToggle({ className = "" }) {
  const { enabled, setEnabled, volume, setVolume } = useSound();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`px-3 py-1.5 rounded-lg border text-sm ${
          enabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"
        }`}
        title={enabled ? "Sonido activado" : "Sonido desactivado"}
      >
        {enabled ? "🔊 Sonido ON" : "🔇 Sonido OFF"}
      </button>

      <input
        type="range"
        min={0} max={1} step={0.05}
        value={volume ?? 0.6}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-24 accent-emerald-600"
        title="Volumen"
      />
    </div>
  );
}
