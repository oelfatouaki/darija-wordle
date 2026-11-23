import { isConsecutiveDay } from "./daily";
import type { GameStatus, SavedGame, Stats } from "./types";

const GAME_KEY = "darija-wordle/v1/game";
const STATS_KEY = "darija-wordle/v1/stats";
const MAX_DISTRIBUTION = 6;

export const emptyStats: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: Array(MAX_DISTRIBUTION).fill(0),
  lastPlayedDate: null,
};

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private mode; the game still works in memory.
  }
}

export function loadGame(date: string): SavedGame {
  const stored = read<SavedGame>(GAME_KEY);
  if (stored?.date === date && Array.isArray(stored.guesses)) return stored;
  return { date, guesses: [], status: "playing" };
}

export function saveGame(game: SavedGame) {
  write(GAME_KEY, game);
}

export function loadStats(): Stats {
  const stored = read<Stats>(STATS_KEY);
  if (!stored) return emptyStats;
  const distribution = Array.from({ length: MAX_DISTRIBUTION }, (_, index) => stored.distribution?.[index] ?? 0);
  return {
    played: Number(stored.played) || 0,
    wins: Number(stored.wins) || 0,
    currentStreak: Number(stored.currentStreak) || 0,
    maxStreak: Number(stored.maxStreak) || 0,
    distribution,
    lastPlayedDate: stored.lastPlayedDate ?? null,
  };
}

/** Records a finished puzzle exactly once, then returns the updated stats. */
export function recordResult(options: {
  date: string;
  status: Exclude<GameStatus, "playing">;
  guessCount: number;
  stats: Stats;
}): Stats {
  const { date, status, guessCount, stats } = options;
  if (stats.lastPlayedDate === date) return stats;

  const won = status === "won";
  const streak = won ? (isConsecutiveDay(stats.lastPlayedDate, date) ? stats.currentStreak + 1 : 1) : 0;
  const distribution = [...stats.distribution];
  if (won && guessCount >= 1 && guessCount <= MAX_DISTRIBUTION) {
    distribution[guessCount - 1] += 1;
  }

  const updated: Stats = {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    currentStreak: streak,
    maxStreak: Math.max(stats.maxStreak, streak),
    distribution,
    lastPlayedDate: date,
  };

  write(STATS_KEY, updated);
  return updated;
}
