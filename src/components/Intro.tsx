"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const INTRO_MS = 3200;
const EXIT_MS = 900;
const WORD = "darija.".split("");
const SCRAMBLE_CHARS = "darija37✳";
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
  const [word, setWord] = useState("darija.");
  const frame = useRef<number | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (scrambleTimer.current) clearInterval(scrambleTimer.current);
    setWord("darija.");
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

    let ticks = 0;
    scrambleTimer.current = setInterval(() => {
      ticks += 1;
      if (ticks > 18) {
        if (scrambleTimer.current) clearInterval(scrambleTimer.current);
        setWord("darija.");
        return;
      }
      setWord(
        WORD.map((letter) =>
          letter === "." ? "." : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join("")
      );
    }, 65);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (scrambleTimer.current) clearInterval(scrambleTimer.current);
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
      className="intro-overlay fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink px-5 py-5 text-paper md:px-10 md:py-8"
    >
      <div aria-hidden="true" className="editorial-label flex items-start justify-between text-dim">
        <span className="font-display text-[13px] tracking-[-0.04em] normal-case text-paper">
          darija<span className="text-flame">.</span> wordle
        </span>
        <span className="intro-star text-flame">✳</span>
        <span>001 — Morocco</span>
      </div>

      <div className="relative flex flex-col items-center gap-5">
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

        <div aria-hidden="true" className="intro-word relative flex font-display font-extrabold tracking-[-0.08em]">
          <span className="intro-scan pointer-events-none absolute inset-y-0 w-24" />
          {word.split("").map((letter, index) => (
            <span
              key={index}
              className="intro-letter-mask relative z-[1] inline-block overflow-hidden py-[0.08em]"
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
          darija wordle · five letters · six tries · one word a day
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
