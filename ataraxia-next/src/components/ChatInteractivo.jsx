// src/components/ChatInteractivo.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { FaRobot, FaUser, FaCircle } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { askCoach } from "../api/coach";

/* ────────────────────────────────────────────────────────────────────────────
   Constantes y helpers
──────────────────────────────────────────────────────────────────────────── */
const COACH_NAME = "Maia";
const COACH_AVATAR = "/assets/coach/maia-avatar.png";
const LS_HISTORY_KEY = "ataraxy_coach_history";

const helloByHour = () => {
  const h = new Date().getHours();
  if (h < 6) return "hola, trasnochador/a 👀";
  if (h < 12) return "buen día ☀️";
  if (h < 19) return "buenas tardes 🌿";
  return "buenas noches 🌙";
};

const norm = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const lastSnippet = (raw = "") => {
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const parts = t.split(/([.!?])\s+/);
  const last = parts.length > 1 ? parts.slice(-2).join(" ") : t;
  const snip = last.slice(-120);
  return snip.length < last.length ? "…" + snip : snip;
};

// Aperturas variadas por tono (evita “Entiendo…”)
const openingVariants = {
  empatica: ["Te escucho", "Te leo", "Gracias por ponerlo en palabras", "Tiene sentido lo que decís"],
  motivadora: ["Qué bueno que lo traigas", "Me gusta que lo notes", "¡Vamos con eso!"],
  directa: ["Veamos", "Vamos a mirarlo juntos", "Ok"],
  equilibrada: ["Te leo", "Te sigo", "Bien, veamos esto"]
};
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const warmify = (text, tone) => {
  const start = sample(openingVariants[tone] || openingVariants.equilibrada);
  switch (tone) {
    case "empatica": return `${start}. ${text}`;
    case "motivadora": return `${start}! ${text}`;
    case "directa": return text;
    default: return `${start}. ${text}`;
  }
};
const maybeAddHumanTail = (text) => {
  const tails = [
    "Contame un poco más si querés.",
    "Tomate un momento para pensarlo.",
    "Estoy acá, seguí contándome.",
    "Eso que decís es importante.",
    "Podemos ir despacio con esto."
  ];
  return Math.random() < 0.28 ? `${text} ${sample(tails)}` : text;
};
const scaleLabel = (n) => {
  const v = Number(n) || 0;
  if (v <= 1) return "muy bajo";
  if (v === 2) return "bajo";
  if (v === 3) return "medio";
  if (v === 4) return "bueno";
  return "muy bueno";
};
function buildMoodLine(resultados) {
  const last = resultados?.coach?.checkins?.[0];
  if (!last) return "";
  const a = last.animo, e = last.energia;
  if (a == null && e == null) return "";
  if (a != null && e != null) return `Veo que venís con ánimo ${scaleLabel(a)} y energía ${scaleLabel(e)}.`;
  if (a != null) return `Veo que venís con ánimo ${scaleLabel(a)}.`;
  return `Veo que venís con energía ${scaleLabel(e)}.`;
}
function buildPreviousLine(resultados) {
  const hist = Array.isArray(resultados?.coach?.historial) ? resultados.coach.historial : [];
  const lastUser = [...hist].reverse().find((m) => m.autor === "usuario");
  const snip = lastUser ? lastSnippet(lastUser.texto || "") : "";
  return snip ? `La última vez me contabas: “${snip}”.` : "";
}
function buildTranscriptForSummary(msgs = []) {
  const lines = msgs.slice(-60).map(m => {
    const who = m.autor === "coach" ? "Coach" : "Usuario";
    const t = String(m.texto || "").replace(/\s+/g, " ").trim();
    return `${who}: ${t}`;
  });
  return lines.join("\n");
}

