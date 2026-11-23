"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  onNudge: () => void;
  text?: string;
  lines?: string[];
  meaning?: string;
  variant?: "wordmark" | "phrase";
};

const DEFAULT_TEXT = "darija.";

export default function Wordmark({
  onNudge,
  text = DEFAULT_TEXT,
  lines,
  meaning,
  variant = "wordmark",
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineList = useMemo(() => lines ?? [text], [lines, text]);
  const letterCount = useMemo(
    () => lineList.join("").replace(/\s/g, "").length,
    [lineList],
  );

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const letters = Array.from(button.querySelectorAll<HTMLElement>("[data-letter]"));
    let frame = 0;

    const onMove = (event: MouseEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - event.clientX;
          const dy = rect.top + rect.height / 2 - event.clientY;
          const distance = Math.hypot(dx, dy) || 1;
          const radius = 150;
          const push = distance < radius ? ((radius - distance) / radius) ** 1.4 * 42 : 0;
          letter.style.transform = `translate3d(${(dx / distance) * push}px, ${(dy / distance) * push}px, 0)`;
          letter.style.color = push > 10 ? "var(--color-flame)" : "";
        });
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      letters.forEach((letter) => {
        letter.style.transform = "";
        letter.style.removeProperty("color");
      });
    };

    button.addEventListener("mousemove", onMove);
    button.addEventListener("mouseleave", onLeave);
    return () => {
      button.removeEventListener("mousemove", onMove);
      button.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const scatter = () => {
    buttonRef.current?.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter, index) => {
      const angle = (index / Math.max(letterCount, 1)) * Math.PI * 2;
      const distance = 18 + (index % 3) * 9;
      letter.style.transitionDuration = "160ms";
      letter.style.transform = `translate3d(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px, 0) rotate(${index % 2 ? 8 : -8}deg)`;
    });
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      buttonRef.current?.querySelectorAll<HTMLElement>("[data-letter]").forEach((letter) => {
        letter.style.transitionDuration = "";
        letter.style.transform = "";
        letter.style.removeProperty("color");
      });
    }, 420);
    onNudge();
  };

  const isPhrase = variant === "phrase";
  const headingClass = isPhrase
    ? "mt-2 font-display text-[clamp(30px,3.4vw,44px)] leading-[0.94] font-extrabold tracking-[-0.045em] md:mt-3"
    : "mt-2 font-display text-[clamp(40px,7.6vw,92px)] leading-[0.9] font-extrabold tracking-[-0.07em] md:mt-3";

  return (
    <h1 className={headingClass}>
      <button
        ref={buttonRef}
        type="button"
        data-cursor="NUDGE"
        title={meaning ? `${meaning} — click for a nudge` : "A little nudge"}
        aria-label={lineList.join(" ")}
        onClick={scatter}
        className={`poster-word flex font-display font-extrabold tracking-[-0.07em] ${
          isPhrase ? "flex-col items-start" : "whitespace-nowrap"
        }`}
      >
        {lineList.map((line, lineIndex) => (
          <span key={lineIndex} className={isPhrase ? "flex flex-nowrap gap-x-[0.22em]" : "contents"}>
            {line.split("").map((letter, letterIndex) => {
              if (letter === " ") {
                return <span key={`space-${letterIndex}`} aria-hidden="true" className="inline-block w-[0.22em]" />;
              }
              const accent = letter === "." || letter === "3" || letter === "7";
              return (
                <span key={`${lineIndex}-${letterIndex}`} className="word-letter-mask inline-block overflow-hidden py-[0.06em]">
                  <span
                    data-letter
                    aria-hidden="true"
                    style={{ animationDelay: `${(lineIndex * 8 + letterIndex) * 55}ms` }}
                    className="word-letter inline-block will-change-transform"
                  >
                    {accent ? <span className="text-flame">{letter}</span> : letter}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </button>
    </h1>
  );
}
