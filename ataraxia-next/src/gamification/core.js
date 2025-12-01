// src/gamification/core.js

// --- Parámetros base (podés tunearlos) ---
export const STAR_THRESHOLDS = [60, 80, 92]; // 1, 2, 3 estrellas
export const XP_PER_STAR = 120;
export const XP_BASE = 80;      // XP mínima por run
export const COIN_PER_STAR = 5; // monedas por estrella
export const DAILY_QUESTS_COUNT = 3;

export function computeStars(score) {
  if (score >= STAR_THRESHOLDS[2]) return 3;
  if (score >= STAR_THRESHOLDS[1]) return 2;
  if (score >= STAR_THRESHOLDS[0]) return 1;
  return 0;
}

export function xpForRun({ score, stars, streakBonus = 0 }) {
  const fromScore = Math.round(score);   // 0..100
  const fromStars = stars * XP_PER_STAR; // 0/120/240/360
  return XP_BASE + fromScore + fromStars + streakBonus;
}

// Curva de nivel: nivel N requiere 500 + (N-1)*250 para subir
export function levelFromXp(xp) {
  let lvl = 1, have = xp, need = 500;
  while (have >= need) { have -= need; lvl++; need = 500 + (lvl - 1) * 250; }
  return { level: lvl, progress: have, toNext: need };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// --- Quests diarias ---
const QUEST_POOL = [
  { id: "play2",      text: "Completá 2 juegos hoy",    type: "count_runs",  target: 2,          reward: { xp: 120, coins: 8 } },
  { id: "score80att", text: "Atención ≥ 80",            type: "score_game",  game: "atencion",   target: 80, reward: { xp: 140, coins: 10 } },
  { id: "any90",      text: "Cualquier juego ≥ 90",     type: "score_any",   target: 90,         reward: { xp: 200, coins: 15 } },
  { id: "time10",     text: "Jugar 10 min en total",    type: "time_played", targetMin: 10,      reward: { xp: 160, coins: 10 } },
];

export function rollDailyQuests(seed = Math.random()) {
  const pool = [...QUEST_POOL];
  const out = [];
  while (out.length < DAILY_QUESTS_COUNT && pool.length) {
    const i = Math.floor(seed * pool.length);
    out.push({ ...pool.splice(i,1)[0], progress: 0, done: false });
    seed = (seed * 9301 + 49297) % 233280 / 233280; // LCG sencillo
  }
  return out;
}

// --- Desbloqueos por nivel/estrellas (ejemplo) ---
export function shouldUnlock({ level, starsTotal }) {
  return {
    atencion: true,
    memoria: level >= 2,
    creatividad: starsTotal >= 8,
    resiliencia: starsTotal >= 14,
    flexibilidad: level >= 3,
    velocidad: level >= 4,
  };
}

// --- Quests: progreso en base a una partida (run) ---
function updateQuestsProgress(quests, { gameKey, score, playMinutes }) {
  const out = { ...quests, daily: quests.daily.map(q => ({ ...q })) };
  out.daily.forEach(q => {
    if (q.done) return;
    if (q.type === "count_runs") {
      q.progress += 1;
      if (q.progress >= q.target) q.done = true;
    }
    if (q.type === "score_game" && q.game === gameKey && score >= q.target) {
      q.progress = 1; q.done = true;
    }
    if (q.type === "score_any" && score >= q.target) {
      q.progress = 1; q.done = true;
    }
    if (q.type === "time_played") {
      q.progress += playMinutes;
      if (q.progress >= q.targetMin) q.done = true;
    }
  });
  return out;
}

// --- Aplica recompensas de una partida y devuelve el nuevo estado ---
export function applyRunRewards(prev, { gameKey, score, playMinutes = 3 }) {
  const stars = computeStars(score);
  const today = todayKey();

  // streak
  const last = prev?.gamificacion?.streak?.last;
  let streakCount = prev?.gamificacion?.streak?.count || 0;
  if (last !== today) {
    const y = new Date(); y.setDate(y.getDate()-1);
    const yKey = y.toISOString().slice(0,10);
    streakCount = (last === yKey) ? streakCount + 1 : 1;
  }
  const streakBonus = Math.min(100, streakCount * 10);

  // XP/coins
  const gainedXp = xpForRun({ score, stars, streakBonus });
  const gainedCoins = stars * COIN_PER_STAR;

  const oldXp = prev?.gamificacion?.xp || 0;
  const newXp = oldXp + gainedXp;
  const { level, progress, toNext } = levelFromXp(newXp);

  // quests del día
  let quests = prev?.gamificacion?.quests;
  if (!quests || quests.date !== today) quests = { date: today, daily: rollDailyQuests(Math.random()) };
  quests = updateQuestsProgress(quests, { gameKey, score, playMinutes });

  // estrellas acumuladas + unlocks
  const starsTotal = (prev?.gamificacion?.starsTotal || 0) + stars;
  const unlocks = shouldUnlock({ level, starsTotal });

  return {
    ...prev,
    gamificacion: {
      ...(prev?.gamificacion || {}),
      xp: newXp,
      level,
      coins: (prev?.gamificacion?.coins || 0) + gainedCoins,
      streak: { count: streakCount, last: today },
      quests,
      starsTotal,
      unlocks,
      __initialized: true,
    },
    // útil para mostrar modal de recompensa al terminar
    metaUltimaRecompensa: {
      gameKey, score, stars, gainedXp, gainedCoins,
      level, progress, toNext, streakCount
    }
  };
}
