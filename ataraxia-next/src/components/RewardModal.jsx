import React, { useEffect, useState } from "react";

export default function RewardModal({ data, onClose }) {
  if (!data) return null;

  const { score, stars, gainedXp, gainedCoins, level, progress, toNext, streakCount } = data;
  const [xpShown, setXpShown] = useState(0);
  const [coinsShown, setCoinsShown] = useState(0);

  useEffect(() => {
    const xi = setInterval(() => setXpShown((x) => (x < gainedXp ? Math.min(gainedXp, x + Math.ceil(gainedXp / 30)) : gainedXp)), 20);
    const ci = setInterval(() => setCoinsShown((c) => (c < gainedCoins ? Math.min(gainedCoins, c + 1) : gainedCoins)), 40);
    return () => { clearInterval(xi); clearInterval(ci); };
  }, [gainedXp, gainedCoins]);

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 border shadow-2xl">
        <h3 className="text-xl font-extrabold text-slate-800">Recompensas</h3>
        <p className="text-slate-600 mt-1">¡Buen run! Estos son tus premios:</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <MiniStat label="Score" value={`${score}`} />
          <MiniStat label="Estrellas" value={"★".repeat(stars) || "—"} />
          <MiniStat label="Racha" value={`${streakCount}🔥`} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Big label="XP" value={xpShown} />
          <Big label="Coins" value={coinsShown} />
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">Nivel {level}</div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-cyan-500"
              style={{ width: `${Math.round((progress / toNext) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{toNext - progress} XP para el próximo nivel</div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-xl text-white font-semibold bg-sky-600 hover:bg-sky-700"
        >
          Continuar
        </button>

        <Confetti stars={stars} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-3 text-center">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-lg font-extrabold text-slate-800">{value}</div>
    </div>
  );
}

function Big({ label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4 text-center shadow">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
    </div>
  );
}

function Confetti({ stars }) {
  const items = Array.from({ length: 12 + stars * 8 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => (
        <span
          key={i}
          className="absolute text-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            animation: `fall ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.4}s linear forwards`,
          }}
        >
          {["✨", "⭐", "💠", "🔷", "🔶"][i % 5]}
        </span>
      ))}
      <style>{`
        @keyframes fall { to { transform: translateY(120vh) rotate(360deg); opacity: .85; } }
      `}</style>
    </div>
  );
}
