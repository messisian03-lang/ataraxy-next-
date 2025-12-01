// src/modules/coach/CoachVirtual.jsx
"use client";

import { useState, useMemo } from "react";
import { useResultados } from "../../context/ResultadosContext";

// Construye el contexto que se manda al endpoint /api/coach
function buildCoachContext(resultados) {
  if (!resultados) return {};

  const perfil = resultados.perfil || {};
  const diagnostico = resultados.diagnostico || {};
  const juegos = resultados.juegos || {};
  const coach = resultados.coach || {};
  const gamificacion = resultados.gamificacion || {};

  // Compat: el juego emocional puede estar en juegos.controlEmocional o juegos.emocional
  const juegoEmocional = juegos.controlEmocional || juegos.emocional || null;

  return {
    perfil: {
      nombre: perfil.nombre || null,
      edad: perfil.edad || null,
      rolActual: perfil.rolActual || null,
      objetivoPrincipal: perfil.objetivoPrincipal || null,
      estiloAprendizaje: perfil.estiloAprendizaje || null,
    },
    diagnostico: {
      resumen: diagnostico.resumen || null,
      rasgos: diagnostico.rasgos || [],
      estilos: diagnostico.estilos || [],
      perfilTexto: diagnostico.perfilTexto || null,
    },
    juegos: {
      liderazgo: juegos.liderazgo || null,
      aprendizaje: juegos.aprendizaje || null,
      emocional: juegoEmocional,
      radarHabilidades: juegos.radarHabilidades || null,
    },
    coach: {
      objetivos: coach.objetivos || [],
      habitos: coach.habitos || [],
      checkins: coach.checkins || [],
      preferencias: coach.preferences || {},
      ultimaSesion: coach.sesiones?.[0] || null,
    },
    gamificacion: {
      level: gamificacion.level || 1,
      xp: gamificacion.xp || 0,
      coins: gamificacion.coins || 0,
      streak: gamificacion.streak || { count: 0 },
    },
  };
}

// Helper para armar la frase "liderazgo…, aprendizaje… y emocional…"
function buildLineaPerfilDesdeJuegos(juegos) {
  if (!juegos) return "";

  const liderazgo = juegos.liderazgo || null;
  const aprendizaje = juegos.aprendizaje || null;
  const emocional = juegos.emocional || null;

  const partes = [];

  if (liderazgo) {
    const etiquetaLiderazgo =
      liderazgo.etiquetaEstilo ||
      liderazgo.estiloDominante ||
      null;

    if (etiquetaLiderazgo) {
      partes.push(
        `tu liderazgo tiende a ser ${String(etiquetaLiderazgo).toLowerCase()}`
      );
    }
  }

  if (aprendizaje) {
    const etiquetaAprendizaje =
      aprendizaje.etiquetaEstilo ||
      aprendizaje.estiloDominante ||
      aprendizaje.estilo ||
      null;

    if (etiquetaAprendizaje) {
      partes.push(
        `aprendés mejor de forma ${String(etiquetaAprendizaje).toLowerCase()}`
      );
    }
  }

  if (emocional) {
    const etiquetaEmocional =
      emocional.puntoFuerte ||
      emocional.etiquetaEstilo ||
      emocional.estiloDominante ||
      null;

    if (etiquetaEmocional) {
      partes.push(
        `tu punto fuerte emocional es ${String(etiquetaEmocional).toLowerCase()}`
      );
    }
  }

  if (partes.length === 0) return "";

  if (partes.length === 1) return `Veo en tus datos que ${partes[0]}`;
  if (partes.length === 2)
    return `Veo en tus datos que ${partes[0]} y ${partes[1]}`;

  // 3 partes
  return `Veo en tus datos que ${partes[0]}, ${partes[1]} y ${partes[2]}`;
}

