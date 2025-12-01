import React, { useMemo, useState } from "react";

export default function CheckInCard({ onSave }) {
  const [animo, setAnimo] = useState(3);
  const [energia, setEnergia] = useState(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const hint = useMemo(() => {
    if (animo <= 2 || energia <= 2) return "Se siente pesado hoy. Lo laburamos de a poco.";
    if (animo >= 4 && energia >= 4) return "¡Buena energía! Aprovechemos esa ola.";
    return "Ok, tomamos la temperatura y seguimos.";
  }, [animo, energia]);

  const save = async () => {
    setSaving(true);
    try {
      await onSave?.({ animo, energia, nota: "checkin-dashboard" });
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur">
      <h3 className="text-base font-semibold text-white">¿Cómo venís hoy?</h3>
      <p className="text-xs text-white/70 mb-3">Mové los sliders y registrá.</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/90">Ánimo: <b>{animo}</b></label>
          <input type="range" min="1" max="5" value={animo}
            onChange={(e)=>setAnimo(Number(e.target.value))}
            className="w-full accent-emerald-400" />
        </div>
        <div>
          <label className="text-sm text-white/90">Energía: <b>{energia}</b></label>
          <input type="range" min="1" max="5" value={energia}
            onChange={(e)=>setEnergia(Number(e.target.value))}
            className="w-full accent-emerald-400" />
        </div>
      </div>

      <div className="mt-3 text-xs text-white/80">{hint}</div>

      <button
        onClick={save}
        disabled={saving}
        className={`mt-3 px-4 py-2 rounded-xl text-white font-medium transition
          ${saving ? "bg-emerald-800/40 cursor-wait"
                   : saved ? "bg-emerald-600 ring-2 ring-emerald-300"
                   : "bg-emerald-600 hover:bg-emerald-700"}`}
        aria-live="polite"
      >
        {saving ? "Guardando…" : saved ? "Guardado ✓" : "Registrar"}
      </button>
    </div>
  );
}
