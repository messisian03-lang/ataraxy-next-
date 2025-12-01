import React, { useContext } from "react";
import { ResultadosContext } from "../context/ResultadosContext";

const AvatarCircularAnimado = () => {
  const { resultados } = useContext(ResultadosContext);
  const perfil = resultados?.perfil;

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center">
        <img
          src={perfil?.imagen || "/default-avatar.png"} // Asegurá que exista un avatar por defecto
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
      <span className="mt-1 text-sm text-gray-700 font-semibold">
        {perfil?.nombre || "Usuario"}
      </span>
    </div>
  );
};

export default AvatarCircularAnimado;
