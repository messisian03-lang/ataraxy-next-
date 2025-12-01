// src/components/MotivationWidget.jsx
import React, { useContext, useMemo, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { VARIANTS, readTheme } from "../theme/diagThemes";
import { STOIC_QUOTES, pickStoicQuote } from "../data/stoicQuotes";
import { WEEKLY_TIPS } from "../data/weeklyTips"; // dejá tus tips separados como ya los tenés
import { Quote, Lightbulb, RefreshCw, Copy, ChevronRight } from "lucide-react";

/* utils */
const hexToRgba = (hex, a = 1) => {
  const h = hex.replace("#", "");
  const N = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(N, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
const hash32 = (s="") => {
  let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const dayOfYear = (d = new Date()) =>
  Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 86400000);
const pickWeeklyTip = (date = new Date(), userKey = "") => {
  if (!Array.isArray(WEEKLY_TIPS) || WEEKLY_TIPS.length === 0) return null;
  const doy = dayOfYear(date);
  const weekIndex = Math.floor(doy / 7);
  const idx = (weekIndex + hash32(userKey)) % WEEKLY_TIPS.length;
  return WEEKLY_TIPS[idx];
};

export default function MotivationWidget() {
  const { resultados } = useContext(ResultadosContext) || {};
  const perfil = resultados?.perfil || resultados?.perfilUsuario || {};
  const userKey = perfil?.email || perfil?.nombre || "";

  // tema actual
  const variant = readTheme();
  const theme = VARIANTS[variant] || VARIANTS.ataraxia;
  const [c1, c2, c3] = theme.colors;
  const gradient = `linear-gradient(90deg, ${c1}, ${c2}, ${c3})`;
  const borderCol = hexToRgba(c2, 0.35);
  const glow = `0 12px 30px -10px ${hexToRgba(c2, 0.45)}`;

  // datos “del día”
  const todayQuote = pickStoicQuote(new Date(), userKey);
  const [mode, setMode] = useState("quote"); // "quote" | "tip"
  const [altIdx, setAltIdx] = useState(null);

  const quote = useMemo(() => {
    if (altIdx == null) return todayQuote;
    return STOIC_QUOTES[altIdx % STOIC_QUOTES.length];
  }, [altIdx, todayQuote]);

  const tip = useMemo(() => pickWeeklyTip(new Date(), userKey), [userKey]);

  const seeAnother = () => {
    let next = Math.floor(Math.random() * STOIC_QUOTES.length);
    // evitamos repetir la del día
    const baseIdx = STOIC_QUOTES.findIndex(
      q => q.text === todayQuote.text && q.author === todayQuote.author
    );
    if (next === baseIdx) next = (next + 1) % STOIC_QUOTES.length;
    setAltIdx(next);
  };

  const copyText = (text) => {
    try {
      navigator?.clipboard?.writeText?.(text);
    } catch {}
  };

  return (
    <div
      className="rounded-3xl border backdrop-blur p-5 text-white shadow-lg"
      style={{
        background: "rgba(255,255,255,0.10)",
        borderColor: "rgba(255,255,255,0.2)",
        boxShadow: glow,
      }}
    >
      {/* tabs */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setMode("quote")}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
            mode === "quote" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
          }`}
          style={{ borderColor: borderCol }}
        >
          <Quote className="w-4 h-4 opacity-90" />
          <span className="text-sm font-semibold">Estoicismo del día</span>
        </button>
        <button
          onClick={() => setMode("tip")}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${
            mode === "tip" ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
          }`}
          style={{ borderColor: borderCol }}
        >
          <Lightbulb className="w-4 h-4 opacity-90" />
          <span className="text-sm font-semibold">Tip semanal</span>
        </button>
      </div>

      {/* contenido */}
      {mode === "quote" ? (
        <div
          className="rounded-2xl p-4 border"
          style={{ background: "rgba(255,255,255,0.08)", borderColor: borderCol }}
        >
          <div
            className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-[11px] font-semibold mb-2"
            style={{ background: gradient, color: theme.textOnAccent }}
          >
            Cita {altIdx == null ? "del día" : "alternativa"}
          </div>
          <p className="text-base md:text-lg leading-relaxed">
            “{quote.text}”
          </p>
          <div className="mt-2 text-sm opacity-80">— {quote.author}</div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={seeAnother}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/10 hover:bg-white/15 transition"
              style={{ borderColor: borderCol }}
            >
              <RefreshCw className="w-4 h-4" /> Ver otra
            </button>
            <button
              onClick={() => copyText(`"${quote.text}" — ${quote.author}`)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/10 hover:bg-white/15 transition"
              style={{ borderColor: borderCol }}
            >
              <Copy className="w-4 h-4" /> Copiar
            </button>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 border"
          style={{ background: "rgba(255,255,255,0.08)", borderColor: borderCol }}
        >
          <div
            className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-[11px] font-semibold mb-2"
            style={{ background: gradient, color: theme.textOnAccent }}
          >
            Tip semanal
          </div>
          {tip ? (
            <>
              <p className="text-base md:text-lg leading-relaxed">{tip.text}</p>
              {tip.action && (
                <div className="mt-2 inline-flex items-center gap-1 text-sm opacity-90">
                  <ChevronRight className="w-4 h-4" />
                  <span>{tip.action}</span>
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    // mostrar otro aleatorio solo localmente
                    const next = WEEKLY_TIPS[Math.floor(Math.random() * WEEKLY_TIPS.length)];
                    if (next) {
                      // truquito local: re-render con un key temporal
                      WEEKLY_TIPS.push(WEEKLY_TIPS.shift()); // rota
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/10 hover:bg-white/15 transition"
                  style={{ borderColor: borderCol }}
                  title="Otro tip (local)"
                >
                  <RefreshCw className="w-4 h-4" /> Otro tip
                </button>
                <button
                  onClick={() => copyText(`${tip.text}${tip.action ? " — " + tip.action : ""}`)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/10 hover:bg-white/15 transition"
                  style={{ borderColor: borderCol }}
                >
                  <Copy className="w-4 h-4" /> Copiar
                </button>
              </div>
            </>
          ) : (
            <p className="opacity-80">Agregá tips en <code>src/data/weeklyTips.js</code>.</p>
          )}
        </div>
      )}
    </div>
  );
}
