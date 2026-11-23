import type { CSSProperties } from "react";
import type { LetterState } from "@/lib/types";

type TileVisualState = LetterState | "empty" | "filled";

type Props = {
  letter?: string;
  state?: TileVisualState;
  tileIndex?: number;
  revealing?: boolean;
  shaking?: boolean;
  compact?: boolean;
};

const stateClasses: Record<TileVisualState, string> = {
  empty: "border-line bg-surface",
  filled: "border-ink bg-surface text-ink",
  correct: "border-correct bg-correct text-surface",
  present: "border-present bg-present text-ink",
  absent: "border-absent bg-absent text-surface",
};

export default function Tile({
  letter,
  state = "empty",
  tileIndex = 0,
  revealing = false,
  shaking = false,
  compact = false,
}: Props) {
  const className = [
    "flex aspect-square w-full select-none items-center justify-center rounded-[3px] border-2 font-display font-extrabold uppercase leading-none shadow-[inset_0_-3px_0_rgba(21,20,18,0.05)]",
    compact ? "text-[clamp(16px,3.2vh,23px)]" : "text-[clamp(21px,7vw,30px)]",
    stateClasses[state],
    revealing ? "tile-flip" : "",
    shaking ? "tile-shake" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} style={{ "--tile-index": tileIndex } as CSSProperties}>
      {letter}
    </div>
  );
}
