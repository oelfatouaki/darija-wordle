"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatCountdown, getDateKey, secondsUntilNextPuzzle } from "@/lib/daily";
import { MAX_GUESSES, WORD_LENGTH, getKeyStates, validateGuess } from "@/lib/game";
import { emptyStats, loadGame, loadStats, recordResult, saveGame } from "@/lib/storage";
import type { GameStatus, SavedGame, Stats, WordEntry } from "@/lib/types";
import Grid from "./Grid";
import HelpModal from "./HelpModal";
import Intro from "./Intro";
import Keyboard from "./Keyboard";
import Logo from "./Logo";
import PosterResultModal from "./PosterResultModal";
import ResultModal from "./ResultModal";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import StatsModal from "./StatsModal";
import { TICKER_ITEMS } from "./Ticker";
import Wordmark from "./Wordmark";

type Props = {
  answer: WordEntry;
  puzzleNumber: number;
  today: string;
  variant?: "editorial" | "compact";
  showIntro?: boolean;
};

const REVEAL_MS = 600 + (WORD_LENGTH - 1) * 125 + 90;

export default function Game({
  answer,
  puzzleNumber,
  today,
  variant = "editorial",
  showIntro = false,
}: Props) {
  const [game, setGame] = useState<SavedGame>({ date: today, guesses: [], status: "playing" });
  const [draft, setDraft] = useState("");
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [introDone, setIntroDone] = useState(!showIntro);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Defer storage reads until after hydration so server and client markup match.
    const frame = requestAnimationFrame(() => {
      setGame(loadGame(today));
      setStats(loadStats());
      setSecondsLeft(secondsUntilNextPuzzle());
    });
    return () => cancelAnimationFrame(frame);
  }, [today]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(secondsUntilNextPuzzle());
      if (getDateKey() !== today) window.location.reload();
    }, 1000);
    return () => clearInterval(interval);
  }, [today]);

  useEffect(() => () => {
    [toastTimer, shakeTimer, revealTimer, resultTimer].forEach((timer) => {
      if (timer.current) clearTimeout(timer.current);
    });
  }, []);

  // A magnetic spotlight and a contextual, smooth-following cursor.
  useEffect(() => {
    if (variant !== "compact") return;
    const node = posterRef.current;
    const cursor = cursorRef.current;
    if (!node) return;
    const label = cursor?.querySelector("[data-cursor-label]") ?? null;
    let currentLabel = "";

    const onMove = (event: MouseEvent) => {
      node.style.setProperty("--mx", `${event.clientX}px`);
      node.style.setProperty("--my", `${event.clientY}px`);
      if (!cursor) return;
      cursor.style.opacity = "1";
      const target = event.target instanceof Element ? event.target.closest("[data-cursor]") : null;
      const next = target?.getAttribute("data-cursor") ?? "EXPLORE";
      if (next !== currentLabel) {
        if (label) label.textContent = next;
        cursor.dataset.state = target ? "active" : "idle";
        currentLabel = next;
      }
    };
    const onLeave = () => {
      if (cursor) cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [variant]);

  const locked = game.status !== "playing" || revealingRow !== null;

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  // Only one dialog at a time — including when the result auto-opens.
  const openHelp = useCallback(() => {
    setStatsOpen(false);
    setResultOpen(false);
    setHelpOpen(true);
  }, []);

  const openStats = useCallback(() => {
    setHelpOpen(false);
    setResultOpen(false);
    setStatsOpen(true);
  }, []);

  const showResult = useCallback(() => {
    setHelpOpen(false);
    setStatsOpen(false);
    setResultOpen(true);
  }, []);

  const finishGame = useCallback((status: Exclude<GameStatus, "playing">, guesses: string[]) => {
    setStats((previous) => recordResult({ date: today, status, guessCount: guesses.length, stats: previous }));
    resultTimer.current = setTimeout(showResult, 750);
  }, [showResult, today]);

  const submitGuess = useCallback(() => {
    if (locked) return;

    const error = validateGuess(draft);
    if (error) {
      setShaking(true);
      showToast(error);
      if (shakeTimer.current) clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => setShaking(false), 400);
      return;
    }

    const guesses = [...game.guesses, draft];
    const won = draft === answer.word;
    const status: GameStatus = won ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing";
    const nextGame: SavedGame = { date: today, guesses, status };

    setGame(nextGame);
    saveGame(nextGame);
    setDraft("");
    setRevealingRow(guesses.length - 1);

    revealTimer.current = setTimeout(() => {
      setRevealingRow(null);
      if (status !== "playing") finishGame(status, guesses);
    }, REVEAL_MS);
  }, [locked, draft, game.guesses, answer.word, today, finishGame, showToast]);

  const handleKey = useCallback((key: string) => {
    if (locked) return;
    if (key === "enter") {
      submitGuess();
      return;
    }
    if (key === "backspace") {
      setDraft((previous) => previous.slice(0, -1));
      return;
    }
    if (draft.length >= WORD_LENGTH) return;
    setDraft((previous) => previous + key);
  }, [draft.length, locked, submitGuess]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (helpOpen || statsOpen || resultOpen) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === "enter") {
        event.preventDefault();
        handleKey("enter");
      } else if (key === "backspace") {
        event.preventDefault();
        handleKey("backspace");
      } else if (/^[a-z]$/.test(key) || key === "3" || key === "7") {
        handleKey(key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey, helpOpen, statsOpen, resultOpen]);

  const confirmedGuesses = revealingRow === null ? game.guesses : game.guesses.slice(0, revealingRow);
  const keyStates = useMemo(() => getKeyStates(confirmedGuesses, answer.word), [confirmedGuesses, answer.word]);
  const countdown = secondsLeft === null ? "--:--:--" : formatCountdown(secondsLeft);

  const toastBanner = (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      {toast && (
        <div className="toast-in border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-semibold text-surface shadow-[4px_4px_0_var(--color-flame)]">
          {toast}
        </div>
      )}
    </div>
  );

  const dialogs = (
    <>
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        countdown={countdown}
        currentGuessCount={game.guesses.length}
        status={game.status}
      />
      {variant === "compact" ? (
        <PosterResultModal
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          won={game.status === "won"}
          answer={answer}
          guesses={game.guesses}
          puzzleNumber={puzzleNumber}
          countdown={countdown}
          stats={stats}
        />
      ) : (
        <ResultModal
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          won={game.status === "won"}
          answer={answer}
          guesses={game.guesses}
          puzzleNumber={puzzleNumber}
          countdown={countdown}
          stats={stats}
        />
      )}
    </>
  );

  if (variant === "compact") {
    const edition = String(puzzleNumber).padStart(3, "0");

    return (
      <>
        <div
          ref={posterRef}
          className={`poster-root relative flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-ink text-paper ${introDone ? "poster-ready" : ""}`}
        >
          <div aria-hidden="true" className="poster-grid pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="poster-spotlight pointer-events-none absolute inset-0" />
          <div ref={cursorRef} aria-hidden="true" className="poster-cursor pointer-events-none fixed inset-0 z-[60] opacity-0">
            <span className="poster-cursor-halo" />
            <span className="poster-cursor-core">
              <span data-cursor-label>EXPLORE</span>
            </span>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-line-dark md:inset-5" />

          <span aria-hidden="true" className="cross-in pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-dim/70 md:left-4 md:top-4" />
          <span aria-hidden="true" className="cross-in pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-dim/70 delay-100 md:right-4 md:top-4" />
          <span aria-hidden="true" className="cross-in pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-dim/70 delay-200 md:bottom-4 md:left-4" />
          <span aria-hidden="true" className="cross-in pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-dim/70 delay-300 md:bottom-4 md:right-4" />

          <div aria-hidden="true" className="relative z-10 flex h-6 shrink-0 items-center overflow-hidden border-b border-line-dark">
            <div className="marquee-track marquee-fast editorial-label text-dim">
              {[0, 1].map((copy) => (
                <span key={copy} className="flex items-center whitespace-nowrap">
                  {TICKER_ITEMS.map((item) => (
                    <span key={item} className="flex items-center">
                      <span className="mx-3 text-flame">✳</span>
                      {item}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-5 py-3 md:px-8">
            <Logo compact inverse />
            <div className="flex items-center gap-2">
              <span className="editorial-label hidden text-dim lg:inline">Edition {edition}</span>
              <button
                type="button"
                onClick={openStats}
                aria-label="Stats — view your statistics"
                data-cursor="OPEN"
                className="inline-flex min-h-6 items-center border border-line-dark px-2 py-1 editorial-label text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                Stats
              </button>
              <button
                type="button"
                onClick={openHelp}
                aria-label="Help — how to play"
                data-cursor="OPEN"
                className="inline-flex min-h-6 items-center border border-line-dark px-2 py-1 editorial-label text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
              >
                Help
              </button>
            </div>
          </header>

          <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-1 px-4 pb-1 md:flex-row md:gap-6 md:px-8">
            <section className="w-full shrink-0 md:min-w-0 md:flex-1">
              <p className="editorial-label text-dim">
                <span className="text-flame">01</span> / Morocco, one word at a time
              </p>
              <Wordmark onNudge={() => showToast("Start typing — today’s word is waiting.")} />
              <p className="line-up delay-100 mt-3 max-w-[30ch] font-serif text-[clamp(15px,2vw,22px)] italic leading-tight text-dim md:mt-4">
                Moroccan daily word puzzle
              </p>
              <div className="poster-hide-short mt-4 hidden items-center gap-3 md:flex">
                <span aria-hidden="true" className="h-px w-10 bg-flame" />
                <span className="editorial-label text-dim">3 = ع · 7 = ح</span>
              </div>
            </section>

            <section
              data-cursor="PLAY"
              className="poster-card relative w-full max-w-[min(100%,64vh,540px)] shrink-0 md:-translate-x-8 md:-rotate-1 md:transition-transform md:duration-500 md:hover:rotate-0"
            >
              {game.status === "won" && (
                <span
                  aria-hidden="true"
                  className="stamp-in absolute -left-3 -top-3 z-10 -rotate-12 border-2 border-correct bg-surface px-2 py-1 editorial-label text-correct"
                >
                  Solved
                </span>
              )}
              <div className="poster-card-inner border-2 border-ink bg-surface p-3 text-ink shadow-[8px_8px_0_var(--color-flame)] md:p-4 md:shadow-[12px_12px_0_var(--color-flame)]">
                <div className="mb-1 flex items-center justify-between border-b border-line pb-1 editorial-label">
                  <span>Daily word · No. {edition}</span>
                  <span className="text-muted">06 × 05</span>
                </div>

                <div className="poster-board my-1 w-full max-w-[min(100%,52vh)]">
                  <Grid
                    guesses={game.guesses}
                    answer={answer.word}
                    draft={draft}
                    revealingRow={revealingRow}
                    shaking={shaking}
                    compact
                  />
                </div>

                <div data-cursor="TYPE" className="poster-keys mt-2 w-full max-w-[min(100%,50vh)] border-t border-line pt-2">
                  <Keyboard keyStates={keyStates} onKey={handleKey} disabled={locked} compact />
                </div>

                <div className="poster-hide-short mt-3 flex items-center justify-between border-t border-line pt-2 editorial-label text-muted">
                  <span>Next word in</span>
                  <span className="font-mono text-ink">{countdown}</span>
                </div>

                {game.status !== "playing" && !resultOpen && (
                  <button
                    type="button"
                    onClick={showResult}
                    className="mx-auto mt-3 block border border-ink px-3 py-1.5 editorial-label text-ink transition-colors hover:bg-ink hover:text-surface"
                  >
                    See today’s result
                  </button>
                )}
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-flame" />
            </section>
          </main>

          <footer className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-t border-line-dark px-5 py-2 editorial-label text-dim md:px-8">
            <span>Words: darija.io · CC BY-NC-ND 4.0</span>
            <span className="hidden sm:inline">A little Darija, every day.</span>
            <span>
              Developped by{" "}
              <a
                href="https://github.com/oelfatouaki"
                target="_blank"
                rel="noreferrer"
                data-cursor="VISIT"
                className="text-paper underline decoration-line underline-offset-2 transition-colors hover:text-flame"
              >
                Oussama EL Fatouaki
              </a>
            </span>
          </footer>
        </div>
        {showIntro && <Intro onDone={handleIntroDone} />}
        {toastBanner}
        {dialogs}
      </>
    );
  }

  return (
    <>
      <SiteHeader onHelp={openHelp} onStats={openStats} />

      <main className="flex flex-1 flex-col">
        <section className="rise-in pt-8 sm:pt-10">
          <div className="flex items-center justify-between editorial-label">
            <span className="text-accent">Daily puzzle</span>
            <span className="text-muted">
              No. {String(puzzleNumber).padStart(3, "0")} · Morocco, one word at a time
            </span>
          </div>

          <h1 className="mt-4 font-display text-[clamp(38px,9.4vw,64px)] leading-[0.93] font-extrabold tracking-[-0.06em]">
            Guess the <span className="font-serif font-normal italic text-flame">Darija</span> word
          </h1>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-sm text-[13px] leading-relaxed text-muted">
              Five characters, six tries, one word a day. Type with a–z, <strong className="text-ink">3</strong> and{" "}
              <strong className="text-ink">7</strong>.
            </p>

            <div className="flex shrink-0 items-center gap-4 border-l-2 border-line pl-4">
              <div>
                <p className="editorial-label text-muted">Character guide</p>
                <div className="mt-1.5 flex items-center gap-2 font-mono text-[12px] text-ink">
                  <span>
                    <strong>3</strong> = <span className="font-arabic text-[13px]" lang="ar">ع</span>
                  </span>
                  <span aria-hidden="true" className="text-line">/</span>
                  <span>
                    <strong>7</strong> = <span className="font-arabic text-[13px]" lang="ar">ح</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rise-in delay-100 relative mt-7 border-2 border-ink bg-surface p-4 shadow-[7px_7px_0_var(--color-ink)] sm:p-6">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-line">
            <div
              className="h-full bg-ink transition-[width] duration-500"
              style={{ width: `${(game.guesses.length / MAX_GUESSES) * 100}%` }}
            />
          </div>
          <Grid
            guesses={game.guesses}
            answer={answer.word}
            draft={draft}
            revealingRow={revealingRow}
            shaking={shaking}
          />

          {game.status !== "playing" && !resultOpen && (
            <button
              type="button"
              onClick={showResult}
              className="mx-auto mt-5 block border-2 border-ink px-4 py-2 editorial-label text-ink transition-colors hover:bg-ink hover:text-surface"
            >
              See today’s result
            </button>
          )}
        </section>

        <div className="rise-in delay-200 mt-7">
          <Keyboard keyStates={keyStates} onKey={handleKey} disabled={locked} />
        </div>

        <p className="rise-in delay-300 mt-5 text-center editorial-label text-muted">
          Enter to submit · Backspace to edit · A new word lands at midnight, Morocco time
        </p>
      </main>

      <SiteFooter />

      {toastBanner}
      {dialogs}
    </>
  );
}
