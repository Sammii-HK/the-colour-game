import colours from '../data/css-colours.json';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'normal' | 'gauntlet';
export const COLOR_GROUPS = {
  red: ["indianred", "lightcoral", "salmon", "darkred", "red", "firebrick", "crimson"],
  orange: ["lightsalmon", "coral", "tomato", "orangered", "darkorange", "orange"],
  yellow: ["gold", "yellow", "lightyellow", "lemonchiffon", "papayawhip", "moccasin", "peachpuff"],
  green: ["darkgreen", "green", "forestgreen", "limegreen", "lime", "lawngreen", "chartreuse", "lightgreen", "palegreen", "springgreen"],
  cyan: ["teal", "darkcyan", "cadetblue", "darkturquoise", "mediumturquoise", "turquoise", "lightseagreen", "aquamarine", "aqua", "cyan", "paleturquoise", "lightcyan"],
  blue: ["midnightblue", "navy", "darkblue", "mediumblue", "blue", "royalblue", "dodgerblue", "deepskyblue", "lightskyblue", "skyblue", "lightblue", "powderblue"],
  purple: ["indigo", "purple", "darkmagenta", "darkviolet", "blueviolet", "mediumpurple", "orchid", "violet", "plum", "thistle", "lavender"],
  pink: ["deeppink", "hotpink", "palevioletred", "lightpink", "pink"],
  brown: ["saddlebrown", "sienna", "chocolate", "peru", "darkgoldenrod", "goldenrod", "sandybrown", "rosybrown", "burlywood", "tan", "wheat"],
  gray: ["black", "dimgray", "gray", "darkgray", "silver", "lightgray", "gainsboro", "whitesmoke", "white"],
};


const names = Object.values(COLOR_GROUPS).flat();
const hexes = new Map(colours.map(c => [c.name.toLowerCase(), c.hex.toLowerCase()]));
export const normalise = (name: string) => name.trim().toLowerCase().replace(/grey/g, 'gray');
export const colourHex = (name: string) => hexes.get(normalise(name));
export const matches = (a: string, b: string) => Boolean(colourHex(a)) && colourHex(a) === colourHex(b);
const shuffle = <T,>(items: T[], random: () => number) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
export function question(difficulty: Difficulty, previous = '', random = Math.random) {
  const pool = names.filter(n => !matches(n, previous));
  const target = pool[Math.floor(random() * pool.length)];
  const group = Object.values(COLOR_GROUPS).find(g => g.includes(target))!;
  const candidates = shuffle(difficulty === 'medium' ? group : names, random);
  const options = [target];
  for (const name of candidates) {
    if (!options.some(option => matches(option, name))) options.push(name);
    if (options.length === 4) break;
  }
  return { target, options: difficulty === 'hard' ? [] : shuffle(options, random) };
}
export interface Game {
  mode: Mode; difficulty: Difficulty; target: string; options: string[];
  phase: 'question' | 'feedback' | 'over'; guessed: string; correct: boolean;
  score: number; streak: number; stageCorrect: number;
  stats: Record<Difficulty, number>;
}
export function start(mode: Mode = 'normal', difficulty: Difficulty = 'easy', previous = ''): Game {
  return { mode, difficulty: mode === 'gauntlet' ? 'easy' : difficulty,
    ...question(mode === 'gauntlet' ? 'easy' : difficulty, previous),
    phase: 'question', guessed: '', correct: false, score: 0, streak: 0,
    stageCorrect: 0, stats: { easy: 0, medium: 0, hard: 0 } };
}
export function answer(game: Game, raw: string): Game {
  const guessed = normalise(raw);
  if (game.phase !== 'question' || !guessed) return game;
  const correct = matches(guessed, game.target);
  const multiplier = game.mode === 'gauntlet' ? { easy: 1, medium: 2, hard: 3 }[game.difficulty] : 1;
  return { ...game, phase: 'feedback', guessed, correct,
    score: correct ? game.score + 10 * multiplier : game.mode === 'gauntlet' ? game.score : 0,
    streak: correct ? game.streak + 1 : 0,
    stageCorrect: game.stageCorrect + (correct ? 1 : 0),
    stats: { ...game.stats, [game.difficulty]: game.stats[game.difficulty] + (correct ? 1 : 0) } };
}
export function advance(game: Game): Game {
  if (game.phase !== 'feedback') return game;
  if (game.mode === 'gauntlet' && !game.correct) return { ...game, phase: 'over' };
  const promote = game.mode === 'gauntlet' && game.stageCorrect >= 3;
  const difficulty = promote ? ({ easy: 'medium', medium: 'hard', hard: 'hard' } as const)[game.difficulty] : game.difficulty;
  return { ...game, ...question(difficulty, game.target), difficulty, phase: 'question', guessed: '',
    stageCorrect: promote ? 0 : game.stageCorrect };
}
export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function cleanHistory(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((v): v is string => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(`${v}T12:00:00`);
    return !Number.isNaN(d.getTime()) && dateKey(d) === v;
  }))].sort().slice(-365);
}
export function dailyStreak(history: string[], today = new Date()): number {
  const dates = new Set(history);
  const cursor = new Date(today);
  if (!dates.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (dates.has(dateKey(cursor))) { count++; cursor.setDate(cursor.getDate() - 1); }
  return count;
}
export function loadProgress(storage: Pick<Storage, 'getItem'>) {
  try {
    const raw = Number(storage.getItem('dailycsscolor-highscore'));
    const highScore = Number.isSafeInteger(raw) && raw >= 0 ? raw : 0;
    let history: string[] = [];
    try { history = cleanHistory(JSON.parse(storage.getItem('dailycsscolor-play-history') || '[]')); } catch { /* Invalid history is ignored. */ }
    return { highScore, history, available: true };
  } catch { return { highScore: 0, history: [], available: false }; }
}
export function saveProgress(storage: Pick<Storage, 'setItem'>, highScore: number, history: string[]): boolean {
  try {
    storage.setItem('dailycsscolor-highscore', String(highScore));
    storage.setItem('dailycsscolor-play-history', JSON.stringify(history));
    return true;
  } catch { return false; }
}
export function resetHighScore(storage: Pick<Storage, 'setItem'>): boolean {
  try { storage.setItem('dailycsscolor-highscore', '0'); return true; } catch { return false; }
}
/** Practice adds 10 per correct answer and resets on a miss, so a practice best is always ten times a run. */
export const cleanScore = (value: unknown): number | null => {
  const text = String(value ?? '').trim();
  if (!/^\d{1,6}$/.test(text)) return null;
  return Number(text);
};
export const runLength = (score: number) => Math.floor(score / 10);
export const scorePath = (score: number) => `/score/${score}`;
export const scoreImagePath = (score: number) => `/api/og/highscore?score=${score}&streak=${runLength(score)}`;
export function shareText(score: number): string {
  const run = runLength(score);
  return `My practice best in The Colour Game is ${score}, naming ${run} CSS colour${run === 1 ? '' : 's'} in a row. Can you beat it? #dailycsscolor`;
}
export function shareIntentUrl(score: number, origin: string): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(shareText(score))}&url=${encodeURIComponent(origin + scorePath(score))}`;
}
