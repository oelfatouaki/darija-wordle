type Props = { compact?: boolean; inverse?: boolean };

/** A zellij-inspired diamond built from the game's four tile colours. */
export default function Logo({ compact = false, inverse = false }: Props) {
  return (
    <span className="group inline-flex items-center gap-3">
      <svg
        viewBox="0 0 44 44"
        className={[
          "h-10 w-10 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-90",
          inverse ? "" : "shadow-[3px_3px_0_var(--color-ink)]",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        <rect width="44" height="44" fill={inverse ? "var(--color-ink)" : "var(--color-surface)"} />
        <polygon points="22,3 41,22 22,41 3,22" fill="var(--color-ink)" />
        <polygon points="22,6 38,22 22,22" fill="var(--color-flame)" />
        <polygon points="38,22 22,38 22,22" fill="var(--color-correct)" />
        <polygon points="22,38 6,22 22,22" fill="var(--color-present)" />
        <polygon points="6,22 22,6 22,22" fill="var(--color-surface)" />
        <polygon points="22,16 28,22 22,28 16,22" fill="var(--color-ink)" />
        <polygon points="22,19 25,22 22,25 19,22" fill="var(--color-flame)" />
      </svg>

      <span className="leading-none">
        <span className="block">
          <span className={`font-display text-[21px] font-extrabold tracking-[-0.06em] sm:text-[23px] ${inverse ? "text-paper" : ""}`}>
            darija
          </span>
          <span className="font-display text-[21px] font-extrabold tracking-[-0.06em] text-flame sm:text-[23px]">.</span>
          <span className={`font-serif text-[22px] italic tracking-tight sm:text-[25px] ${inverse ? "text-paper" : ""}`}>
            wordle
          </span>
        </span>
        {!compact && (
          <span className={`editorial-label mt-1.5 block ${inverse ? "text-dim" : "text-muted"}`}>
            Moroccan darija · daily
          </span>
        )}
      </span>
    </span>
  );
}
