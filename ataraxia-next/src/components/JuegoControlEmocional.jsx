import React, { useState } from "react";
import preguntasData from "./preguntasEmocional.json";

const JuegoControlEmocional = () => {
  const [etapaIndex, setEtapaIndex] = useState(0);
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  const etapaActual = preguntasData.etapas[etapaIndex];
  const preguntaActual = etapaActual.preguntas[preguntaIndex];

  const handleRespuesta = (opcion) => {
    const key = `Etapa ${etapaIndex + 1} - Pregunta ${preguntaIndex + 1}`;
    setRespuestas({ ...respuestas, [key]: opcion });

    const siguientePregunta = preguntaIndex + 1;
    const hayMasPreguntas = siguientePregunta < etapaActual.preguntas.length;

    if (hayMasPreguntas) {
      setPreguntaIndex(siguientePregunta);
    } else {
      const siguienteEtapa = etapaIndex + 1;
      const hayMasEtapas = siguienteEtapa < preguntasData.etapas.length;

      if (hayMasEtapas) {
        setEtapaIndex(siguienteEtapa);
        setPreguntaIndex(0);
      } else {
        alert("¡Juego completo!");
        console.log(respuestas);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2 text-indigo-700">{etapaActual.titulo}</h2>
      <p className="text-md font-medium mb-4">{preguntaActual.pregunta}</p>
      <div className="space-y-2">
        {preguntaActual.opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleRespuesta(opcion)}
            className="w-full py-2 px-4 bg-indigo-100 hover:bg-indigo-200 rounded text-indigo-800 font-semibold transition"
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JuegoControlEmocional;