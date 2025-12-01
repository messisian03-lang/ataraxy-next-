import React, { useContext, useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import { ResultadosContext } from "../context/ResultadosContext";
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

const RadarChartHabilidades = () => {
  const { resultados, setResultados } = useContext(ResultadosContext);
  const [ready, setReady] = useState(false); // Para re-renderizar tras setResultados

  // TEMPORAL: simular resultados cargados (sólo para test)
  useEffect(() => {
    setResultados({
      misionEquipo: {
        colaboracion: 4,
        resiliencia: 3,
        comunicacion: 5,
        liderazgo: 2,
        empatia: 4,
      },
      rutaConocimiento: {
        conteoEstilos: {
          visual: 5,
          auditivo: 3,
          kinestesico: 2,
        },
        estiloPredominante: "visual",
      },
    });

    // Dar tiempo a React para propagar cambios antes de renderizar
    setTimeout(() => {
      setReady(true);
    }, 100);
  }, [setResultados]);

  if (!ready || !resultados?.misionEquipo || !resultados?.rutaConocimiento) {
    return <p className="text-center mt-10 text-gray-500">Cargando resultados...</p>;
  }

  const liderazgo = resultados.misionEquipo;
  const aprendizaje = resultados.rutaConocimiento.conteoEstilos;

  const combinado = { ...liderazgo, ...aprendizaje };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: { stepSize: 1 },
        pointLabels: {
          font: { size: 14 },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  const estiloLiderazgo = Object.entries(liderazgo).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  const estiloAprendizaje = Object.entries(aprendizaje).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto mt-10 space-y-12">
      {/* 🧭 Gráfico de Liderazgo */}
      <div>
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          🧭 Estilos de Liderazgo
        </h2>
        <Radar
          data={{
            labels: Object.keys(liderazgo),
            datasets: [
              {
                label: "Liderazgo",
                data: Object.values(liderazgo),
                backgroundColor: "rgba(99, 102, 241, 0.2)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={chartOptions}
        />
        <p className="text-center text-sm text-indigo-800 mt-2 bg-indigo-50 p-2 rounded">
          Tu estilo de liderazgo predominante es{" "}
          <strong className="capitalize">{estiloLiderazgo}</strong>.
        </p>
      </div>

      {/* 🧠 Gráfico de Estilos de Aprendizaje */}
      <div>
        <h2 className="text-xl font-bold text-green-700 mb-4">
          🧠 Estilos de Aprendizaje
        </h2>
        <Radar
          data={{
            labels: Object.keys(aprendizaje),
            datasets: [
              {
                label: "Aprendizaje",
                data: Object.values(aprendizaje),
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderColor: "rgba(34, 197, 94, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={chartOptions}
        />
        <p className="text-center text-sm text-green-800 mt-2 bg-green-50 p-2 rounded">
          Tu estilo de aprendizaje predominante es{" "}
          <strong className="capitalize">{estiloAprendizaje}</strong>.
        </p>
      </div>

      {/* 📊 Gráfico Combinado Global */}
      <div>
        <h2 className="text-xl font-bold text-purple-700 mb-4">
          📊 Perfil Global Combinado
        </h2>
        <Radar
          data={{
            labels: Object.keys(combinado),
            datasets: [
              {
                label: "Perfil Global",
                data: Object.values(combinado),
                backgroundColor: "rgba(139, 92, 246, 0.2)",
                borderColor: "rgba(139, 92, 246, 1)",
                borderWidth: 2,
              },
            ],
          }}
          options={chartOptions}
        />
        <p className="text-center text-sm text-purple-800 mt-2 bg-purple-50 p-2 rounded">
          Este gráfico combina tus habilidades blandas con tus estilos de
          aprendizaje, generando una visión integral de tu perfil.
        </p>
      </div>
    </div>
  );
};

export default RadarChartHabilidades;
