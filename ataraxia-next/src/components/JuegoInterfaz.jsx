import React from "react";

export default function JuegoInterfaz({ etapa, onResponder }) {
  return (
    <div className="p-8 text-white bg-[#1a1a2e] rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Etapa {etapa.etapa}: {etapa.titulo}</h2>
      <p className="mb-6">{etapa.descripcion}</p>
      {etapa.opciones.map((op, i) => (
        <button
          key={i}
          className="block w-full bg-[#4ecca3] text-black font-semibold py-2 px-4 mb-3 rounded hover:bg-[#3bbfa4]"
          onClick={() => onResponder(op.habilidad, op.valor)}
        >
          {op.texto}
        </button>
      ))}
    </div>
  );
}