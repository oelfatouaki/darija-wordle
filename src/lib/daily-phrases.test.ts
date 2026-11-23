import { describe, expect, it } from "vitest";
import { DAILY_PHRASES, getDailyPhrase } from "./daily-phrases";

describe("daily phrases", () => {
  it("starts on the corrected requested phrase", () => {
    expect(getDailyPhrase("2026-11-23").lines.join(" ")).toBe("l3eb ila baghi tl3eb");
  });

  it("never uses 'la' where 'ila' (if) is meant", () => {
    expect(DAILY_PHRASES.some((phrase) => /(?:^|\s)la baghi/.test(phrase.lines.join(" ")))).toBe(false);
  });

  it("rotates deterministically through every phrase before repeating", () => {
    const seen = new Set<string>();
    for (let offset = 0; offset < DAILY_PHRASES.length; offset += 1) {
      const date = new Date(Date.UTC(2026, 10, 23 + offset)).toISOString().slice(0, 10);
      const phrase = getDailyPhrase(date);
      expect(getDailyPhrase(date)).toBe(phrase);
      seen.add(phrase.id);
    }
    expect(seen.size).toBe(DAILY_PHRASES.length);
  });

  it("keeps every phrase sourced from darija.io with a translation", () => {
    for (const phrase of DAILY_PHRASES) {
      expect(phrase.source).toMatch(/^https:\/\/darija\.io\//);
      expect(phrase.arabic.length).toBeGreaterThan(0);
      expect(phrase.meaning.length).toBeGreaterThan(0);
      expect(phrase.lines.join(" ").length).toBeGreaterThan(0);
    }
  });
});
