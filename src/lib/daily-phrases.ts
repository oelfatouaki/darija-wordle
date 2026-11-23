import { dayNumber } from "./daily";

export type DailyPhrase = {
  id: string;
  lines: string[];
  arabic: string;
  meaning: string;
  source: string;
};

/**
 * Short Darija lines from darija.io, rotated one per day in Morocco time.
 * The order is deliberately mixed so the rotation reads as random while still
 * being identical for every visitor and never repeating inside a full cycle.
 */
export const DAILY_PHRASES: DailyPhrase[] = [
  {
    id: "play-if-you-want",
    lines: ["l3eb ila", "baghi tl3eb"],
    arabic: "لعب إذا بغيت تلعب",
    meaning: "Play if you want to play",
    source: "https://darija.io/word/verbs-00280",
  },
  {
    id: "hello-how-are-you",
    lines: ["Salam,", "labas?"],
    arabic: "سلام، لاباس؟",
    meaning: "Hello, how are you?",
    source: "https://darija.io/how-to-say/hello",
  },
  {
    id: "how-are-you-today",
    lines: ["Kif dayer", "lyum?"],
    arabic: "كيف داير اليوم؟",
    meaning: "How are you today?",
    source: "https://darija.io/how-to-say/how-are-you",
  },
  {
    id: "good-morning",
    lines: ["sbah lkhir"],
    arabic: "صباح الخير",
    meaning: "Good morning",
    source: "https://darija.io/first-day",
  },
  {
    id: "good-evening",
    lines: ["msa lkhir"],
    arabic: "مسا الخير",
    meaning: "Good evening",
    source: "https://darija.io/first-day",
  },
  {
    id: "good-night",
    lines: ["tsbah 3la", "khir"],
    arabic: "تصبح على خير",
    meaning: "Good night",
    source: "https://darija.io/first-day",
  },
  {
    id: "whats-your-name",
    lines: ["shno", "smiytek"],
    arabic: "شنو سميتك",
    meaning: "What's your name?",
    source: "https://darija.io/first-day",
  },
  {
    id: "thank-god",
    lines: ["Lhamdullah"],
    arabic: "الحمد لله",
    meaning: "Thank God",
    source: "https://darija.io/how-to-say/thank-you",
  },
  {
    id: "god-give-you-health",
    lines: ["Llah y3tik", "ss7a"],
    arabic: "الله يعطيك الصحّة",
    meaning: "God give you health",
    source: "https://darija.io/how-to-say/thank-you",
  },
  {
    id: "god-be-with-you",
    lines: ["Rbi m3ak"],
    arabic: "ربي معاك",
    meaning: "God be with you",
    source: "https://darija.io/how-to-say/goodbye",
  },
  {
    id: "one-tea-please",
    lines: ["Wahd atay,", "3afak"],
    arabic: "واحد أتاي، عافاك",
    meaning: "One tea, please",
    source: "https://darija.io/how-to-say/please",
  },
  {
    id: "the-bill-please",
    lines: ["L7sab,", "3afak"],
    arabic: "الحساب، عافاك",
    meaning: "The bill, please",
    source: "https://darija.io/how-to-say/please",
  },
  {
    id: "how-much",
    lines: ["Bsh7al", "hada?"],
    arabic: "بشحال هادا؟",
    meaning: "How much is this?",
    source: "https://darija.io/how-to-say/how-much",
  },
  {
    id: "say-again",
    lines: ["Mafhemtsh,", "3awd 3afak"],
    arabic: "مافهمتش، عاود عافاك",
    meaning: "I don't understand, repeat please",
    source: "https://darija.io/how-to-say/i-dont-understand",
  },
  {
    id: "too-much",
    lines: ["Ssma7 liya,", "hada bzzaf!"],
    arabic: "سمح ليا، هادا بزاف!",
    meaning: "Sorry, that's too much!",
    source: "https://darija.io/how-to-say/sorry",
  },
  {
    id: "if-you-want",
    lines: ["ila bghiti", "nmshiw"],
    arabic: "إلا بغيتي نمشيو",
    meaning: "If you want, let's go",
    source: "https://darija.io/word/verbs-04438",
  },
  {
    id: "who-wants-finds",
    lines: ["Lli bgha shi", "7aja yqlbha"],
    arabic: "اللي بغا شي حاجة يقلبها",
    meaning: "Who wants something finds it",
    source: "https://darija.io/phrase/phrase-0992",
  },
];

/** Launch day starts the cycle on the requested phrase, then rotates daily. */
const LAUNCH_DAY = dayNumber("2026-11-23");

export function getDailyPhrase(dateKey: string): DailyPhrase {
  const elapsed = dayNumber(dateKey) - LAUNCH_DAY;
  const index = ((elapsed % DAILY_PHRASES.length) + DAILY_PHRASES.length) % DAILY_PHRASES.length;
  return DAILY_PHRASES[index];
}
