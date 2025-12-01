import { NextResponse } from "next/server";

// Detectar proveedor (ollama, openai o dummy automático)
const PROVIDER = process.env.COACH_PROVIDER || "auto";

// Configuración Ollama
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

// Prompt maestro
function buildSystemPrompt(contexto: any) {
  const nombre = contexto?.perfil?.nombre || "la persona";
  return `
Sos MAIA, coach ontológico del sistema Ataraxia.
Conversá como en una sesión real, con empatía, claridad y preguntas profundas.
Tu usuario es ${nombre}.
No uses lenguaje técnico, ni médico. No des diagnósticos clínicos.
Terminá siempre con 1 o 2 preguntas abiertas para continuar la sesión.
`;
}

// -------- MOTOR DUMMY --------
function dummyReply(mensajeUsuario: string) {
  return `
Gracias por compartirme eso.  
Lo que me decís tiene sentido, y me gustaría entenderte un poco más.

• ¿Qué creés que está en la raíz de lo que mencionaste?  
• ¿Qué parte de esto sentís que te gustaría transformar primero?

(Tipo de respuesta generada en modo "dummy", sin IA real aún)
`;
}

// -------- OLLAMA REAL ----------
async function tryOllamaChat({
  mensajeUsuario,
  historial,
  contexto,
}: any) {
  try {
    const system = buildSystemPrompt(contexto);

    const messages = [
      { role: "system", content: system },
      ...historial.map((m: any) => ({
        role: m.de === "usuario" ? "user" : "assistant",
        content: m.texto,
      })),
      { role: "user", content: mensajeUsuario },
    ];

    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error("Ollama no disponible");
    }

    const json = await res.json();
    const content =
      json?.message?.content ||
      "No pude generar una respuesta útil esta vez.";

    return {
      ok: true,
      reply: content,
    };
  } catch (err) {
    return { ok: false, reply: dummyReply(mensajeUsuario) };
  }
}

// -------- HANDLER PRINCIPAL --------
export async function POST(req: Request) {
  const body = await req.json();
  const { mensajeUsuario, contexto, historial = [] } = body || {};

  if (!mensajeUsuario) {
    return NextResponse.json(
      { error: "mensajeUsuario requerido" },
      { status: 400 }
    );
  }

  let result;

  if (PROVIDER === "ollama" || PROVIDER === "auto") {
    result = await tryOllamaChat({ mensajeUsuario, historial, contexto });
  } else {
    // si COACH_PROVIDER = dummy
    result = { ok: false, reply: dummyReply(mensajeUsuario) };
  }

  return NextResponse.json({
    reply: result.reply,
    sugerencias: [
      "Profundicemos un poco más",
      "Probemos conectar esto con tus objetivos",
      "¿Qué emoción aparece detrás de esto?",
    ],
  });
}
