import React, { useEffect, useRef, useState } from "react";

export default function Pomodoro25({ onFinish }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(
      () => setSeconds((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(ref.current);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false);
      onFinish?.();
    }
  }, [seconds, onFinish]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mt-2 p-3 rounded-lg bg-white/10 border border-white/20 text-[#FFEEEE]">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tabular-nums">
          {mm}:{ss}
        </div>
        <div className="flex gap-2">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="bg-[#FFEEEE] text-black px-3 py-1 rounded-md"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="border border-[#FFEEEE] text-[#FFEEEE] px-3 py-1 rounded-md"
            >
              Pausar
            </button>
          )}
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(25 * 60);
            }}
            className="border border-[#FFEEEE] text-[#FFEEEE] px-3 py-1 rounded-md"
          >
            Reiniciar
          </button>
        </div>
      </div>
      <div className="text-xs text-slate-200 mt-1">
        Consejo: silenciá notificaciones y anotá una única micro-tarea.
      </div>
    </div>
  );
}
