"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareText, scoreGuess } from "@/lib/game";
import type { Stats, WordEntry } from "@/lib/types";
import { CheckIcon, ExternalLinkIcon, ShareIcon } from "./icons";
import Modal from "./Modal";
import Tile from "./Tile";

type Props = {
  open: boolean;
  onClose: () => void;
  won: boolean;
  answer: WordEntry;
  guesses: string[];
  puzzleNumber: number;
  countdown: string;
  stats: Stats;
};

const emoji: Record<string, string> = { correct: "🟩", present: "🟨", absent: "⬛" };

export default function ResultModal({ open, onClose, won, answer, guesses, puzzleNumber, countdown, stats }: Props) {
  const [copied, setCopied] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function handleShare() {
    const url = typeof window === "undefined" ? "" : `${window.location.origin}/`;
    const text = buildShareText({ guesses, answer: answer.word, puzzleNumber, won, url });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked; offer a selectable text field instead of prompt().
      setFallbackText(text);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={won ? "Salam, you got it!" : "Tomorrow’s another word"}>
      <div className="flex items-center gap-4 border-b-2 border-ink pb-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink ${
            won ? "bg-correct text-surface" : "bg-ink text-surface"
          }`}
        >
          {won ? <CheckIcon className="h-6 w-6" /> : <span className="text-2xl leading-none">×</span>}
        </div>
        <div>
          <p className="editorial-label text-muted">Puzzle no. {String(puzzleNumber).padStart(3, "0")}</p>
          <p className="mt-1 font-display text-[20px] font-extrabold tracking-tight">
            {won ? `${guesses.length} of 6 guesses` : "Out of guesses"}
          </p>
        </div>
      </div>

      <div className="mt-5 border-2 border-ink bg-paper p-4 text-center">
        <div className="mx-auto flex max-w-[240px] gap-1.5">
          {answer.word.split("").map((letter, index) => (
            <Tile key={index} letter={letter} state="correct" />
          ))}
        </div>
        <p className="mt-4 font-arabic text-[30px] leading-tight" dir="rtl" lang="ar">
          {answer.arabic}
        </p>
        <p className="mt-1 font-display text-[21px] font-bold tracking-tight">{answer.meaning}</p>
        {answer.pronunciation && <p className="mt-1 font-mono text-[11px] text-muted">/{answer.pronunciation}/</p>}
        {answer.sourceUrl && (
          <a
            href={answer.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 editorial-label text-accent underline decoration-flame decoration-2 underline-offset-[3px]"
          >
            See it on darija.io <ExternalLinkIcon className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="mt-5">
        <p className="editorial-label mb-2 text-muted">Your result</p>
        <div className="border-2 border-ink bg-ink px-3 py-3 text-center font-mono text-[13px] leading-[1.6] tracking-[0.08em]">
          {guesses.map((guess, index) => (
            <div key={index}>
              {scoreGuess(guess, answer.word).map((state, column) => (
                <span key={column}>{emoji[state]}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-flame px-5 py-3 font-display text-[14px] font-extrabold tracking-tight text-ink shadow-[4px_4px_0_var(--color-ink)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        <ShareIcon className="h-4 w-4" />
        {copied ? "Copied to clipboard!" : "Share result"}
      </button>

      {fallbackText && (
        <div className="mt-3">
          <p className="editorial-label mb-1 text-muted">Select and copy your result</p>
          <textarea
            readOnly
            value={fallbackText}
            onFocus={(event) => event.currentTarget.select()}
            className="h-24 w-full resize-none border-2 border-ink bg-paper p-2 font-mono text-[11px]"
          />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="editorial-label text-muted">
          Streak <strong className="text-ink">{stats.currentStreak}</strong>
        </span>
        <span className="editorial-label text-muted">
          Next word <strong className="font-mono text-ink">{countdown}</strong>
        </span>
      </div>
    </Modal>
  );
}
