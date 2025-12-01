// src/modules/juegos/JuegoRutaConocimiento.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResultados } from "../../context/ResultadosContext";

// 7 estaciones – estilos de aprendizaje
const ESTACIONES = [
  {
    id: 1,
    titulo: "Estación 1 · Primer contacto con un tema nuevo",
    texto:
      "Te presentan un tema totalmente nuevo que nunca viste. ¿Cómo preferís recibir la información por primera vez?",
    opciones: [
      {
        id: "visual",
        label: "Con esquemas, diagramas y ejemplos visuales.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label: "Escuchando una explicación clara, tipo clase o podcast.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label: "Viendo una demo en acción o probando algo práctico.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label: "Leyendo material escrito y marcando partes importantes.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label: "Con un caso real y un problema concreto para resolver.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 2,
    titulo: "Estación 2 · Recordar lo que estudiaste",
    texto:
      "Tenés que estudiar algo para recordarlo dentro de una semana. ¿Qué hacés para fijar mejor la información?",
    opciones: [
      {
        id: "visual",
        label: "Hago resúmenes con colores, cuadros y mapas mentales.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label: "Lo explico en voz alta o lo grabo y lo vuelvo a escuchar.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Armo ejercicios, ejemplos o simulaciones para usar lo que aprendí.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Escribo mis propias notas y conclusiones, conectándolo con ideas previas.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label: "Busco aplicarlo rápido en una situación real o pequeña tarea.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 3,
    titulo: "Estación 3 · Entender algo complejo",
    texto:
      "El contenido es difícil y técnico. Sentís que no lo estás entendiendo bien. ¿Qué hacés?",
    opciones: [
      {
        id: "visual",
        label:
          "Busco gráficos, ejemplos visuales o videos explicativos paso a paso.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label:
          "Le pido a alguien que me lo explique con sus palabras y hago preguntas.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Armo un ejemplo práctico, lo pruebo y aprendo mientras lo hago.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Vuelvo a leer con calma, tomo notas y trato de desarmar el concepto paso a paso.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label:
          "Busco cómo se usa eso en la vida real y lo conecto con un objetivo concreto.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 4,
    titulo: "Estación 4 · Aprender en equipo",
    texto:
      "Estás en un grupo de estudio o de trabajo. ¿Cuál es tu forma favorita de participar?",
    opciones: [
      {
        id: "visual",
        label: "Comparto pantallas, esquemas o slides para ordenar la info.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label: "Prefiero debatir, hacer preguntas y escuchar opiniones.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Propongo hacer una actividad práctica o simulación entre todos.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Me gusta observar, escuchar y luego aportar un análisis más pensado.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label:
          "Me enfoco en cómo llevar lo que hablamos a un resultado concreto.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 5,
    titulo: "Estación 5 · Preparar una presentación",
    texto:
      "Tenés que explicar un tema a otras personas. ¿Cómo preparás la presentación?",
    opciones: [
      {
        id: "visual",
        label: "Armo una presentación visual potente, con imágenes y esquemas.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label:
          "Practico lo que voy a decir en voz alta y ordeno bien el relato.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Incluyo actividades, preguntas o ejercicios para que participen.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Escribo un guion detallado con ideas clave y posibles preguntas.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label:
          "Me enfoco en ejemplos reales, casos prácticos y resultados concretos.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 6,
    titulo: "Estación 6 · Mantener la concentración",
    texto:
      "Tenés que estudiar o trabajar durante un buen rato. ¿Qué te ayuda más a mantener el foco?",
    opciones: [
      {
        id: "visual",
        label:
          "Tener a la vista listas, tableros o avances que pueda ir tachando.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label:
          "Escuchar música específica, audios o tener pequeños momentos de conversación.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Hacer pausas activas, mover el cuerpo o cambiar de lugar físicamente.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Trabajar en bloques de silencio profundo y luego revisar lo hecho.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label: "Dividir la tarea en objetivos cortos con resultados claros.",
        efectos: { practico: 2 },
      },
    ],
  },
  {
    id: 7,
    titulo: "Estación 7 · Sentir que realmente aprendiste",
    texto:
      "Terminaste de estudiar un tema. ¿Cuándo sentís que realmente lo dominás?",
    opciones: [
      {
        id: "visual",
        label:
          "Cuando puedo dibujarlo o explicarlo con un esquema en una hoja o pizarra.",
        efectos: { visual: 2 },
      },
      {
        id: "auditivo",
        label: "Cuando puedo explicarlo en voz alta y responder preguntas.",
        efectos: { auditivo: 2 },
      },
      {
        id: "kinestesico",
        label:
          "Cuando lo probé en la práctica y vi que funciona en acción.",
        efectos: { kinestesico: 2 },
      },
      {
        id: "reflexivo",
        label:
          "Cuando logré conectarlo con otras ideas y sacar mis propias conclusiones.",
        efectos: { reflexivo: 2 },
      },
      {
        id: "practico",
        label:
          "Cuando pude usarlo para lograr un resultado concreto o resolver un problema real.",
        efectos: { practico: 2 },
      },
    ],
  },
];

const ESTILO_LABEL = {
  visual: "Aprendizaje visual",
  auditivo: "Aprendizaje auditivo",
  kinestesico: "Aprendizaje kinestésico",
  reflexivo: "Aprendizaje reflexivo",
  practico: "Aprendizaje práctico",
};

export default function JuegoRutaConocimiento() {
  const router = useRouter();
  const { setResultados } = useResultados();

  const [paso, setPaso] = useState(0);
  const [puntajes, setPuntajes] = useState({
    visual: 0,
    auditivo: 0,
    kinestesico: 0,
    reflexivo: 0,
    practico: 0,
  });
  const [historial, setHistorial] = useState([]);

  const estacionActual = ESTACIONES[paso];

  const finalizarJuego = (puntajesFinales, historialCompleto) => {
    const entries = Object.entries(puntajesFinales);
    const [ganador] = entries.sort((a, b) => b[1] - a[1])[0];
    const estiloDominante = ganador;
    const etiqueta = ESTILO_LABEL[ganador] || ganador;

    const resumen =
      estiloDominante === "visual"
        ? "Tu mente funciona muy bien con estímulos visuales: esquemas, mapas, colores e imágenes. Si convertís lo complejo en algo gráfico, lo aprendés mucho más rápido."
        : estiloDominante === "auditivo"
        ? "Retenés muy bien cuando escuchás, conversás o explicás en voz alta. Las explicaciones orales y los intercambios te ayudan a fijar el conocimiento."
        : estiloDominante === "kinestesico"
        ? "Tu mejor forma de aprender es haciendo. Cuando probás, experimentás y te movés, el contenido se vuelve real y se fija."
        : estiloDominante === "reflexivo"
        ? "Necesitás tiempo para pensar, conectar ideas y sacar conclusiones propias. El silencio, la lectura y el análisis profundo son tus aliados."
        : "Aprendés mejor cuando podés aplicar rápido lo que ves a casos reales o problemas concretos. Si algo tiene un uso práctico, lo dominás mejor.";

    // Guardar en resultados.juegos.aprendizaje
    setResultados((prev) => {
      const juegosPrev = prev?.juegos || {};
      const previo = juegosPrev.aprendizaje || {};
      return {
        ...prev,
        juegos: {
          ...juegosPrev,
          aprendizaje: {
            ...previo,
            completado: true,
            fechaISO: new Date().toISOString(),
            estiloDominante,
            etiquetaEstilo: etiqueta,
            resumen,
            puntajes: puntajesFinales,
            estaciones: historialCompleto,
          },
        },
      };
    });

    router.push("/juegos");
  };

  const avanzar = (opcion) => {
    const nuevosPuntajes = { ...puntajes };
    Object.entries(opcion.efectos).forEach(([clave, valor]) => {
      nuevosPuntajes[clave] = (nuevosPuntajes[clave] || 0) + valor;
    });

    const nuevoHistorial = [
      ...historial,
      { estacionId: estacionActual.id, opcionId: opcion.id },
    ];

    setPuntajes(nuevosPuntajes);
    setHistorial(nuevoHistorial);

    const esUltima = paso >= ESTACIONES.length - 1;

    if (esUltima) {
      finalizarJuego(nuevosPuntajes, nuevoHistorial);
    } else {
      setPaso((p) => p + 1);
    }
  };

  return (
    <div className="min-h-screen relative font-[Encode_Sans_Expanded] text-[#FFEEEE]">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover bg-fixed"
        style={{ backgroundImage: "url('/assets/Perfil-Inicial-fondo.png')" }}
      />
      <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-md" />

      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Header módulo */}
        <section className="rounded-3xl border border-cyan-400/40 bg-slate-950/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
                Juego 2 · Ruta del Conocimiento
              </p>
              <h1 className="text-xl md:text-2xl font-semibold mb-1">
                Explorador de estilos de aprendizaje
              </h1>
              <p className="text-sm text-[#e5f9ff]/85 max-w-xl">
                Vas a recorrer distintas estaciones con situaciones cotidianas.
                Cada respuesta suma puntos a estilos de aprendizaje. Al final
                vas a ver qué forma de aprender es más natural para vos.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-200/85">
              <p>
                Estación {paso + 1} de {ESTACIONES.length}
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-black/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400"
                  style={{
                    width: `${((paso + 1) / ESTACIONES.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Estación actual */}
        <section className="rounded-2xl border border-white/12 bg-slate-950/90 backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.7)] space-y-4">
          <header>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">
              Estación {estacionActual.id}
            </p>
            <h2 className="text-sm md:text-base font-semibold mb-2">
              {estacionActual.titulo}
            </h2>
            <p className="text-sm text-[#f9fafb]/85">{estacionActual.texto}</p>
          </header>

          <div className="space-y-2">
            {estacionActual.opciones.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => avanzar(op)}
                className="w-full text-left rounded-2xl border border-cyan-400/40 bg-slate-900/80 hover:bg-cyan-500/10 hover:border-cyan-300 px-3.5 py-2.5 text-[13px] text-slate-100 transition"
              >
                {op.label}
              </button>
            ))}
          </div>
        </section>

        {/* pie */}
        <div className="flex justify-between text-[11px] text-slate-300/80">
          <button
            type="button"
            onClick={() => router.push("/juegos")}
            className="px-3 py-1.5 rounded-xl border border-white/25 bg-black/40 hover:bg-black/70 transition"
          >
            Volver al menú de juegos
          </button>
          <p>
            Cada elección suma puntos a estilos de aprendizaje. El resultado
            final se guardará en tu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
