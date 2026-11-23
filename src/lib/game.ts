import type { LetterState } from "./types";

export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;
export const ALLOWED_LETTERS = "abcdefghijklmnopqrstuvwxyz37";
export const KEYBOARD_ROWS: string[][] = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "3", "7", "backspace"],
];

/**
 * Score a guess with classic Wordle duplicate handling: every exact match is
 * claimed first, then remaining letters are matched against what is left over.
 */
export function scoreGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill("absent");
  const answerLetters = answer.split("");
  const guessLetters = guess.split("");
  const unclaimed: number[] = [];

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guessLetters[index] === answerLetters[index]) {
      result[index] = "correct";
      answerLetters[index] = "";
    } else {
      unclaimed.push(index);
    }
  }

  for (const index of unclaimed) {
    const match = answerLetters.indexOf(guessLetters[index]);
    if (match !== -1) {
      result[index] = "present";
      answerLetters[match] = "";
    }
  }

  return result;
}

export function validateGuess(guess: string): string | null {
  if (guess.length !== WORD_LENGTH) return `Five characters, please — you typed ${guess.length}.`;
  if (![...guess].every((letter) => ALLOWED_LETTERS.includes(letter))) {
    return "Use a–z, 3 or 7 only.";
  }
  return null;
}

/** Highest-priority state seen for each key across all submitted guesses. */
export function getKeyStates(guesses: string[], answer: string): Record<string, LetterState> {
  const priority: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 };
  const states: Record<string, LetterState> = {};

  for (const guess of guesses) {
    scoreGuess(guess, answer).forEach((state, index) => {
      const key = guess[index];
      if (!states[key] || priority[state] > priority[states[key]]) states[key] = state;
    });
  }

  return states;
}

export function shareGrid(guesses: string[], answer: string): string {
  const icons: Record<LetterState, string> = {
    correct: "🟩",
    present: "🟨",
    absent: "⬛",
  };
  return guesses.map((guess) => scoreGuess(guess, answer).map((state) => icons[state]).join("")).join("\n");
}

export function buildShareText(options: {
  guesses: string[];
  answer: string;
  puzzleNumber: number;
  won: boolean;
  url: string;
}): string {
  const { guesses, answer, puzzleNumber, won, url } = options;
  const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Darija Wordle #${puzzleNumber} ${score}\n\n${shareGrid(guesses, answer)}\n\n${url}`;
}
