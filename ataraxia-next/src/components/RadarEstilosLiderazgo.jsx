import React, { useContext } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { ResultadosContext } from "../context/ResultadosContext";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarEstilosLiderazgo = () => {
  const { resultados } = useContext(ResultadosContext);
  const datos = resultados?.misionEquipo;

  if (!datos) {
    return <p className="text-center text-gray-600">Aún no completaste el juego Misión en Equipo.</p>;
  }

  const data = {
    labels: ["Colaborativo", "Individualista", "Delegativo"],
    datasets: [
      {
        label: "Estilo de Liderazgo",
        data: [datos.colaborativo, datos.individualista, datos.delegativo],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)"
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        },
        pointLabels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">Radar de Estilo de Liderazgo</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarEstilosLiderazgo;
