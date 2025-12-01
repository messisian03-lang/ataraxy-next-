// src/modules/coach/coachProfileHelpers.js

// Recibe todo el objeto `resultados` del ResultadosContext
export function construirPerfilCoach(resultados) {
  if (!resultados) {
    return {
      nombreVisible: "Explorador/a",
      resumenCorto:
        "Todavía no tengo datos tuyos, así que voy a empezar con preguntas abiertas para conocerte mejor.",
      mensajeInicial:
        "Hola, soy tu Coach Virtual Ataraxia. Todavía no tengo datos de tus juegos ni del diagnóstico, así que en esta primera sesión voy a hacerte algunas preguntas abiertas para conocerte mejor.",
    };
  }

  const nombre =
    resultados.perfil?.nombre?.trim() ||
    resultados.perfil?.nombreVisible ||
    "Explorador/a";

  const lider = resultados.juegos?.liderazgo;
  const aprend = resultados.juegos?.aprendizaje;
  const emo = resultados.juegos?.controlEmocional;
  const diag = resultados.diagnostico;

  const partes = [];

  if (lider?.etiquetaEstilo) {
    partes.push(
      `tu liderazgo tiende a ser **${normalizar(lider.etiquetaEstilo)}**`
    );
  }

  if (aprend?.etiquetaEstilo) {
    partes.push(
      `aprendés mejor de forma **${normalizar(aprend.etiquetaEstilo)}**`
    );
  }

  if (emo?.etiquetaEstilo) {
    partes.push(
      `tu punto fuerte emocional está en **${normalizar(
        emo.etiquetaEstilo
      )}**`
    );
  }

  let introJuegos = "";
  if (partes.length === 1) {
    introJuegos = `Por lo que veo en tus juegos, ${partes[0]}.`;
  } else if (partes.length === 2) {
    introJuegos = `Por lo que veo en tus juegos, ${partes[0]} y ${partes[1]}.`;
  } else if (partes.length >= 3) {
    introJuegos = `Por lo que veo en tus juegos, ${partes[0]}, ${partes[1]} y ${partes[2]}.`;
  } else {
    introJuegos =
      "Todavía tengo pocos datos de tus juegos, así que vamos a usar esta sesión para explorarlos juntos.";
  }

  let parteDiag = "";
  if (diag?.perfilTextoLargo) {
    parteDiag = `\n\nDel diagnóstico inicial resumo algo importante: ${diag.perfilTextoLargo}`;
  } else if (diag?.perfilResumen) {
    parteDiag = `\n\nSegún el diagnóstico inicial, tu perfil combina: ${diag.perfilResumen}.`;
  }

  const resumenCorto = `${introJuegos}${parteDiag}`;

  const mensajeInicial =
    `Hola ${nombre}, soy tu Coach Virtual Ataraxia. ` +
    `Voy a usar lo que ya hiciste en el diagnóstico y en los juegos para acompañarte de forma personalizada.\n\n` +
    `${introJuegos}${parteDiag}\n\n` +
    `Podemos empezar por aclarar un objetivo, revisar una situación concreta o explorar cómo aprovechar mejor estas fortalezas. ` +
    `¿En qué te gustaría enfocarte hoy?`;

  return {
    nombreVisible: nombre,
    resumenCorto,
    mensajeInicial,
  };
}

function normalizar(texto) {
  if (!texto) return "";
  const t = String(texto).trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}
