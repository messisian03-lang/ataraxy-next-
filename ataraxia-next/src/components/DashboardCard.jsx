// src/components/DashboardCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, link, icon: Icon, subtitle, cta = "Ir" }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="rounded-2xl p-5 w-56 h-72
                 flex flex-col items-center text-center
                 justify-between hover:scale-[1.02] transition
                 bg-gradient-to-br from-cyan-600/70 to-blue-800/80
                 border border-cyan-300/50 backdrop-blur-lg
                 shadow-[0_0_15px_rgba(0,255,255,0.35)] cursor-pointer"
    >
      {/* Ícono decorativo arriba (si ya tenías uno, dejalo) */}
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-white/15 border border-white/40 shadow flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}

      <div className="px-1">
        <h3 className="text-white font-bold text-sm leading-snug">{title}</h3>
        {subtitle && <p className="text-white/80 text-xs mt-2">{subtitle}</p>}
      </div>

      <button
        className="bg-white text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full shadow hover:bg-cyan-100"
        onClick={(e) => { e.stopPropagation(); navigate(link); }}
      >
        {cta}
      </button>
    </div>
  );
};

export default DashboardCard;
