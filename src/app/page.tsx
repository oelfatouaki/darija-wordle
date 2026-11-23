import { cookies } from "next/headers";
import Game from "@/components/Game";
import dataset from "@/data/words.json";
import { getDateKey, getPuzzle } from "@/lib/daily";
import type { WordEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Darija Wordle — Daily Moroccan Arabic Word Puzzle",
  description: "Five letters, six tries, one Moroccan Darija word a day. Latin script, with 3 and 7.",
};

export default async function Home() {
  const today = getDateKey();
  const words = dataset.words as WordEntry[];
  const { entry, number } = getPuzzle(words, today);
  const cookieStore = await cookies();
  const introSeen = cookieStore.get("darija_intro")?.value === "1";

  return (
    <Game
      answer={entry}
      puzzleNumber={number}
      today={today}
      variant="compact"
      showIntro={!introSeen}
    />
  );
}
