// src/modules/juegos/JuegoControlEmocional.jsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResultados } from "../../context/ResultadosContext";

// Escenarios del juego (7 escenas)
const ESCENAS = [
  {
    id: 1,
    titulo: "Mensaje tenso inesperado",
    texto:
      "Recibís un mensaje o mail con tono tenso o agresivo sobre tu trabajo. Te impacta emocionalmente.",
    opciones: [
      {
        id: "autoreg",
        label:
          "Respiro profundo, no respondo de inmediato y dejo que baje la intensidad antes de contestar.",
        efectos: { autoreg: 2 },
      },
      {
        id: "empatia",
        label:
          "Intento entender qué le pudo pasar a la otra persona antes de responder.",
        efectos: { empatia: 2 },
      },
      {
        id: "decisiones",
        label:
          "Respondo breve, pido aclaraciones concretas y propongo una reunión para ordenar el tema.",
        efectos: { decisiones: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Aclaro cómo me hizo sentir el mensaje y marco los límites de forma respetuosa.",
        efectos: { comunicacion: 2 },
      },
    ],
  },
  {
    id: 2,
    titulo: "Feedback duro frente a otros",
    texto:
      "Recibís un feedback crítico frente a otras personas. Te incomoda la situación.",
    opciones: [
      {
        id: "autoreg",
        label:
          "Controlo mi reacción, escucho todo y anoto para revisarlo luego con más calma.",
        efectos: { autoreg: 2 },
      },
      {
        id: "reconocimiento",
        label:
          "Identifico qué parte del feedback es válida, aunque el formato no haya sido el mejor.",
        efectos: { reconocimiento: 2 },
      },
      {
        id: "empatia",
        label:
          "Pienso que quizás la otra persona también está bajo presión y no eligió el mejor modo.",
        efectos: { empatia: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Pido continuar la conversación en privado para poder expresarme mejor.",
        efectos: { comunicacion: 2 },
      },
    ],
  },
  {
    id: 3,
    titulo: "Plazo imposible",
    texto:
      "Te piden algo con un plazo muy corto, que sabés que puede afectar tu bienestar o calidad del trabajo.",
    opciones: [
      {
        id: "decisiones",
        label:
          "Evalúo opciones, marco qué se puede hacer y qué no, y propongo un plan realista.",
        efectos: { decisiones: 2 },
      },
      {
        id: "autoreg",
        label:
          "Tomo unos minutos para ordenar mis ideas antes de responder el pedido.",
        efectos: { autoreg: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Comunico con claridad el impacto del plazo y qué condiciones necesito para cumplirlo.",
        efectos: { comunicacion: 2 },
      },
      {
        id: "empatia",
        label:
          "Pregunto qué tan urgente es realmente y qué está pasando detrás de esa urgencia.",
        efectos: { empatia: 2 },
      },
    ],
  },
  {
    id: 4,
    titulo: "Conflicto entre dos personas",
    texto:
      "Dos personas de tu entorno se enfrentan y la tensión empieza a afectar al grupo.",
    opciones: [
      {
        id: "empatia",
        label:
          "Escucho a cada una por separado para comprender sus necesidades y emociones.",
        efectos: { empatia: 2 },
      },
      {
        id: "reconocimiento",
        label:
          "Identifico las emociones principales que aparecen en la situación (miedo, enojo, frustración).",
        efectos: { reconocimiento: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Facilito una conversación donde cada una pueda expresar su punto de vista con respeto.",
        efectos: { comunicacion: 2 },
      },
      {
        id: "decisiones",
        label:
          "Defino reglas básicas de convivencia y acuerdos mínimos para seguir trabajando juntos.",
        efectos: { decisiones: 2 },
      },
    ],
  },
  {
    id: 5,
    titulo: "Error propio visible",
    texto:
      "Cometés un error importante y otras personas lo notan. Sentís vergüenza o frustración.",
    opciones: [
      {
        id: "reconocimiento",
        label:
          "Reconozco mi error sin excusas y lo tomo como material de aprendizaje.",
        efectos: { reconocimiento: 2 },
      },
      {
        id: "autoreg",
        label:
          "Gestión mi diálogo interno para no caer en la autocrítica destructiva.",
        efectos: { autoreg: 2 },
      },
      {
        id: "empatia",
        label:
          "Me doy permiso para sentirme mal un momento, como le pasaría a cualquiera.",
        efectos: { empatia: 2 },
      },
      {
        id: "decisiones",
        label:
          "Defino pasos concretos para reparar el error o reducir su impacto.",
        efectos: { decisiones: 2 },
      },
    ],
  },
  {
    id: 6,
    titulo: "Ambiente muy cargado",
    texto:
      "El ambiente está tenso: muchas quejas, críticas y mala energía en el entorno.",
    opciones: [
      {
        id: "autoreg",
        label:
          "Cuido mis propios límites emocionales y evito engancharme en conversaciones que me drenan.",
        efectos: { autoreg: 2 },
      },
      {
        id: "empatia",
        label:
          "Intento entender qué está generando esa tensión general y escucho sin juzgar.",
        efectos: { empatia: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Hablo abiertamente del clima que se está generando y propongo mejorarlo.",
        efectos: { comunicacion: 2 },
      },
      {
        id: "decisiones",
        label:
          "Propongo cambios concretos (reuniones, definiciones, descansos) para cambiar la dinámica.",
        efectos: { decisiones: 2 },
      },
    ],
  },
  {
    id: 7,
    titulo: "Tomar una decisión bajo presión",
    texto:
      "Tenés que tomar una decisión importante con poco tiempo y mucha presión emocional.",
    opciones: [
      {
        id: "decisiones",
        label:
          "Defino criterios claros, elijo la mejor opción posible y asumo la responsabilidad.",
        efectos: { decisiones: 2 },
      },
      {
        id: "autoreg",
        label:
          "Me tomo un momento breve para centrarme y bajar la ansiedad antes de decidir.",
        efectos: { autoreg: 2 },
      },
      {
        id: "reconocimiento",
        label:
          "Identifico qué emociones están influyendo para no decidir solo desde ellas.",
        efectos: { reconocimiento: 2 },
      },
      {
        id: "comunicacion",
        label:
          "Comunico la decisión con claridad, explicando por qué se eligió ese camino.",
        efectos: { comunicacion: 2 },
      },
    ],
  },
];

const ESTILO_LABEL = {
  autoreg: "Autorregulación emocional",
  empatia: "Empatía y vínculo",
  reconocimiento: "Reconocimiento emocional",
  decisiones: "Decisiones bajo presión",
  comunicacion: "Comunicación asertiva",
};

export default function JuegoControlEmocional() {
  const router = useRouter();
  const { setResultados } = useResultados();

  const [paso, setPaso] = useState(0);
  const [puntajes, setPuntajes] = useState({
    autoreg: 0,
    empatia: 0,
    reconocimiento: 0,
    decisiones: 0,
    comunicacion: 0,
  });
  const [historial, setHistorial] = useState([]);

  const escenaActual = ESCENAS[paso];

  const finalizarJuego = (puntajesFinales, historialCompleto) => {
    const entries = Object.entries(puntajesFinales);
    const [ganador] = entries.sort((a, b) => b[1] - a[1])[0];
    const estiloDominante = ganador;
    const etiqueta = ESTILO_LABEL[ganador] || ganador;

    const resumen =
      estiloDominante === "autoreg"
        ? "Tu punto fuerte es la autorregulación: tenés recursos para gestionarte cuando las emociones se intensifican."
        : estiloDominante === "empatia"
        ? "Destacás por tu empatía: te conectás con los demás y entendés lo que sienten, incluso en momentos difíciles."
        : estiloDominante === "reconocimiento"
        ? "Tenés buena lectura emocional: identificás con claridad lo que pasa adentro tuyo y en el ambiente."
        : estiloDominante === "decisiones"
        ? "Sos fuerte tomando decisiones bajo presión: priorizás, elegís y avanzás incluso en escenarios tensos."
        : "Tu fortaleza está en la comunicación asertiva: ponés en palabras lo que necesitás con claridad y respeto.";

    // Guardar en resultados.juegos.controlEmocional
    setResultados((prev) => {
      const juegosPrev = prev?.juegos || {};
      const previo = juegosPrev.controlEmocional || {};
      return {
        ...prev,
        juegos: {
          ...juegosPrev,
          controlEmocional: {
            ...previo,
            completado: true,
            fechaISO: new Date().toISOString(),
            estiloDominante,
            etiquetaEstilo: etiqueta,
            resumen,
            puntajes: puntajesFinales,
            escenarios: historialCompleto,
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
      { escenaId: escenaActual.id, opcionId: opcion.id },
    ];

    setPuntajes(nuevosPuntajes);
    setHistorial(nuevoHistorial);

    const esUltima = paso >= ESCENAS.length - 1;

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
        <section className="rounded-3xl border border-emerald-400/45 bg-slate-950/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-emerald-300/90 mb-1">
                Juego 3 · Control Central Emocional
              </p>
              <h1 className="text-xl md:text-2xl font-semibold mb-1">
                Simulador de gestión emocional
              </h1>
              <p className="text-sm text-[#e5f9ff]/85 max-w-xl">
                Vas a atravesar escenas con presión, conflicto y emociones
                intensas. Cada respuesta suma puntos a distintas habilidades
                emocionales. Al final vas a ver cuál es tu tendencia principal
                para gestionar emociones.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-200/85">
              <p>
                Escena {paso + 1} de {ESCENAS.length}
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-black/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                  style={{
                    width: `${((paso + 1) / ESCENAS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Escena actual */}
        <section className="rounded-2xl border border-white/12 bg-slate-950/90 backdrop-blur-xl p-5 shadow-[0_18px_50px_rgba(0,0,0,0.7)] space-y-4">
          <header>
            <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/90 mb-1">
              Escena {escenaActual.id}
            </p>
            <h2 className="text-sm md:text-base font-semibold mb-2">
              {escenaActual.titulo}
            </h2>
            <p className="text-sm text-[#f9fafb]/85">{escenaActual.texto}</p>
          </header>

          <div className="space-y-2">
            {escenaActual.opciones.map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => avanzar(op)}
                className="w-full text-left rounded-2xl border border-emerald-400/45 bg-slate-900/80 hover:bg-emerald-500/10 hover:border-emerald-300 px-3.5 py-2.5 text-[13px] text-slate-100 transition"
              >
                {op.label}
              </button>
            ))}
          </div>
        </section>

        {/* Pie */}
        <div className="flex justify-between text-[11px] text-slate-300/80">
          <button
            type="button"
            onClick={() => router.push("/juegos")}
            className="px-3 py-1.5 rounded-xl border border-white/25 bg-black/40 hover:bg-black/70 transition"
          >
            Volver al menú de juegos
          </button>
          <p>
            Cada elección suma puntos a habilidades emocionales. El resultado
            final se guardará en tu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
