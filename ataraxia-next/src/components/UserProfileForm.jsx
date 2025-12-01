import React, { useContext, useState } from "react";
import { ResultadosContext } from "../context/ResultadosContext";
import { FaUserCircle, FaPalette, FaBullseye, FaBrain, FaCheckCircle } from "react-icons/fa";

const UserProfileForm = () => {
  const { resultados, setResultados } = useContext(ResultadosContext);

  const [nombre, setNombre] = useState(resultados.perfilUsuario?.nombre || "");
  const [pais, setPais] = useState(resultados.perfilUsuario?.pais || "");
  const [idioma, setIdioma] = useState(resultados.perfilUsuario?.idioma || "");
  const [tema, setTema] = useState(resultados.perfilUsuario?.tema || "");
  const [sonido, setSonido] = useState(resultados.perfilUsuario?.sonido ?? true);
  const [avatar, setAvatar] = useState(resultados.perfilUsuario?.avatar || "avatar1");
  const [metas, setMetas] = useState(resultados.perfilUsuario?.metas || []);
  const [preferencias, setPreferencias] = useState(resultados.perfilUsuario?.preferencias || []);

  const avatars = ["avatar1", "avatar2", "avatar3", "avatar4"];
  const metasDisponibles = ["Mejorar memoria", "Reducir ansiedad", "Mejorar concentración", "Desarrollar creatividad"];
  const preferenciasDisponibles = ["Visual", "Auditivo", "Kinestésico", "Lector-Escritor"];

  const handleSubmit = (e) => {
    e.preventDefault();
    setResultados(prev => ({
      ...prev,
      perfil: {
        nombre, pais, idioma, tema, sonido, avatar, metas, preferencias
      }
    }));
    alert("¡Perfil guardado correctamente!");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 max-w-5xl mx-auto mt-8 p-6">

      {/* INFO BÁSICA */}
      <div className={`bg-white rounded-xl p-6 shadow-lg ${nombre && pais && idioma ? 'border-4 border-green-500' : 'border text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FaUserCircle className="text-blue-500" /> Información Básica</h2>
          {nombre && pais && idioma && <span className="flex items-center gap-2 text-green-600 font-semibold"><FaCheckCircle /> Completado</span>}
        </div>

        <div className="flex items-center gap-4 flex-wrap mb-4">
          {avatars.map((av) => (
            <img
              key={av}
              src={`/avatars/${av}.png`}
              onClick={() => setAvatar(av)}
              className={`w-20 h-20 rounded-full cursor-pointer border-4 ${
                avatar === av ? "border-blue-500" : "border-gray-300"
              }`}
              alt={av}
            />
          ))}
        </div>

        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="w-full p-3 border rounded mb-4" required />
        <select value={pais} onChange={(e) => setPais(e.target.value)} className="w-full p-3 border rounded mb-4">
          <option value="">Selecciona tu país</option>
          <option value="Argentina">Argentina</option>
          <option value="México">México</option>
          <option value="España">España</option>
        </select>
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)} className="w-full p-3 border rounded">
          <option value="">Selecciona tu idioma</option>
          <option value="Español">Español</option>
          <option value="Inglés">Inglés</option>
        </select>
      </div>

      {/* PERSONALIZACIÓN */}
      <div className={`bg-white rounded-xl p-6 shadow-lg text-black ${tema ? 'border-4 border-green-500' : 'border'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FaPalette className="text-purple-500" /> Personalización</h2>
          {tema && <span className="flex items-center gap-2 text-green-600 font-semibold"><FaCheckCircle /> Completado</span>}
        </div>
        <select value={tema} onChange={(e) => setTema(e.target.value)} className="w-full p-3 border rounded mb-4">
          <option value="">Tema de color</option>
          <option value="Claro">Claro</option>
          <option value="Oscuro">Oscuro</option>
          <option value="Neón">Neón</option>
        </select>
        <div className="flex justify-between items-center">
          <span className="font-medium">Sonido y Música</span>
          <input type="checkbox" checked={sonido} onChange={(e) => setSonido(e.target.checked)} className="w-6 h-6" />
        </div>
      </div>

      {/* METAS PERSONALES */}
      <div className={`bg-white rounded-xl p-6 shadow-lg text-black ${metas.length ? 'border-4 border-green-500' : 'border'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FaBullseye className="text-red-500" /> Metas Personales</h2>
          {metas.length > 0 && <span className="flex items-center gap-2 text-green-600 font-semibold"><FaCheckCircle /> Completado</span>}
        </div>
        <div className="space-y-3">
          {metasDisponibles.map(meta => (
            <label key={meta} className="flex items-center space-x-3">
              <input type="checkbox" checked={metas.includes(meta)} onChange={() => {
                setMetas(prev => prev.includes(meta) ? prev.filter(m => m !== meta) : [...prev, meta]);
              }} className="w-5 h-5" />
              <span>{meta}</span>
            </label>
          ))}
        </div>
      </div>

      {/* PREFERENCIAS */}
      <div className={`bg-white rounded-xl p-6 shadow-lg text-black ${preferencias.length ? 'border-4 border-green-500' : 'border'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><FaBrain className="text-green-500" /> Preferencias Cognitivas</h2>
          {preferencias.length > 0 && <span className="flex items-center gap-2 text-green-600 font-semibold"><FaCheckCircle /> Completado</span>}
        </div>
        <div className="space-y-3">
          {preferenciasDisponibles.map(pref => (
            <label key={pref} className="flex items-center space-x-3">
              <input type="checkbox" checked={preferencias.includes(pref)} onChange={() => {
                setPreferencias(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);
              }} className="w-5 h-5" />
              <span>{pref}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BOTÓN */}
      <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl text-lg hover:bg-blue-700">Guardar Perfil</button>

    </form>
  );
};

export default UserProfileForm;
