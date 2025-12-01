import React, { useState } from "react";

export default function OIPEWizard({ open, onClose, onSave }) {
  const [step, setStep] = useState(0); // 0..3
  const [objetivo, setObjetivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [impacto, setImpacto] = useState("");
  const [pedido, setPedido] = useState("");

  if (!open) return null;

  const canNext = () => {
    if (step === 0) return objetivo.trim().length > 5;
    if (step === 1) return observaciones.trim().length > 5;
    if (step === 2) return impacto.trim().length > 5;
    if (step === 3) return pedido.trim().length > 5;
    return false;
  };

  const bullets = (txt) =>
    txt
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => (l.startsWith("•") ? l : `• ${l}`))
      .join("\n");

  const handleFinish = () => {
    const resumen =
`OIPE — Borrador de conversación
Objetivo:
${objetivo}

Observaciones:
${bullets(observaciones)}

Impacto:
${impacto}

Pedido:
${pedido}
`;
    onSave?.({
      objetivo,
      observaciones,
      impacto,
      pedido,
      resumen,
    });
  };

  const StepView = () => {
    if (step === 0)
      return (
        <>
          <h3 className="text-lg font-semibold text-[#FFEEEE]">1) Objetivo</h3>
          <p className="text-sm text-slate-200 mt-1">
            ¿Qué resultado concreto querés lograr con esta conversación?
          </p>
          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Ej: Acordar que las actualizaciones del sprint se envíen los martes antes de las 12h."
            className="mt-3 w-full h-36 rounded-md px-3 py-2 text-black"
          />
        </>
      );
    if (step === 1)
      return (
        <>
          <h3 className="text-lg font-semibold text-[#FFEEEE]">2) Observaciones</h3>
          <p className="text-sm text-slate-200 mt-1">
            Hechos observables, sin juicios (podés usar varias líneas).
          </p>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder={"Ej:\n- En las últimas 3 semanas el informe llegó después del miércoles.\n- El último tenía 2 métricas sin actualizar."}
            className="mt-3 w-full h-36 rounded-md px-3 py-2 text-black"
          />
        </>
      );
    if (step === 2)
      return (
        <>
          <h3 className="text-lg font-semibold text-[#FFEEEE]">3) Impacto</h3>
          <p className="text-sm text-slate-200 mt-1">
            ¿Cómo te afecta a vos/equipo/cliente?
          </p>
          <textarea
            value={impacto}
            onChange={(e) => setImpacto(e.target.value)}
            placeholder="Ej: Me cuesta priorizar desarrollo sin esos datos y el cliente decide con info atrasada."
            className="mt-3 w-full h-36 rounded-md px-3 py-2 text-black"
          />
        </>
      );
    return (
      <>
        <h3 className="text-lg font-semibold text-[#FFEEEE]">4) Pedido</h3>
        <p className="text-sm text-slate-200 mt-1">
          Pedido específico, medible y con plazo.
        </p>
        <textarea
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
          placeholder="Ej: ¿Podemos fijar los martes 11:30 como límite para enviar el informe actualizado?"
          className="mt-3 w-full h-36 rounded-md px-3 py-2 text-black"
        />
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1f2937] border border-white/10 p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-emerald-200 font-bold">Conversación difícil — OIPE</h4>
          <span className="text-slate-300 text-sm">Paso {step + 1} de 4</span>
        </div>

        <div className="mt-3">{StepView()}</div>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-400 text-slate-200"
          >
            Cancelar
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-3 py-1.5 rounded-md bg-slate-300 text-black hover:bg-slate-200"
              >
                Atrás
              </button>
            )}
            {step < 3 ? (
              <button
                disabled={!canNext()}
                onClick={() => canNext() && setStep(step + 1)}
                className={`px-3 py-1.5 rounded-md ${
                  canNext()
                    ? "bg-emerald-300 hover:bg-emerald-200 text-black"
                    : "bg-emerald-300/40 text-black/60 cursor-not-allowed"
                }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                disabled={!canNext()}
                onClick={handleFinish}
                className={`px-3 py-1.5 rounded-md ${
                  canNext()
                    ? "bg-emerald-400 hover:bg-emerald-300 text-black"
                    : "bg-emerald-400/40 text-black/60 cursor-not-allowed"
                }`}
              >
                Guardar borrador
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
