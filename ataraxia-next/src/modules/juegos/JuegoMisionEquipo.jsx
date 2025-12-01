"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResultados } from "../../context/ResultadosContext";

const ESCENAS = [
  {
    id: 1,
    titulo: "Inicio de la misión",
    texto:
      "Tu equipo tiene que entregar un proyecto clave en 48 horas. Hay presión, poco tiempo y varias tareas abiertas.",
    opciones: [
      {
        id: "estrategico",
        label:
          "Divido el proyecto en tareas claras y asigno responsables según fortalezas.",
        efectos: { estrategico: 2 },
      },
      {
        id: "empatico",
        label:
          "Primero pregunto cómo se siente el equipo y qué necesita para avanzar.",
        efectos: { empatico: 2 },
      },
      {
        id: "directivo",
        label:
          "Doy órdenes claras y marco un horario estricto para cada entrega.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Organizo una mini-reunión para que el equipo proponga el plan y yo ayudo a ordenar las ideas.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 2,
    titulo: "Conflicto interno",
    texto:
      "Dos personas del equipo discuten fuerte sobre la mejor forma de resolver una parte crítica del proyecto.",
    opciones: [
      {
        id: "empatico",
        label:
          "Escucho a cada uno por separado, intento entender sus puntos y luego facilito un acuerdo.",
        efectos: { empatico: 2, facilitador: 1 },
      },
      {
        id: "directivo",
        label:
          "Corto la discusión, tomo la decisión final y les pido que sigan el plan sin más vueltas.",
        efectos: { directivo: 2 },
      },
      {
        id: "estrategico",
        label:
          "Les pido que cada uno argumente con datos y resultados esperados, y elegimos la opción más sólida.",
        efectos: { estrategico: 2 },
      },
      {
        id: "facilitador",
        label:
          "Les propongo hacer una breve dinámica para integrar ambas propuestas y buscar un punto medio.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 3,
    titulo: "Cambio inesperado del cliente",
    texto:
      "El cliente cambia una parte importante del pedido a último momento. Hay que ajustar el rumbo.",
    opciones: [
      {
        id: "estrategico",
        label:
          "Replanteo prioridades, redefino el alcance y ajusto el plan con foco en lo más crítico.",
        efectos: { estrategico: 2, directivo: 1 },
      },
      {
        id: "empatico",
        label:
          "Contengo al equipo, reconozco el esfuerzo hecho hasta ahora y pregunto quién necesita apoyo.",
        efectos: { empatico: 2 },
      },
      {
        id: "directivo",
        label:
          "Redistribuyo tareas de inmediato, asigno horas extras si hace falta y marco un nuevo deadline.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Abro un breve espacio para que el equipo proponga alternativas creativas y decidimos juntos.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 4,
    titulo: "Sobrecarga de trabajo",
    texto:
      "Una parte del equipo está al límite de carga y otra aún tiene capacidad disponible.",
    opciones: [
      {
        id: "estrategico",
        label:
          "Reorganizo el tablero de tareas para equilibrar la carga de forma objetiva.",
        efectos: { estrategico: 2 },
      },
      {
        id: "empatico",
        label:
          "Tengo una conversación 1 a 1 con quienes están sobrecargados para entender qué necesitan.",
        efectos: { empatico: 2 },
      },
      {
        id: "directivo",
        label:
          "Redistribuyo tareas sin mucha explicación y marco un nuevo esquema de trabajo obligatorio.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Abro un espacio breve para que el equipo acuerde cómo redistribuir tareas de manera justa.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 5,
    titulo: "Miembro clave se ausenta",
    texto:
      "Una persona con un rol crítico avisa que no podrá estar disponible el resto del día.",
    opciones: [
      {
        id: "estrategico",
        label:
          "Identifico qué tareas son críticas y reasigno prioridades para minimizar el impacto.",
        efectos: { estrategico: 2 },
      },
      {
        id: "empatico",
        label:
          "Escucho el motivo, acompaño la situación personal y busco opciones con el resto del equipo.",
        efectos: { empatico: 2 },
      },
      {
        id: "directivo",
        label:
          "Defino rápidamente quién reemplaza ese rol y ajusto el timeline sin consultar demasiado.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Conversamos en grupo cómo cubrir la ausencia y repartimos pequeñas partes del rol entre varios.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 6,
    titulo: "Feedback al desempeño del equipo",
    texto:
      "Durante la misión notaste conductas muy positivas y otras que podrían mejorarse.",
    opciones: [
      {
        id: "empatico",
        label:
          "Doy feedback individual resaltando fortalezas y ofreciendo acompañamiento en lo que cuesta.",
        efectos: { empatico: 2 },
      },
      {
        id: "estrategico",
        label:
          "Genero un documento con aprendizajes y próximos pasos concretos para el próximo proyecto.",
        efectos: { estrategico: 2 },
      },
      {
        id: "directivo",
        label:
          "Marco con claridad qué conductas no se van a tolerar y qué estándar espero a futuro.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Propongo una retro grupal donde todos puedan compartir qué vieron y qué quieren mejorar.",
        efectos: { facilitador: 2 },
      },
    ],
  },
  {
    id: 7,
    titulo: "Error del equipo frente al cliente",
    texto:
      "En una reunión importante, alguien del equipo comete un error visible frente al cliente.",
    opciones: [
      {
        id: "estrategico",
        label:
          "Redirijo la conversación hacia la solución y luego planifico internamente cómo evitarlo a futuro.",
        efectos: { estrategico: 2 },
      },
      {
        id: "empatico",
        label:
          "Contengo a la persona, la apoyo frente al cliente y refuerzo que el error es compartido.",
        efectos: { empatico: 2 },
      },
      {
        id: "directivo",
        label:
          "Corrijo el dato en el momento y tomo el control de la reunión para cerrar con firmeza.",
        efectos: { directivo: 2 },
      },
      {
        id: "facilitador",
        label:
          "Luego de la reunión, genero un espacio para revisar en equipo lo ocurrido y aprender juntos.",
        efectos: { facilitador: 2 },
      },
    ],
  },
];

const ESTILO_LABEL = {
  estrategico: "Liderazgo estratégico",
  empatico: "Liderazgo empático",
  directivo: "Liderazgo directivo",
  facilitador: "Liderazgo facilitador",
};

export default function JuegoMisionEquipo() {
  const router = useRouter();
  const { setResultados } = useResultados();

  const [paso, setPaso] = useState(0);
  const [puntajes, setPuntajes] = useState({
    estrategico: 0,
    empatico: 0,
    directivo: 0,
    facilitador: 0,
  });
  const [historial, setHistorial] = useState([]);

  const escenaActual = ESCENAS[paso];

  const finalizarJuego = (puntajesFinales, historialCompleto) => {
    const entries = Object.entries(puntajesFinales);
    const [ganador] = entries.sort((a, b) => b[1] - a[1])[0];
    const estiloDominante = ganador;
    const etiqueta = ESTILO_LABEL[ganador] || ganador;

    const resumen =
      estiloDominante === "estrategico"
        ? "Tendés a liderar desde la planificación, la claridad de objetivos y la visión global."
        : estiloDominante === "empatico"
        ? "Tu liderazgo se apoya en la empatía, la escucha y el cuidado del clima del equipo."
        : estiloDominante === "directivo"
        ? "Te sentís cómodo tomando decisiones rápidas, marcando el rumbo y asumiendo la responsabilidad."
        : "Te orientás a facilitar la participación, integrar perspectivas y construir decisiones compartidas.";

    // ⬇️ Guardamos directamente en resultados.juegos.liderazgo
    setResultados((prev) => {
      const juegosPrev = prev?.juegos || {};
      const previo = juegosPrev.liderazgo || {};
      return {
        ...prev,
        juegos: {
          ...juegosPrev,
          liderazgo: {
            ...previo,
            completado: true,
            fechaISO: new Date().toISOString(),
            estiloDominante,
            etiquetaEstilo: etiqueta,
            resumen,
            puntajes: puntajesFinales,
            historial: historialCompleto,
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
        {/* Header misión */}
        <section className="rounded-3xl border border-cyan-400/40 bg-slate-950/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.75)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-1">
                Juego 1 · Misión en Equipo
              </p>
              <h1 className="text-xl md:text-2xl font-semibold mb-1">
                Simulador de liderazgo en misión
              </h1>
              <p className="text-sm text-[#e5f9ff]/85 max-w-xl">
                Respondé como actuarías en cada situación. No hay respuestas
                correctas: cada elección suma puntos a distintos estilos de
                liderazgo. Al final vas a ver cuál es tu tendencia principal.
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-200/85">
              <p>
                Escena {paso + 1} de {ESCENAS.length}
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-black/50 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400"
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
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">
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
                className="w-full text-left rounded-2xl border border-cyan-400/40 bg-slate-900/80 hover:bg-cyan-500/10 hover:border-cyan-300 px-3.5 py-2.5 text-[13px] text-slate-100 transition"
              >
                {op.label}
              </button>
            ))}
          </div>
        </section>

        {/* Botón volver sin terminar */}
        <div className="flex justify-between text-[11px] text-slate-300/80">
          <button
            type="button"
            onClick={() => router.push("/juegos")}
            className="px-3 py-1.5 rounded-xl border border-white/25 bg-black/40 hover:bg-black/70 transition"
          >
            Volver al menú de juegos
          </button>
          <p>
            Cada elección suma puntos a estilos de liderazgo. El resultado final
            se guardará en tu perfil.
          </p>
        </div>
      </div>
    </div>
  );
}
