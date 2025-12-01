import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardSciFiCard = ({
  icon: Icon,
  title,
  buttonText,
  description,
  link,
  imageSrc,      // <-- NUEVO: imagen opcional
  tall = true,   // <-- NUEVO: alto/angosto estilo mock
}) => {
  const navigate = useNavigate();

  // tamaños según 'tall'
  const sizeClasses = tall
    ? "w-60 h-80"  // 240 x 320
    : "w-72";      // 288, alto auto

  return (
    <div
      className={`${sizeClasses} rounded-3xl 
                  bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-700
                  border border-cyan-200/80 
                  shadow-[0_12px_50px_rgba(0,200,255,0.45)]
                  p-6 flex flex-col items-center text-center 
                  hover:scale-[1.04] transition-transform`}
    >
      {/* Si hay imagen la mostramos arriba; si no, el ícono circular */}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title}
          className="w-20 h-20 object-contain mb-3"
        />
      ) : (
        <div
          className="rounded-full bg-white/15 border border-white/60
                     shadow-[inset_0_3px_12px_rgba(255,255,255,0.3)]
                     flex items-center justify-center mb-4"
          style={{ width: 72, height: 72 }}
        >
          {Icon && <Icon className="w-8 h-8 text-white drop-shadow" />}
        </div>
      )}

      <h3 className="text-white uppercase tracking-wide text-sm font-extrabold drop-shadow-sm">
        {title}
      </h3>

      <button
        onClick={() => navigate(link)}
        className="mt-3 bg-white text-blue-700 text-xs font-bold px-5 py-1.5 
                   rounded-full shadow hover:bg-cyan-100 transition-colors"
      >
        {buttonText}
      </button>

      {description && (
        <p className="text-white/95 text-[12px] leading-snug mt-3">
          {description}
        </p>
      )}
    </div>
  );
};

export default DashboardSciFiCard;
