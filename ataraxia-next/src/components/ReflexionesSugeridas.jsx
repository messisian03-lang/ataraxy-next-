import React from 'react';

const reflexiones = [
  "¿Qué aprendiste hoy sobre vos?",
  "¿Qué situación te desafió esta semana?",
  "¿Qué valor te gustaría fortalecer?"
];

const ReflexionesSugeridas = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow w-full max-w-md mt-4">
      <h3 className="font-bold text-lg mb-2">💡 Sugerencias Reflexivas</h3>
      <div className="space-y-2">
        {reflexiones.map((texto, i) => (
          <button key={i} className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 py-2 px-4 rounded-lg text-left">
            {texto}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReflexionesSugeridas;
