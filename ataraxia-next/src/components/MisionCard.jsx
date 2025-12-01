import React from "react";

const MisionCard = ({ escena, onSelect }) => (
  <div className="bg-white p-6 rounded shadow-md">
    <h2 className="text-xl font-bold mb-4">{escena.titulo}</h2>
    <p className="mb-4">{escena.descripcion}</p>
    <div className="space-y-2">
      {escena.opciones.map((opcion, idx) => (
        <button
          key={idx}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={() => onSelect(opcion)}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  </div>
);

export default MisionCard;
