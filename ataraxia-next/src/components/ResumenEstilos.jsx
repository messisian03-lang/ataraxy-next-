// src/components/ResumenEstilos.jsx
import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ResumenEstilos = ({ estilos }) => {
  const data = {
    labels: ["Colaborativo", "Individualista", "Delegativo"],
    datasets: [
      {
        label: "Estilo de Liderazgo",
        data: [
          estilos.colaborativo || 0,
          estilos.individualista || 0,
          estilos.delegativo || 0,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)", // Indigo 500
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: "#4B5563", // gris oscuro
        },
        pointLabels: {
          color: "#1F2937", // gris más oscuro
          font: { size: 14 },
        },
        grid: { color: "#E5E7EB" },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="mt-6">
      <Radar data={data} options={options} />
      <div className="mt-4 text-sm text-gray-600 text-left space-y-1">
        <p><strong>Colaborativo:</strong> Promueve el trabajo en equipo y la inclusión.</p>
        <p><strong>Individualista:</strong> Toma decisiones en solitario, prioriza su enfoque.</p>
        <p><strong>Delegativo:</strong> Confía en otros para ejecutar, asumiendo un rol guía.</p>
      </div>
    </div>
  );
};

export default ResumenEstilos;