export default function CoachVirtual() {
  const { resultados } = useResultados() || {};
  const contextoCoach = useMemo(
    () => buildCoachContext(resultados),
    [resultados]
  );

  const nombre = contextoCoach.perfil?.nombre || "Explorador/a";

  // Construimos el mensaje inicial PRO usando juegos + diagnóstico
  const lineaPerfil = buildLineaPerfilDesdeJuegos(contextoCoach.juegos);
  const tieneDiagnostico = !!contextoCoach.diagnostico?.resumen;

  const mensajeInicial =
    `Hola ${nombre}, soy tu Coach Virtual Ataraxia. ` +
    (lineaPerfil ? `${lineaPerfil}. ` : "") +
    (tieneDiagnostico
      ? "Ya tengo una primera foto de tu perfil a partir del diagnóstico y los juegos. "
      : "") +
    "Vamos a trabajar como en una sesión presencial: con preguntas profundas, foco y seguimiento. ¿Qué te gustaría explorar hoy?";

  const [mensajes, setMensajes] = useState([
    {
      de: "coach",
      texto: mensajeInicial,
    },
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [sugerencias, setSugerencias] = useState([
    "Quiero aclarar mi objetivo principal",
    "Me siento bloqueado/a y no sé por qué",
    "Quiero aprovechar mejor mis fortalezas",
  ]);

  const handleSend = async (e) => {
    e?.preventDefault?.();
    const texto = input.trim();
    if (!texto) return;

    const nuevoHistorial = [
      ...mensajes,
      { de: "usuario", texto },
    ];

    setMensajes(nuevoHistorial);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajeUsuario: texto,
          contexto: contextoCoach,
          historial: nuevoHistorial.slice(-10), // últimas 10 interacciones
        }),
      });

      const data = await res.json();

      const respuesta =
        data?.reply ||
        data?.mensaje ||
        "Estoy procesando lo que me contás…";
      const nuevasSugerencias = data?.sugerencias || null;

      setMensajes((prev) => [
        ...prev,
        { de: "coach", texto: respuesta },
      ]);

      if (Array.isArray(nuevasSugerencias) && nuevasSugerencias.length > 0) {
        setSugerencias(nuevasSugerencias);
      }
    } catch (err) {
      console.error(err);
      setMensajes((prev) => [
        ...prev,
        {
          de: "coach",
          texto:
            "Tuvimos un problema técnico al hablar con el motor de IA. Probemos de nuevo en unos instantes.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleQuickSuggestion = (texto) => {
    setInput(texto);
    // si querés, después podemos hacer que se envíe automáticamente
  };

  const handleReflexionGuiada = () => {
    const reflexion = contextoCoach.diagnostico?.perfilTexto
      ? "Leí tu diagnóstico y veo varios rasgos interesantes. Si querés, podemos hacer una mini reflexión sobre cómo esos rasgos aparecen en tu día a día. ¿Dónde sentís que más se nota tu estilo actual?"
      : "Te propongo una reflexión guiada: pensá en una situación reciente donde te sentiste muy vos mismo/a. ¿Qué estabas haciendo? ¿Con quién? ¿Qué habilidades pusiste en juego?";

    setMensajes((prev) => [
      ...prev,
      { de: "coach", texto: reflexion },
    ]);
  };

  const ultimosCheckins = contextoCoach.coach?.checkins?.slice(0, 3) || [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] max-w-6xl mx-auto">
      {/* Columna principal: Chat */}
      <div className="space-y-4">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">
            Coach Virtual • Ataraxia
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#FFEEEE]">
            Sesión con tu Coach
          </h1>
          <p className="text-sm text-slate-200/80 max-w-2xl">
            Vamos a usar tu diagnóstico, tus juegos y tu perfil para darte una
            devolución realmente personalizada. Podés hablar como hablarías en
            una sesión cara a cara.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl min-h-[320px] flex flex-col">
          <div className="flex-1 p-4 space-y-3 overflow-auto max-h-[430px]">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.de === "usuario" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.de === "usuario"
                      ? "bg-cyan-500 text-slate-950 rounded-br-none"
                      : "bg-slate-800/80 text-slate-50 rounded-bl-none border border-cyan-500/40"
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}
            {cargando && (
              <p className="text-[11px] text-slate-400 italic">
                El coach está pensando...
              </p>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-top border-white/10 p-3 flex flex-col gap-2"
          >
            <div className="flex flex-wrap gap-2 text-[11px]">
              {sugerencias.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSuggestion(s)}
                  className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-200 border border-white/10 hover:border-cyan-400/70 hover:text-cyan-200 transition"
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={handleReflexionGuiada}
                className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-200 border border-cyan-500/60 hover:bg-cyan-500/20 text-[11px]"
              >
                Activar reflexión guiada
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-slate-950/80 border border-white/15 rounded-xl px-3 py-2 text-sm outline-none focus:border-cyan-400/80"
                placeholder="Escribí algo que te preocupe, un objetivo o una situación concreta que quieras trabajar..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={cargando}
                className="px-4 py-2 text-sm rounded-xl bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Columna derecha: contexto muy visual */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
          <h2 className="text-sm font-semibold text-[#FFEEEE] mb-1">
            Resumen rápido de tu perfil
          </h2>
          <p className="text-xs text-slate-200/80">
            <strong>Objetivo principal: </strong>
            {contextoCoach.perfil?.objetivoPrincipal ||
              "Todavía no definido con claridad."}
          </p>
          <p className="text-xs text-slate-200/80 mt-1">
            <strong>Estilo de aprendizaje: </strong>
            {contextoCoach.perfil?.estiloAprendizaje || "Aún por explorar."}
          </p>
          {!!contextoCoach.diagnostico?.resumen && (
            <p className="text-xs text-slate-200/80 mt-2">
              <strong>Diagnóstico: </strong>
              {contextoCoach.diagnostico.resumen}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4">
          <h2 className="text-sm font-semibold text-[#FFEEEE] mb-2">
            Últimos check-ins
          </h2>
          {ultimosCheckins.length === 0 && (
            <p className="text-xs text-slate-300/70">
              Todavía no registraste check-ins emocionales. Más adelante el
              coach usará estos datos para ajustar el tono y las
              recomendaciones.
            </p>
          )}
          {ultimosCheckins.map((c, idx) => (
            <div key={idx} className="text-xs text-slate-200/80 mb-1">
              <span className="opacity-70">
                {new Date(c.fechaISO).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                :
              </span>{" "}
              ánimo {c.animo ?? "-"} · energía {c.energia ?? "-"}{" "}
              {c.nota ? `· "${c.nota}"` : ""}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
