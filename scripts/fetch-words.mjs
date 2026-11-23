/**
 * Build src/data/words.json from darija.io's publicly rendered structured data.
 *
 * darija.io is a Next.js site with no public API, but every word page and
 * category page embeds schema.org JSON-LD in its HTML. This script reads those
 * blocks, keeps five-character Arabizi words, and writes a committed snapshot
 * so the app has no runtime dependency on darija.io.
 *
 * Usage: npm run words:fetch
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = resolve(ROOT, "src/data/words.json");
const BASE = "https://darija.io";
const WORD_LENGTH = 5;
const VALID_WORD = /^[a-z37]{5}$/;
const CONCURRENCY = 8;

const CATEGORIES = [
  "verbs", "food", "adjectives", "slang", "home", "culture", "nature",
  "health", "shopping", "survival", "city", "transport", "compliments",
  "greetings", "emotions", "religion", "animals", "clothing", "technology",
  "emergency", "education", "sports", "directions", "architecture", "crafts",
  "time", "work", "music", "money", "family", "numbers", "pronouns",
];

async function getText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "DarijaWordleDataBuilder/1.0 (+educational project)" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function ldObjects(html) {
  const objects = [];
  const pattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  for (const match of html.matchAll(pattern)) {
    try {
      const parsed = JSON.parse(match[1]);
      objects.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore unrelated or malformed JSON-LD blocks.
    }
  }
  return objects;
}

function propsToObject(properties = []) {
  return Object.fromEntries(
    properties
      .filter((property) => property?.name && property.value != null)
      .map((property) => [property.name, property.value]),
  );
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        try {
          results[index] = await worker(items[index], index);
        } catch (error) {
          console.warn(`  ! ${error.message}`);
          results[index] = null;
        }
      }
    }),
  );
  return results;
}

async function fetchWordPages() {
  const sitemap = await getText(`${BASE}/sitemap.xml`);
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/darija\.io\/word\/[^<]+)<\/loc>/g)]
    .map((match) => match[1]);
  console.log(`Found ${urls.length} word pages in sitemap.`);

  const records = await mapWithConcurrency(urls, CONCURRENCY, async (url) => {
    const term = ldObjects(await getText(url)).find((object) => object["@type"] === "DefinedTerm");
    if (!term?.name || !VALID_WORD.test(term.name)) return null;
    const extra = propsToObject(term.additionalProperty);
    return {
      word: term.name,
      meaning: (term.description || "").trim(),
      arabic: Array.isArray(term.alternateName) ? term.alternateName[0] ?? "" : "",
      pronunciation: extra.pronunciation || "",
      category: extra.category || "",
      partOfSpeech: extra.part_of_speech || "",
      french: extra.french || "",
      sourceUrl: url,
    };
  });

  return records.filter(Boolean);
}

async function fetchCategoryFallbacks() {
  const records = await mapWithConcurrency(CATEGORIES, CONCURRENCY, async (slug) => {
    const html = await getText(`${BASE}/category/${slug}`);
    const set = ldObjects(html).find((object) => object["@type"] === "DefinedTermSet" && object.hasDefinedTerm);
    if (!set) return [];
    return set.hasDefinedTerm
      .filter((term) => VALID_WORD.test(term.name || ""))
      .map((term) => ({
        word: term.name,
        meaning: (term.description || "").trim(),
        arabic: "",
        pronunciation: "",
        category: slug,
        partOfSpeech: "",
        french: "",
        sourceUrl: `${BASE}/category/${slug}`,
      }));
  });
  return records.flat().filter(Boolean);
}

function cleanWord(record) {
  if (!record.meaning) return null;
  return {
    word: record.word,
    meaning: record.meaning,
    arabic: record.arabic,
    pronunciation: record.pronunciation,
    category: record.category,
    partOfSpeech: record.partOfSpeech,
    french: record.french,
    sourceUrl: record.sourceUrl,
  };
}

async function main() {
  console.log("Fetching darija.io word pages…");
  const fromPages = await fetchWordPages();
  console.log(`  → ${fromPages.length} five-character words from word pages.`);

  console.log("Checking category pages for stragglers…");
  const fromCategories = await fetchCategoryFallbacks();

  const byWord = new Map();
  for (const record of [...fromCategories, ...fromPages]) {
    const cleaned = cleanWord(record);
    if (cleaned) byWord.set(cleaned.word, cleaned);
  }

  const words = [...byWord.values()].sort((a, b) => a.word.localeCompare(b.word));
  if (words.length < 20) throw new Error(`Only ${words.length} words found — refusing to write a broken dataset.`);

  const payload = {
    meta: {
      source: "https://darija.io",
      license: "CC BY-NC-ND 4.0 — https://creativecommons.org/licenses/by-nc-nd/4.0/",
      generatedAt: new Date().toISOString(),
      wordLength: WORD_LENGTH,
      count: words.length,
    },
    words,
  };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${words.length} words to ${OUTPUT}`);
  console.log(words.map((word) => word.word).join(" "));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
