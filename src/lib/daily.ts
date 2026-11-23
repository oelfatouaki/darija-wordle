import type { WordEntry } from "./types";

const TIME_ZONE = "Africa/Casablanca";
const EPOCH = Date.UTC(2026, 0, 1);
const DAY_MS = 86_400_000;
const SCHEDULE_SEED = 0xd4a11a;

/** e.g. "2026-11-23" in Morocco time, so the daily word flips at local midnight. */
export function getDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function dayNumber(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor((Date.UTC(year, month - 1, day) - EPOCH) / DAY_MS);
}

function mulberry32(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/** A fixed shuffle keeps the whole cycle unique before any word repeats. */
export function buildSchedule(words: WordEntry[]): WordEntry[] {
  const schedule = [...words].sort((a, b) => a.word.localeCompare(b.word));
  const random = mulberry32(SCHEDULE_SEED);
  for (let index = schedule.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [schedule[index], schedule[swap]] = [schedule[swap], schedule[index]];
  }
  return schedule;
}

export function getPuzzle(words: WordEntry[], dateKey: string) {
  const schedule = buildSchedule(words);
  const number = dayNumber(dateKey);
  const index = ((number % schedule.length) + schedule.length) % schedule.length;
  return { entry: schedule[index], number: number + 1, index };
}

export function isConsecutiveDay(previous: string | null, current: string): boolean {
  if (!previous) return false;
  return dayNumber(current) - dayNumber(previous) === 1;
}

/** Seconds until the next midnight in Morocco, derived from the local clock. */
export function secondsUntilNextPuzzle(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);

  const part = (type: string) => Number(parts.find((item) => item.type === type)?.value ?? 0) % 24;
  const elapsed = part("hour") * 3600 + part("minute") * 60 + part("second");
  return DAY_MS / 1000 - elapsed;
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
