import React, { useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Props compatibles con tu uso actual:
 * title, description, to, icon, time, progress, gradientFrom, gradientTo,
 * accent, locked, soon, imageSrc, imageAlt, status ("nuevo"|"en-curso"|"completo"),
 * subtitleBadge, tall
 */
export default function GameCard({
  title,
  description,
  to,
  icon = "🎮",
  time = "10–15 min",
  progress = 0,
  gradientFrom = "#E9F0FF",
  gradientTo = "#F7FBFF",
  accent = "#4F46E5",
  locked = false,
  soon = false,
  imageSrc,
  imageAlt = "",
  status, // "nuevo" | "en-curso" | "completo"
  subtitleBadge,
  tall = false,
}) {
  const navigate = useNavigate();
  const disabled = locked || soon || !to;

  // ---- meta gamificada (opcionales) ----
  const pct = Math.max(0, Math.min(100, progress));
  const minutes = useMemo(() => {
    const ns = (time.match(/\d+/g) || []).map(Number);
    return ns.length ? Math.max(...ns) : 5;
  }, [time]);
  const xp = useMemo(() => {
    const base = 60, perMin = 6, bonus = status === "completo" ? 40 : 0;
    return base + minutes * perMin + bonus;
  }, [minutes, status]);

  // ---- efectos visuales ----
  const cardRef = useRef(null);
  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -6;
    const ry = ((x / r.width) - 0.5) * 6;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  const glow = `0 10px 30px rgba(0,0,0,0.2), 0 0 24px ${hexToRgba(accent, 0.35)}`;
  const borderGrad = `linear-gradient(120deg, ${hexToRgba(accent,0.9)}, ${hexToRgba(accent,0.35)}, ${hexToRgba(accent,0.9)})`;
  const headerGrad = `linear-gradient(180deg, ${gradientFrom}, ${gradientTo})`;
  const ring = `conic-gradient(${accent} ${pct * 3.6}deg, rgba(0,0,0,0.08) 0deg)`;

  const badgeColor =
    status === "completo"
      ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
      : status === "en-curso"
      ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
      : "bg-sky-500/15 text-sky-700 border-sky-500/30";

  const handleCardClick = () => {
    if (!disabled && to) navigate(to);
  };

  return (
    <div className="relative group will-change-transform">
      {/* halo/borde */}
      <div
        aria-hidden
        className="absolute -inset-[1.5px] rounded-3xl opacity-70 group-hover:opacity-100 transition"
        style={{ background: borderGrad, filter: "blur(6px)" }}
      />

      {/* CARD (clickable) */}
      <div
        ref={cardRef}
        role={!disabled ? "button" : undefined}
        tabIndex={!disabled ? 0 : undefined}
        onClick={handleCardClick}
        onKeyDown={(e) => (!disabled && (e.key === "Enter" || e.key === " ")) && navigate(to)}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`relative rounded-3xl overflow-hidden border backdrop-blur bg-white/70 transition-transform duration-150 cursor-pointer ${
          tall ? "h-[320px]" : "h-[260px]"
        }`}
        style={{ borderColor: hexToRgba(accent, 0.25), boxShadow: glow, cursor: disabled ? "default" : "pointer" }}
        aria-disabled={disabled}
      >
        {/* header con imagen/gradiente */}
        <div className="h-[110px] relative" style={{ background: headerGrad }}>
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt={imageAlt || title}
                className="absolute right-2 bottom-2 h-[88px] w-auto drop-shadow"
                loading="lazy"
              />
              <div
                className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full blur-2xl opacity-40 pointer-events-none"
                style={{ background: accent }}
              />
            </>
          ) : (
            <div
              className="absolute left-3 bottom-3 w-12 h-12 rounded-xl grid place-items-center text-2xl"
              style={{ background: `${accent}15`, color: accent }}
            >
              {icon}
            </div>
          )}

          {/* badges */}
          <div className="absolute left-3 top-3 flex items-center gap-2">
            {subtitleBadge && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-white/70 border border-white/60 text-slate-700">
                {subtitleBadge}
              </span>
            )}
            {status && (
              <span className={`text-[11px] px-2 py-1 rounded-md border ${badgeColor}`}>
                {status === "completo" ? "Completado" : status === "en-curso" ? "En curso" : "Nuevo"}
              </span>
            )}
            {soon && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-black/70 text-white border border-white/20">
                Próximamente
              </span>
            )}
            {locked && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-black/70 text-white border border-white/20">
                Bloqueado
              </span>
            )}
          </div>
        </div>

        {/* cuerpo */}
        <div className="p-4 flex gap-4 h-[calc(100%-110px)]">
          {/* anillo progreso */}
          <div
            className="relative flex-shrink-0 w-[58px] h-[58px] rounded-full grid place-items-center"
            style={{ backgroundImage: ring }}
          >
            <div className="w-[44px] h-[44px] rounded-full bg-white/90 grid place-items-center text-slate-800 text-xs font-bold">
              {pct}%
            </div>
          </div>

          {/* info + CTA */}
          <div className={imageSrc ? "pr-10 sm:pr-12 min-w-0 flex-1" : "min-w-0 flex-1"}>
            <h3 className="font-extrabold text-slate-800 leading-snug line-clamp-2">{title}</h3>
            <p className="text-[13px] text-slate-600 mt-0.5 line-clamp-2">{description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">⏱ {time}</span>
              {progress > 0 && (
                <span className="px-2 py-1 rounded-md bg-white/70 border border-white/60 text-slate-700">
                  🏁 {progress}% completado
                </span>
              )}
              <span
                className="px-2 py-1 rounded-md"
                style={{ background: hexToRgba(accent, 0.12), color: "#0b1724", border: `1px solid ${hexToRgba(accent, 0.35)}` }}
              >
                ⭐ {xp} XP
              </span>
              <span className="px-2 py-1 rounded-md bg-white/70 border border-white/60 text-slate-700">
                ⚡ −2 Energía
              </span>
            </div>

            {/* CTA: Link preservado */}
            <div className="mt-4 relative z-[3]">
              {disabled ? (
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-500 cursor-not-allowed"
                >
                  {locked ? "Bloqueado" : "Próximamente"}
                </button>
              ) : (
                <Link
                  to={to}
                  onClick={(e) => e.stopPropagation()} // evita burbujeo al click de card
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition active:scale-[0.98]"
                  style={{ background: `linear-gradient(90deg, ${lighten(accent, 10)}, ${accent})`, boxShadow: `0 6px 16px ${hexToRgba(accent, 0.35)}` }}
                >
                  Jugar ahora <span>›</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* overlay bloqueo */}
        {locked && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] pointer-events-none" />}
      </div>
    </div>
  );
}

/* utils */
function hexToRgba(hex, a = 1) {
  const h = hex.replace("#", "");
  const N = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(N, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function lighten(hex, amt = 10) {
  const h = hex.replace("#", "");
  const N = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  let n = parseInt(N, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.min(255, r + (255 * amt) / 100);
  g = Math.min(255, g + (255 * amt) / 100);
  b = Math.min(255, b + (255 * amt) / 100);
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}
