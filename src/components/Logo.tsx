import LogoMark from "./LogoMark";

type Props = { compact?: boolean; inverse?: boolean };

/** A zellij-inspired diamond built from the game's four tile colours. */
export default function Logo({ compact = false, inverse = false }: Props) {
  return (
    <span className="group inline-flex items-center gap-2 md:gap-3">
      <LogoMark
        inverse={inverse}
        className={[
          "h-8 w-8 shrink-0 transition-transform duration-500 ease-out group-hover:rotate-90 md:h-10 md:w-10",
          inverse ? "" : "shadow-[3px_3px_0_var(--color-ink)]",
        ]
          .filter(Boolean)
          .join(" ")}
      />

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
