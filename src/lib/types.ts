export type LetterState = "correct" | "present" | "absent";

export type GameStatus = "playing" | "won" | "lost";

export interface WordEntry {
  word: string;
  meaning: string;
  arabic: string;
  pronunciation: string;
  category: string;
  partOfSpeech: string;
  french: string;
  sourceUrl: string;
}

export interface SavedGame {
  date: string;
  guesses: string[];
  status: GameStatus;
}

export interface Stats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: number[];
  lastPlayedDate: string | null;
}
