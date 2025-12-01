import "./globals.css";
import { ReactNode } from "react";
import Providers from "./providers";

export const metadata = {
  title: "Ataraxia",
  description: "Plataforma de habilidades, juegos y Coach Virtual",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
