"use client";

import { useRef, type MouseEvent } from "react";

type Line = { text: string; italic?: boolean };

type Props = {
  lines: Line[];
  className?: string;
};

/** A letter-by-letter ripple that follows the cursor across the masthead copy. */
export default function MagneticCopy({ lines, className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  const reset = () => {
    ref.current?.querySelectorAll<HTMLElement>("[data-ripple]").forEach((letter) => {
      letter.style.removeProperty("--lift");
      letter.style.removeProperty("--spin");
      letter.style.removeProperty("color");
    });
  };

  const onMove = (event: MouseEvent<HTMLParagraphElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    ref.current?.querySelectorAll<HTMLElement>("[data-ripple]").forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);
      const radius = 120;
      const power = distance < radius ? (1 - distance / radius) ** 1.5 : 0;
      letter.style.setProperty("--lift", `${(-power * 11).toFixed(1)}px`);
      letter.style.setProperty("--spin", `${(power * (dx >= 0 ? 5 : -5)).toFixed(1)}deg`);
      letter.style.color = power > 0.42 ? "var(--color-flame)" : "";
    });
  };

  return (
    <p
      ref={ref}
      data-cursor="RIPPLE"
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
    >
      <span className="sr-only">{lines.map((line) => line.text).join(" ")}</span>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={`poster-copy-line ${line.italic ? "italic text-flame" : ""}`}>
          {line.text.split("").map((letter, letterIndex) => (
            <span key={letterIndex} data-ripple aria-hidden="true" className="ripple-letter">
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
