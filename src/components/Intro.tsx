"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { INTRO_WORDS } from "@/lib/intro-words";
import LogoMark from "./LogoMark";

const INTRO_MS = 3400;
const EXIT_MS = 900;
const WORD_CYCLE_MS = 560;
const SCATTER: Array<[number, number]> = [
  [-150, -90],
  [90, -140],
  [-70, 110],
  [160, 50],
  [-140, 30],
  [80, 130],
  [20, -150],
];
const GLYPHS: Array<{ char: string; position: CSSProperties; arabic?: boolean }> = [
  { char: "3", position: { left: "6%", top: "28%", animationDelay: "0s" } },
  { char: "7", position: { right: "8%", top: "22%", animationDelay: "0.6s" } },
  { char: "ع", arabic: true, position: { left: "11%", bottom: "24%", animationDelay: "1.2s" } },
  { char: "ح", arabic: true, position: { right: "13%", bottom: "28%", animationDelay: "1.8s" } },
  { char: "✳", position: { left: "23%", top: "11%", animationDelay: "0.9s" } },
];

type Phase = "showing" | "leaving" | "done";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("showing");
  const [count, setCount] = useState(0);
  const [wordState, setWordState] = useState({ index: 0, cycle: 0 });
  const frame = useRef<number | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (wordTimer.current) clearInterval(wordTimer.current);
    setCount(100);
    setPhase("leaving");
    exitTimer.current = setTimeout(() => {
      setPhase("done");
      onDone();
    }, EXIT_MS);
  }, [onDone]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finished.current = true;
      const skip = setTimeout(() => onDone(), 0);
      return () => clearTimeout(skip);
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / INTRO_MS);
      setCount(Math.round((1 - (1 - progress) ** 3) * 100));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else finish();
    };
    frame.current = requestAnimationFrame(tick);

    wordTimer.current = setInterval(() => {
      setWordState((previous) => {
        let next = previous.index;
        while (next === previous.index && INTRO_WORDS.length > 1) {
          next = Math.floor(Math.random() * INTRO_WORDS.length);
        }
        return { index: next, cycle: previous.cycle + 1 };
      });
    }, WORD_CYCLE_MS);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (wordTimer.current) clearInterval(wordTimer.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, onDone]);

  if (phase === "done") return null;

  const active = INTRO_WORDS[wordState.index];

  return (
    <div
      role="presentation"
      data-phase={phase}
      onClick={finish}
      className="intro-overlay fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink px-5 py-5 text-paper md:px-10 md:py-8"
    >
      <div aria-hidden="true" className="editorial-label flex items-start justify-between text-dim">
        <span className="flex items-center gap-2">
          <LogoMark inverse className="h-6 w-6" />
          <span className="font-display text-[13px] tracking-[-0.04em] normal-case text-paper">
            darija<span className="text-flame">.</span> wordle
          </span>
        </span>
        <span className="intro-star text-flame">✳</span>
        <span>001 — Darija Daily</span>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        {GLYPHS.map((glyph, index) => (
          <span
            key={index}
            aria-hidden="true"
            lang={glyph.arabic ? "ar" : undefined}
            className={`intro-glyph absolute text-flame ${glyph.arabic ? "font-arabic text-[22px]" : "font-mono text-[15px]"}`}
            style={glyph.position}
          >
            {glyph.char}
          </span>
        ))}

        <span aria-hidden="true" className="intro-side editorial-label absolute -left-2 text-dim md:left-0">
          05 letters
        </span>
        <span aria-hidden="true" className="intro-side editorial-label absolute -right-2 text-dim md:right-0">
          06 tries
        </span>

        <div key={wordState.cycle} className="intro-word-card relative flex flex-col items-center">
          <p className="editorial-label mb-3 text-dim">A word, at random</p>

          <div aria-hidden="true" className="intro-word relative flex font-display font-extrabold tracking-[-0.08em]">
            <span className="intro-scan pointer-events-none absolute inset-y-0 w-24" />
            {active.latin.split("").map((letter, index) => {
              const offset = SCATTER[index % SCATTER.length];
              return (
                <span
                  key={index}
                  className="intro-letter-mask relative z-[1] inline-block overflow-hidden py-[0.08em]"
                  style={
                    {
                      "--i": index,
                      "--sx": `${offset[0]}px`,
                      "--sy": `${offset[1]}px`,
                    } as CSSProperties
                  }
                >
                  <span className="intro-letter inline-block">{letter}</span>
                </span>
              );
            })}
          </div>

          <p className="intro-arabic mt-2 font-arabic text-[24px] leading-none text-paper" lang="ar" dir="rtl">
            {active.arabic}
          </p>
          <p className="intro-meaning mt-2 font-serif text-[clamp(17px,3vw,24px)] italic text-dim">
            {active.meaning}
          </p>
        </div>

        <p className="intro-caption editorial-label text-dim">
          not today&apos;s answer · just a little Darija
        </p>
      </div>

      <div>
        <div aria-hidden="true" className="intro-progress h-[2px] bg-line-dark">
          <span className="block h-full bg-flame" style={{ width: `${count}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between editorial-label text-dim">
          <span aria-hidden="true">Gathering words</span>
          <span aria-hidden="true" className="font-mono text-paper">
            {String(count).padStart(3, "0")}
          </span>
          <button
            type="button"
            onClick={finish}
            className="border border-line-dark px-2 py-1 text-paper transition-colors hover:border-flame hover:text-flame"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
