import { describe, expect, it } from "vitest";
import dataset from "../data/words.json";
import { INTRO_WORDS } from "./intro-words";

const puzzleWords = new Set(dataset.words.map((entry) => entry.word.toLowerCase()));

describe("intro words", () => {
  it("never shows a word from the daily puzzle set", () => {
    for (const item of INTRO_WORDS) {
      expect(puzzleWords.has(item.latin.toLowerCase())).toBe(false);
    }
  });

  it("has a Latin spelling, Arabic spelling, and meaning for every word", () => {
    for (const item of INTRO_WORDS) {
      expect(item.latin.length).toBeGreaterThan(0);
      expect(item.arabic.length).toBeGreaterThan(0);
      expect(item.meaning.length).toBeGreaterThan(0);
    }
  });

  it("has no duplicate Latin spellings", () => {
    const latin = INTRO_WORDS.map((item) => item.latin.toLowerCase());
    expect(new Set(latin).size).toBe(latin.length);
  });
});
