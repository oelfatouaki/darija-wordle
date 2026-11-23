import Game from "@/components/Game";
import Ticker from "@/components/Ticker";
import dataset from "@/data/words.json";
import { getDateKey, getPuzzle } from "@/lib/daily";
import type { WordEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editorial edition — Darija Wordle",
  description: "The original editorial edition of the daily Darija word puzzle.",
};

export default function Editorial() {
  const today = getDateKey();
  const words = dataset.words as WordEntry[];
  const { entry, number } = getPuzzle(words, today);

  return (
    <div className="min-h-screen">
      <Ticker />
      <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
        <Game answer={entry} puzzleNumber={number} today={today} variant="editorial" />
      </div>
    </div>
  );
}
