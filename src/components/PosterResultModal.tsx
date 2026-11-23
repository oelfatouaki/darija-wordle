"use client";

import { useEffect, useRef, useState } from "react";
import { buildShareText, scoreGuess } from "@/lib/game";
import type { Stats, WordEntry } from "@/lib/types";
import { CheckIcon, CloseIcon, ExternalLinkIcon, ShareIcon } from "./icons";
import LogoMark from "./LogoMark";
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

const EMOJI: Record<string, string> = { correct: "🟩", present: "🟨", absent: "⬛" };

export default function PosterResultModal({
  open,
  onClose,
  won,
  answer,
  guesses,
  puzzleNumber,
  countdown,
  stats,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const edition = String(puzzleNumber).padStart(3, "0");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

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
      setFallbackText(text);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="poster-result-title"
      className="poster-dialog w-[calc(100%-2rem)] max-w-[480px] rounded-none border-2 border-paper bg-ink p-0 text-paper shadow-[10px_10px_0_var(--color-flame)]"
    >
      <div className="modal-in relative max-h-[88vh] overflow-y-auto px-5 py-6 sm:px-7">
        <div aria-hidden="true" className="poster-grid pointer-events-none absolute inset-0 opacity-25" />
        <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-flame" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-flame" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <LogoMark className="h-5 w-5" />
                <p className="editorial-label text-flame">Result / No. {edition}</p>
              </div>
              <h2
                id="poster-result-title"
                className="mt-2 font-display text-[clamp(32px,7vw,52px)] leading-[0.9] font-extrabold tracking-[-0.06em]"
              >
                {won ? <>Solved<span className="text-flame">.</span></> : <>Tomorrow<span className="text-flame">.</span></>}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close result"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-dark text-paper transition-colors hover:border-flame hover:text-flame"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 editorial-label text-dim">
            {won ? `${guesses.length} of 6 guesses` : "Out of guesses"} · darija wordle
          </p>

          <div className="mt-5 border border-ink bg-surface p-4 text-ink shadow-[6px_6px_0_var(--color-flame)]">
            <div className="flex items-center justify-between editorial-label text-muted">
              <span>Today&apos;s word</span>
              <span>No. {edition}</span>
            </div>
            <div className="mx-auto mt-3 flex max-w-[220px] gap-1.5">
              {answer.word.split("").map((letter, index) => (
                <Tile key={index} letter={letter} state="correct" tileIndex={index} />
              ))}
            </div>
            <div className="mt-4 border-t border-line pt-3 text-center">
              <p className="font-arabic text-[30px] leading-tight" dir="rtl" lang="ar">
                {answer.arabic}
              </p>
              <p className="mt-1 font-display text-[21px] font-bold tracking-tight">{answer.meaning}</p>
              {answer.pronunciation && (
                <p className="mt-1 font-mono text-[11px] text-muted">/{answer.pronunciation}/</p>
              )}
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
          </div>

          <div className="mt-5">
            <p className="editorial-label mb-2 text-dim">Your result</p>
            <div className="border border-line-dark bg-paper px-3 py-3 text-center font-mono text-[13px] leading-[1.6] tracking-[0.08em] text-ink">
              {guesses.map((guess, index) => (
                <div key={index}>
                  {scoreGuess(guess, answer.word).map((state, column) => (
                    <span key={column}>{EMOJI[state]}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-ink bg-flame px-5 py-3 font-display text-[14px] font-extrabold tracking-tight text-ink shadow-[5px_5px_0_var(--color-paper)] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            {won ? <CheckIcon className="h-4 w-4" /> : <ShareIcon className="h-4 w-4" />}
            {copied ? "Copied to clipboard!" : "Share result"}
          </button>

          {fallbackText && (
            <div className="mt-3">
              <p className="editorial-label mb-1 text-dim">Select and copy your result</p>
              <textarea
                readOnly
                value={fallbackText}
                onFocus={(event) => event.currentTarget.select()}
                className="h-24 w-full resize-none border border-line-dark bg-paper p-2 font-mono text-[11px] text-ink"
              />
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-line-dark pt-3 editorial-label text-dim">
            <span>
              Streak <strong className="text-paper">{stats.currentStreak}</strong>
            </span>
            <span>
              Next word <strong className="font-mono text-flame">{countdown}</strong>
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
