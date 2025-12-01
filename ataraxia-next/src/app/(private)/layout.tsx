"use client";

import { ReactNode } from "react";
import NavigationMenu from "../../components/NavigationMenu";

const backgroundUrl = "/assets/frame5_background.png";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <NavigationMenu />

      <main className="flex-1 relative overflow-auto">
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
