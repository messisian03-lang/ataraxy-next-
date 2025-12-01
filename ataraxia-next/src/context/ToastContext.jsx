"use client";
import React, { createContext, useContext, useMemo } from "react";
import { Toaster, toast } from "sonner";

const ToastCtx = createContext(null);

function callToast({ tone, title, description }) {
  const fn =
    tone === "success" ? toast.success :
    tone === "error"   ? toast.error   :
    tone === "warning" ? toast.warning : toast;
  return fn(title || description || "OK", title && description ? { description } : undefined);
}

export function ToastProvider({ children }) {
  const api = useMemo(() => ({
    show: (arg) => {
      if (typeof arg === "string") return toast(arg);
      if (arg && typeof arg === "object") return callToast(arg);
      return toast("OK");
    },
    success: (m, o) => toast.success(m, o),
    error:   (m, o) => toast.error(m, o),
    info:    (m, o) => toast(m, o),
  }), []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (ctx) return ctx;
  // fallback para que nunca crashee si faltara el provider
  return {
    show: (arg) => (typeof arg === "string" ? toast(arg) : callToast(arg || {})),
    success: (m, o) => toast.success(m, o),
    error:   (m, o) => toast.error(m, o),
    info:    (m, o) => toast(m, o),
  };
}
