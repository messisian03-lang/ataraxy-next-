import React from "react";
import { FaHome, FaUser, FaHeartbeat, FaGamepad, FaComments, FaMapMarkedAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const items = [
  { icon: <FaHome />, to: "/dashboard" },
  { icon: <FaUser />, to: "/perfil" },
  { icon: <FaHeartbeat />, to: "/diagnostico" },
  { icon: <FaGamepad />, to: "/juegos" },
  { icon: <FaComments />, to: "/coach" },
  { icon: <FaMapMarkedAlt />, to: "/mapa-habilidades" },
];

const PanelLateralMinimal = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-16 md:w-20 bg-white shadow-lg p-4 flex flex-col gap-4 items-center">
      {items.map((item, index) => (
        <Link key={index} to={item.to} className={`text-2xl ${pathname === item.to ? 'text-blue-600' : 'text-gray-400'}`}>
          {item.icon}
        </Link>
      ))}
    </aside>
  );
};

export default PanelLateralMinimal;