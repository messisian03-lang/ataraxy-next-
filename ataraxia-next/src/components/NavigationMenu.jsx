"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaUser,
  FaGamepad,
  FaHeartbeat,
  FaComments,
  FaMapMarkedAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: FaHome },
  { href: "/perfil", label: "Perfil", icon: FaUser },
  { href: "/juegos", label: "Juegos", icon: FaGamepad },
  { href: "/diagnostico", label: "Diagnóstico", icon: FaHeartbeat },
  { href: "/coach", label: "Coach", icon: FaComments },
  { href: "/mapa-habilidades", label: "Mapa", icon: FaMapMarkedAlt },
];

export default function NavigationMenu() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-20 md:w-24 lg:w-28 flex flex-col items-center py-6 gap-6 bg-black/40 backdrop-blur-xl border-r border-white/10">
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-semibold">
          {user?.nombre?.[0]?.toUpperCase() || "A"}
        </div>
        <span className="text-[10px] md:text-xs text-[#FFEEEE] opacity-70 text-center">
          {user?.nombre || "Invitado"}
        </span>
      </div>

      <nav className="flex-1 flex flex-col items-center gap-4 mt-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-[11px] md:text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl py-2 px-1 ${
                active
                  ? "text-cyan-300"
                  : "text-[#FFEEEE] hover:text-white"
              }`}
              aria-label={label}
              title={label}
            >
              <Icon
                className={`text-xl mb-1 ${
                  active ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex flex-col items-center text-[#FFEEEE] text-[11px] md:text-xs hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-xl py-2"
        aria-label="Cerrar sesión"
      >
        <FaSignOutAlt className="text-xl mb-1" />
        <span>Salir</span>
      </button>
    </aside>
  );
}
