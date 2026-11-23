"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const INTRO_MS = 1900;
const EXIT_MS = 780;
const WORD = "darija.".split("");
const SCATTER: Array<[number, number]> = [
  [-150, -90],
  [90, -140],
  [-70, 110],
  [160, 50],
  [-140, 30],
  [80, 130],
  [20, -150],
];

type Phase = "showing" | "leaving" | "done";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("showing");
  const [count, setCount] = useState(0);
  const frame = useRef<number | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setCount(100);
    setPhase("leaving");
    document.cookie = "darija_intro=1; path=/; max-age=31536000; SameSite=Lax";
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

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish, onDone]);

  if (phase === "done") return null;

  return (
    <div
      role="presentation"
      data-phase={phase}
      onClick={finish}
      className="intro-overlay fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-5 py-5 text-paper md:px-10 md:py-8"
    >
      <div aria-hidden="true" className="editorial-label flex items-start justify-between text-dim">
        <span>Darija / A daily ritual</span>
        <span className="intro-star text-flame">✳</span>
        <span>001 — Morocco</span>
      </div>

      <div aria-hidden="true" className="flex flex-col items-center gap-4">
        <div className="intro-word flex font-display font-extrabold tracking-[-0.08em]">
          {WORD.map((letter, index) => (
            <span
              key={index}
              className="intro-letter-mask inline-block overflow-hidden py-[0.08em]"
              style={
                {
                  "--i": index,
                  "--sx": `${SCATTER[index][0]}px`,
                  "--sy": `${SCATTER[index][1]}px`,
                } as CSSProperties
              }
            >
              <span className="intro-letter inline-block">{letter}</span>
            </span>
          ))}
        </div>
        <p className="intro-caption editorial-label text-dim">
          Five letters · Six tries · One word a day
        </p>
      </div>

      <div>
        <div aria-hidden="true" className="intro-progress h-[2px] bg-line-dark">
          <span className="block h-full bg-flame" style={{ width: `${count}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between editorial-label text-dim">
          <span aria-hidden="true">Composing today&apos;s word</span>
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
