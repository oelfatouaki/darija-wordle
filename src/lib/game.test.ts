import { describe, expect, it } from "vitest";
import { buildShareText, getKeyStates, scoreGuess, validateGuess } from "./game";

describe("scoreGuess", () => {
  it("marks an exact match", () => {
    expect(scoreGuess("salam", "salam")).toEqual(["correct", "correct", "correct", "correct", "correct"]);
  });

  it("separates right-letter-wrong-place from absent letters", () => {
    expect(scoreGuess("salam", "labas")).toEqual(["present", "correct", "present", "correct", "absent"]);
  });

  it("does not award a repeated letter more times than it appears in the answer", () => {
    expect(scoreGuess("salam", "bzzaf")).toEqual(["absent", "absent", "absent", "correct", "absent"]);
  });

  it("claims exact matches before present matches", () => {
    expect(scoreGuess("taman", "tlata")).toEqual(["correct", "present", "absent", "present", "absent"]);
  });

  it("scores digits like any other character", () => {
    expect(scoreGuess("3lash", "3afak")).toEqual(["correct", "absent", "present", "absent", "absent"]);
  });
});

describe("validateGuess", () => {
  it("accepts letters, 3 and 7", () => {
    expect(validateGuess("sh7al")).toBeNull();
    expect(validateGuess("3afak")).toBeNull();
    expect(validateGuess("salam")).toBeNull();
  });

  it("rejects wrong lengths and unsupported characters", () => {
    expect(validateGuess("sala")).toMatch(/Five characters/);
    expect(validateGuess("salamm")).toMatch(/Five characters/);
    expect(validateGuess("sala!")).toMatch(/a–z/);
    expect(validateGuess("9afak")).toMatch(/a–z/);
  });
});

describe("getKeyStates", () => {
  it("keeps the strongest state for a key across guesses", () => {
    const states = getKeyStates(["salam", "mzyan"], "mzyan");
    expect(states.a).toBe("correct");
    expect(states.m).toBe("correct");
    expect(states.s).toBe("absent");
    expect(states.l).toBe("absent");
  });
});

describe("buildShareText", () => {
  it("renders the score and emoji grid", () => {
    const text = buildShareText({
      guesses: ["salam", "mzyan"],
      answer: "salam",
      puzzleNumber: 7,
      won: true,
      url: "https://example.com",
    });
    expect(text).toContain("Darija Wordle #7 2/6");
    expect(text).toContain("🟩🟩🟩🟩🟩\n🟨⬛⬛🟩⬛");
    expect(text).toContain("https://example.com");
  });
});
