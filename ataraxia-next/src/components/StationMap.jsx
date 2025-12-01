import React from "react";

export default function StationMap({ total = 7, current = 1, accent = "#10B981" }) {
  return (
    <div className="rounded-2xl p-4 border shadow-sm bg-white relative overflow-hidden">
      <div className="flex items-center justify-between">
        {Array.from({ length: total }, (_, i) => {
          const idx = i + 1;
          const active = idx <= current;
          return (
            <div key={idx} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold border ${
                  active ? "" : "bg-white"
                }`}
                style={{
                  background: active ? accent : "",
                  color: active ? "#fff" : "#334155",
                  borderColor: active ? accent : "#e5e7eb",
                }}
              >
                {idx}
              </div>
              {idx < total && (
                <div className="h-1 flex-1 mx-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: current > idx ? "100%" : current === idx ? "50%" : "0%",
                      background: accent,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