/* ────────────────────────────────────────────────────────────────────────────
   UI
──────────────────────────────────────────────────────────────────────────── */
const CoachAvatar = () => (
  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-200 shadow-sm bg-amber-50 flex items-center justify-center relative">
    <img src={COACH_AVATAR} alt="Maia" onError={(e)=>{e.currentTarget.style.display="none";}} className="w-full h-full object-cover"/>
    <span className="text-xs font-semibold text-amber-700 absolute select-none">M</span>
  </div>
);
const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 grid place-items-center shadow">
    <FaUser className="text-[13px]" />
  </div>
);
const Bubble = ({ author, children }) => {
  const isCoach = author === "coach";
  return (
    <div className={`flex ${isCoach ? "justify-start" : "justify-end"} items-start gap-2`}>
      {isCoach && <CoachAvatar />}
      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-[14px] leading-relaxed shadow-sm border ${
          isCoach ? "bg-[#F9F6F1] text-slate-800 border-amber-100" : "bg-[#E8FFF6] text-slate-900 border-emerald-100"
        }`}>{children}</div>
      {!isCoach && <UserAvatar />}
    </div>
  );
};
const Typing = () => (
  <div className="flex items-center gap-2 text-slate-500 text-xs">
    <FaRobot /><span className="animate-pulse">Maia está escribiendo…</span>
  </div>
);

/* ────────────────────────────────────────────────────────────────────────────
   Componente principal
──────────────────────────────────────────────────────────────────────────── */
let currentAbort = null;

export default function ChatInteractivo({ reflexion } = {}) {
  const { resultados, setResultados, addSesion } = useContext(ResultadosContext);

  const historialPrevio =
    resultados?.coach?.historial ||
    (() => { try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || "[]"); } catch { return []; }})();

  const [mensajes, setMensajes] = useState(historialPrevio);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);

  const scrollRef = useRef(null);
  const mensajesRef = useRef(mensajes);
  useEffect(() => { mensajesRef.current = mensajes; }, [mensajes]);

  const closedRef = useRef(false);

  const persist = (nuevoHistorial) => {
    try { localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(nuevoHistorial || [])); } catch {}
    setResultados?.((prev) => ({
      ...(prev || {}),
      coach: {
        ...(prev?.coach || {}),
        historial: nuevoHistorial || [],
        convState: prev?.coach?.convState || { stage: "encuadre", step: 0 },
      },
    }));
  };

  // Saludo inicial
  useEffect(() => {
    if (!mensajes.length) {
      const nombre = resultados?.perfil?.nombre ? `, ${resultados.perfil.nombre}` : "";
      const saludoBase = `${helloByHour()}${nombre}. Soy ${COACH_NAME}.`;
      const encuadre = "Este es un espacio confidencial y 100% para vos; acompaño con escucha y foco.";

      const last = resultados?.coach?.checkins?.[0];
      let estado = "";
      if (last) {
        const a = Number(last.animo), e = Number(last.energia);
        if (a >= 4 && e <= 2) estado = "Buen ánimo con energía baja; cuidemos la base mientras miramos el tema.";
        else if (a <= 2 && e >= 4) estado = "Hay energía para moverse aunque el ánimo viene bajo; vamos de a poco.";
        else if (a <= 2 && e <= 2) estado = "Se siente pesado en ánimo y energía; vayamos suave y concreto.";
        else if (a >= 4 && e >= 4) estado = "Te noto con buena energía y ánimo; aprovechemos esa ola.";
        else estado = buildMoodLine(resultados);
      }

      const prev = buildPreviousLine(resultados);
      const hadSession = (resultados?.coach?.sesiones?.length || 0) > 0;
      const ref = hadSession ? "Qué bueno volver a encontrarnos." : "";
      const foco = "¿Por dónde te gustaría empezar hoy para que te sea útil?";

      const textoInicial = [saludoBase, ref, encuadre, estado, prev, foco]
        .filter(Boolean)
        .slice(0, 4)
        .join(" ")
        .replace(/^(te\s+entiendo|entiendo|comprendo|ok|vale)[\s,.\-:;¡!¿?]*/i, "")
        .trim();

      const arr = [{ autor: "coach", texto: textoInicial, ts: Date.now() }];
      setMensajes(arr);
      persist(arr);

      setResultados?.((prev) => ({
        ...(prev || {}),
        coach: {
          ...(prev?.coach || {}),
          convState: { ...(prev?.coach?.convState || { stage: "encuadre", step: 0 }), stage: "encuadre" },
        },
      }));

      if (reflexion) {
        setResultados?.((prev) => ({
          ...(prev || {}),
          coach: { ...(prev?.coach || {}), pendingReflection: String(reflexion) },
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [mensajes, typing]);

  const pushUser = (texto) => {
    const arr = [...mensajesRef.current, { autor: "usuario", texto, ts: Date.now() }];
    setMensajes(arr); persist(arr);
  };
  const pushCoach = async (texto) => {
    setTyping(true);
    await new Promise((r) => setTimeout(r, 350 + Math.random() * 350));
    setTyping(false);
    const arr = [...mensajesRef.current, { autor: "coach", texto, ts: Date.now() }];
    setMensajes(arr); persist(arr);
  };

  const isGoodbyeText = (txt) =>
    /(nos\s+vemos|hasta\s+luego|chau|chao|ad(i|í)os|cerramos|cortamos)\b/i.test(norm(txt));
  const sanitizeClient = (t) =>
    String(t || "")
      .replace(/^(te\s+entiendo|entiendo|comprendo|ok|vale)[\s,.\-:;¡!¿?]*/i, "")
      .replace(/\bsi te pinta\b/gi, "si te sirve")
      .replace(/\bposta\b/gi, "de verdad")
      .replace(/\bre\s+([a-záéíóúñ]+)/gi, "$1 muy")
      .replace(/\balto\s+([a-záéíóúñ]+)/gi, "$1 muy")
      .replace(/\bpiola\b/gi, "bien")
      .trim();

  const cerrarSesionConReflexion = async () => {
    if (closedRef.current) return;
    closedRef.current = true;
    const bank = [
      "Si mirás 7 días hacia adelante, ¿qué te gustaría que se note diferente gracias a vos?",
      "¿Qué querés repetir de lo que te sale bien cuando estás en tu mejor versión?",
      "¿Cuál sería el primer paso pequeño que harías en 48 horas?",
    ];
    const prompt = resultados?.coach?.pendingReflection || sample(bank);
    const cierre = `Me gustó acompañarte. Si querés, quedate con esta pregunta: “${prompt}”. Nos vemos 👋`;
    await pushCoach(cierre);
    setResultados?.((prev) => ({
      ...(prev || {}),
      coach: { ...(prev?.coach || {}), pendingReflection: null },
    }));
  };

  async function handleSaveSummary() {
    if (savingSummary || mensajes.length === 0) return;
    setSavingSummary(true);
    try {
      const transcript = buildTranscriptForSummary(mensajes).slice(0, 6000);
      const promptResumen = [
        "Actuá como secretaria de la coach. Leé el transcript y devolvé SOLO JSON con estas claves:",
        '{ "resumen": "3–5 frases, sin bullets, en voz neutra, sin consejos, foco en lo trabajado",',
        '  "tags": ["2 a 4 etiquetas cortas en minúsculas"] }',
        "",
        "TRANSCRIPT:",
        transcript
      ].join("\n");

      const resp = await askCoach(promptResumen, resultados?.perfil?.id || "demo", [], { preferOllama: true, mode: "session" });
      let raw = resp?.message_to_user || resp?.text || "";
      if (!raw || typeof raw !== "string") raw = JSON.stringify(resp || {});

      let resumen = "", tags = [];
      try {
        const m = raw.match(/\{[\s\S]*\}/);
        const obj = m ? JSON.parse(m[0]) : JSON.parse(raw);
        resumen = String(obj?.resumen || "").trim();
        tags = Array.isArray(obj?.tags) ? obj.tags.map(s => String(s).trim()).filter(Boolean).slice(0,4) : [];
      } catch {
        const parts = raw.replace(/^"+|"+$/g, "").split(/(?<=[.!?])\s+/).filter(Boolean);
        resumen = parts.slice(0,3).join(" ").slice(0, 600);
        tags = ["sesión", "maia"];
      }
      if (!resumen) resumen = "Sesión breve registrada.";

      addSesion({
        mensajes: mensajes.map(m => ({ autor: m.autor, texto: m.texto, ts: m.ts })),
        resumen, tags
      });

      await pushCoach("Listo, guardé un resumen corto de esta charla. Lo ves en “Últimas sesiones”.");
    } catch (e) {
      console.error("[Resumen] error:", e);
      await pushCoach("Se me cortó al guardar el resumen. Probemos de nuevo en un momento.");
    } finally {
      setSavingSummary(false);
    }
  }

  const enviarMensaje = async (txt) => {
    const texto = (txt ?? input).trim();
    if (!texto || typing) return;

    pushUser(texto);
    setInput("");

    if (isGoodbyeText(texto)) {
      if (!closedRef.current) {
        setTyping(true); await new Promise((r) => setTimeout(r, 250)); setTyping(false);
        await cerrarSesionConReflexion();
      }
      return;
    }

    // Llamada al backend
    setTyping(true);
    const recent = [...mensajesRef.current].slice(-10).map((m) => ({
      author: m.autor === "coach" ? "assistant" : "user", text: m.texto,
    }));

    if (currentAbort) { try { currentAbort.abort(); } catch {} }
    const controller = new AbortController();
    currentAbort = controller;
    const timer = setTimeout(() => controller.abort("timeout"), 180000);

    try {
      const extraCtx = [
        `Nombre: ${resultados?.perfil?.nombre || ""} (tratar de "vos")`,
        `Etapa: ${resultados?.coach?.convState?.stage || "encuadre"}`
      ].join(" | ");

      const userId =
        resultados?.perfil?.id ||
        resultados?.perfilUsuario?.id ||
        "demo";

      const dossier = {
        checkins: (resultados?.coach?.checkins || []).slice(0, 1),
        fortalezas: (resultados?.perfil?.fortalezas || []).slice(0, 3),
        perfil: { nombre: resultados?.perfil?.nombre || "" },
        games: resultados?.games || {},
      };

      // ✅ ÚNICA llamada al backend
      const apiResp = await askCoach(
        texto,
        userId,
        recent,
        { signal: controller.signal, extraContext: extraCtx, preferOllama: true, mode: "session", dossier }
      );

      clearTimeout(timer);
      if (currentAbort === controller) currentAbort = null;
      setTyping(false);

      const msgRaw = String(apiResp?.message_to_user || "").trim()
        || "Estoy acá con vos. ¿Querés contarme un poco más?";
      const msg = maybeAddHumanTail(sanitizeClient(msgRaw));

      await pushCoach(msg);
      console.log("[coach reply]", apiResp); // mirá acá el _debug
    } catch (err) {
      clearTimeout(timer);
      if (currentAbort === controller) currentAbort = null;
      setTyping(false);
      console.error("[CHAT] error llamando al backend", err);
      await pushCoach("Se me cortó la conexión. ¿Probamos de nuevo?");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); }
  };

  // Exportadores
  const exportTXT = () => {
    const lines = mensajes.map((m) => `${m.autor === "coach" ? "Coach" : "Yo"}: ${m.texto}`).join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "historial_coach.txt"; a.click();
    URL.revokeObjectURL(url);
  };
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("Historial de la sesión — Coach Maia", 20, 20);
    doc.setFontSize(10); doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 28);
    const rows = mensajes.map((m, i) => [i + 1, m.autor === "coach" ? "Coach" : "Usuario", m.texto]);
    doc.autoTable({ head: [["#", "Autor", "Mensaje"]], body: rows, startY: 35, styles: { fontSize: 10, cellPadding: 2 }, headStyles: { fillColor: [34, 197, 94] }, alternateRowStyles: { fillColor: [245, 245, 245] } });
    doc.save("historial_coach.pdf");
  };
  const canExport = mensajes.length > 0;

  /* ──────────────────────────────────────────────────────────────────────────
     Render
  ─────────────────────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border bg-white/70 backdrop-blur p-0 shadow-md overflow-hidden text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-amber-50 to-emerald-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-amber-200 shadow-sm bg-amber-50 grid place-items-center relative">
            <img src={COACH_AVATAR} alt="Maia" onError={(e)=>{e.currentTarget.style.display="none";}} className="w-full h-full object-cover"/>
            <span className="text-sm font-semibold text-amber-700 absolute select-none">M</span>
          </div>
          <div className="text-sm font-semibold text-slate-700">Coach {COACH_NAME}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-emerald-700">
            <FaCircle className="text-emerald-500" /><span>online • {helloByHour()}</span>
          </div>
          <div className="text-[11px] text-slate-500">Privado • guardado en tu dispositivo</div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 bg-[url('/assets/bg/fondo-coach-soft.png')] bg-cover bg-center text-slate-900" style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
        {mensajes.map((m, i) => (<Bubble key={i} author={m.autor === "coach" ? "coach" : "user"}>{m.texto}</Bubble>))}
        {typing && <Typing />}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex flex-wrap gap-2 bg-white/70 border-t">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu mensaje… (Shift+Enter para salto de línea)"
          rows={1}
          className="flex-1 rounded-xl border px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white resize-none"
        />
        <button
          onClick={() => enviarMensaje()}
          disabled={typing || !input.trim()}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {typing ? "Maia está pensando…" : "Enviar"}
        </button>
        <button
          onClick={cerrarSesionConReflexion}
          disabled={typing || closedRef.current}
          type="button"
          className="px-3 py-2 rounded-xl border text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Acciones inferiores */}
      <div className="px-3 pb-3 pt-2 flex gap-2 bg-white/70 border-t">
        <button
          onClick={handleSaveSummary}
          disabled={savingSummary || mensajes.length === 0}
          className={`text-xs px-3 py-1 rounded-lg border ${
            mensajes.length ? "bg-white hover:bg-slate-50" : "bg-white/50 text-slate-400 cursor-not-allowed"
          }`}
        >
          {savingSummary ? "Guardando…" : "Guardar resumen"}
        </button>
        <button
          onClick={exportTXT}
          disabled={!canExport}
          className={`text-xs px-3 py-1 rounded-lg border ${canExport ? "bg-white hover:bg-slate-50" : "bg-white/50 text-slate-400 cursor-not-allowed"}`}
        >
          Exportar .txt
        </button>
        <button
          onClick={exportPDF}
          disabled={!canExport}
          className={`text-xs px-3 py-1 rounded-lg border ${canExport ? "bg-white hover:bg-slate-50" : "bg-white/50 text-slate-400 cursor-not-allowed"}`}
        >
          Exportar .pdf
        </button>
      </div>
    </div>
  );
}
