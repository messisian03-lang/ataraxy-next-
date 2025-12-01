// src/components/ReflectionPendingCard.jsx
import React from "react";

export default function ReflectionPendingCard({ reflection, onResume }) {
  if (!reflection) return null;
  return (
    <div className="bg-white/80 rounded-2xl shadow-sm border border-amber-200 p-4">
      <div className="text-xs font-semibold text-amber-700 uppercase">Reflexión pendiente</div>
      <p className="mt-1 text-slate-800">{reflection}</p>
      <button
        onClick={onResume}
        className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition"
      >
        Responder ahora
      </button>
    </div>
  );
}
