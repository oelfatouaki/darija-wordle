export type IntroWord = {
  latin: string;
  arabic: string;
  meaning: string;
};

/**
 * Curated decorative words for the intro only. None of these are in the
 * five-letter daily puzzle set (enforced by intro-words.test.ts).
 */
export const INTRO_WORDS: IntroWord[] = [
  { latin: "sba7", arabic: "صباح", meaning: "morning" },
  { latin: "3chiya", arabic: "عشية", meaning: "evening" },
  { latin: "haja", arabic: "حاجة", meaning: "thing" },
  { latin: "dar", arabic: "دار", meaning: "home" },
  { latin: "souk", arabic: "سوق", meaning: "market" },
  { latin: "atay", arabic: "أتاي", meaning: "mint tea" },
  { latin: "qahwa", arabic: "قهوة", meaning: "coffee" },
  { latin: "7lib", arabic: "حليب", meaning: "milk" },
  { latin: "fjour", arabic: "فطور", meaning: "breakfast" },
  { latin: "3cha", arabic: "عشاء", meaning: "dinner" },
  { latin: "jdid", arabic: "جديد", meaning: "new" },
  { latin: "qdim", arabic: "قديم", meaning: "old" },
  { latin: "kbir", arabic: "كبير", meaning: "big" },
  { latin: "tayeb", arabic: "طيّب", meaning: "good / tasty" },
  { latin: "3ziz", arabic: "عزيز", meaning: "dear" },
  { latin: "7bibi", arabic: "حبيبي", meaning: "my love" },
  { latin: "chams", arabic: "شمس", meaning: "sun" },
  { latin: "qmar", arabic: "قمر", meaning: "moon" },
  { latin: "njoum", arabic: "نجوم", meaning: "stars" },
  { latin: "sma", arabic: "سماء", meaning: "sky" },
  { latin: "b7ar", arabic: "بحر", meaning: "sea" },
  { latin: "jbal", arabic: "جبل", meaning: "mountain" },
  { latin: "ktab", arabic: "كتاب", meaning: "book" },
  { latin: "flous", arabic: "فلوس", meaning: "money" },
  { latin: "dralem", arabic: "دراهم", meaning: "dirhams" },
  { latin: "khdma", arabic: "خدمة", meaning: "work" },
  { latin: "bshwiya", arabic: "بشويّة", meaning: "slowly" },
  { latin: "bakra", arabic: "بكرا", meaning: "tomorrow" },
  { latin: "goul", arabic: "قول", meaning: "say" },
  { latin: "chouf", arabic: "شوف", meaning: "look" },
  { latin: "sm3", arabic: "سمع", meaning: "listen" },
  { latin: "aji", arabic: "أجي", meaning: "come" },
  { latin: "mchi", arabic: "امشي", meaning: "go" },
  { latin: "sber", arabic: "صبر", meaning: "wait" },
  { latin: "3ta", arabic: "عطى", meaning: "give" },
  { latin: "khod", arabic: "خذ", meaning: "take" },
  { latin: "dir", arabic: "دير", meaning: "do / make" },
  { latin: "l7sab", arabic: "الحساب", meaning: "the bill" },
  { latin: "7ammam", arabic: "حمّام", meaning: "hammam / bathroom" },
];
