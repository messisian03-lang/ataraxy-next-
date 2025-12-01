"use client";

import { ReactNode } from "react";

import { AuthProvider } from "../context/AuthContext";
import { ResultadosProvider } from "../context/ResultadosContext";
import { SoundProvider } from "../context/SoundContext";
import { ToastProvider } from "../context/ToastContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ResultadosProvider>
        <SoundProvider>
          <ToastProvider>{children}</ToastProvider>
        </SoundProvider>
      </ResultadosProvider>
    </AuthProvider>
  );
}
