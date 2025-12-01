import React from "react";

export default function ProgressBar({ value = 0, color = "#3B82F6" }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full transition-all"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
