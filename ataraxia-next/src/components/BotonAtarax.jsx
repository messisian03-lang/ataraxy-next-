import React from "react";

export default function BotonAtarax({
  children,
  onClick,
  variant = "primary",
  className = "",
}) {
  const base =
    "rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "px-6 py-3 text-[#0b1724] bg-gradient-to-r from-fuchsia-400 via-pink-500 to-fuchsia-600 hover:brightness-110 shadow-[0_0_12px_rgba(232,121,249,0.6)]",
    secondary:
      "px-6 py-3 text-white border border-fuchsia-400/70 hover:bg-fuchsia-500/10 shadow-[0_0_10px_rgba(232,121,249,0.5)]",
    ghost:
      "px-3 py-2 text-sm font-bold border border-fuchsia-300/50 hover:bg-fuchsia-400/10 shadow-[0_0_6px_rgba(232,121,249,0.3)]",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
