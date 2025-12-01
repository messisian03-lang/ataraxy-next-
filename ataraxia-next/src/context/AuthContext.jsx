"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const USERS_KEY = "usuarios";
const CURRENT_KEY = "usuarioActual";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false); // <- evita redirecciones antes de hidratar

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    setUsers(storedUsers);
    const currentEmail = localStorage.getItem(CURRENT_KEY);
    if (currentEmail) {
      const found = storedUsers.find(u => u.email === currentEmail) || null;
      setUser(found);
    }
    setHydrated(true);
  }, []);

  const saveUsers = (arr) => {
    setUsers(arr);
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  };

  const register = (email, password, nombre = "") => {
    email = email.trim().toLowerCase();
    if (!email || !password) return { ok: false, msg: "Completá email y contraseña" };
    const exists = (JSON.parse(localStorage.getItem(USERS_KEY) || "[]")).some(u => u.email === email);
    if (exists) return { ok: false, msg: "Ya existe un usuario con ese email" };

    const nuevo = { email, password, nombre };
    const updated = [...(JSON.parse(localStorage.getItem(USERS_KEY) || "[]")), nuevo];
    saveUsers(updated);

    localStorage.setItem(CURRENT_KEY, email);
    setUser(nuevo);
    return { ok: true };
  };

  // ✅ lee SIEMPRE del localStorage más reciente (no del estado)
  const login = (email, password) => {
    email = email.trim().toLowerCase();
    const list = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = list.find(u => u.email === email && u.password === password);
    if (!found) return false;
    localStorage.setItem(CURRENT_KEY, found.email);
    setUsers(list);     // sincroniza estado por si cambió
    setUser(found);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({
    user, users, hydrated,
    register, login, logout
  }), [user, users, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
