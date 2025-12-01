import React from 'react';

const CoachVirtualPanel = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Coach Virtual ACTIVO</h2>
      <div>
        <p>🗂️ <strong>Últimas sesiones</strong></p>
        <ul className="ml-6 list-disc">
          <li>20/06: "Exploración de propósito personal"</li>
          <li>21/06: "Cómo enfrento el estrés en el trabajo"</li>
        </ul>
        <p className="mt-4">📊 <strong>Progreso y Propósito</strong></p>
        <ul className="ml-6 list-disc">
          <li>✅ Habilidades: Comunicación, Empatía, Resolución de problemas</li>
          <li>🔑 Valores: Autenticidad, Colaboración</li>
          <li>📌 Último hito: Liderazgo bajo presión</li>
        </ul>
      </div>
    </div>
  );
};

export default CoachVirtualPanel;
