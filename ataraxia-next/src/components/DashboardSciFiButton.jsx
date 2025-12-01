import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardSciFiButton = ({ icon: Icon, label, link }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(link)}
      className="flex flex-col items-center justify-center w-24 h-24 rounded-full 
                 bg-gradient-to-br from-cyan-400/80 to-sky-700/80 
                 border border-cyan-200/70 backdrop-blur 
                 shadow-[0_0_18px_rgba(0,200,255,0.45)] 
                 hover:scale-105 transition"
      title={label}
      type="button"
    >
      <Icon className="w-8 h-8 text-white mb-1" />
      <span className="text-[11px] font-semibold text-white leading-tight text-center">
        {label}
      </span>
    </button>
  );
};

export default DashboardSciFiButton;
