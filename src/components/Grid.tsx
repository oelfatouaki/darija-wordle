import { MAX_GUESSES, WORD_LENGTH, scoreGuess } from "@/lib/game";
import Tile from "./Tile";

type Props = {
  guesses: string[];
  answer: string;
  draft: string;
  revealingRow: number | null;
  shaking: boolean;
  compact?: boolean;
};

export default function Grid({ guesses, answer, draft, revealingRow, shaking, compact = false }: Props) {
  return (
    <div>
      <div className={`flex items-center justify-between border-b-2 border-ink pb-2 editorial-label ${compact ? "mb-2 md:mb-3" : "mb-3"}`}>
        <span>Guess log</span>
        <span className={compact ? "text-ink" : "text-muted"}>
          {String(guesses.length).padStart(2, "0")} / 06 · 05 letters
        </span>
      </div>

      <div
        aria-label="Six-row guess grid"
        className={`mx-auto grid w-full gap-[3px] sm:gap-[4px] ${compact ? "poster-grid-rows max-w-[min(100%,50vh)]" : "max-w-[390px] sm:gap-2"}`}
      >
        {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
          const guess = guesses[rowIndex];
          const states = guess ? scoreGuess(guess, answer) : null;
          const isDraftRow = !guess && rowIndex === guesses.length;
          const isActive = isDraftRow && revealingRow === null;

          return (
            <div
              key={rowIndex}
              className={`grid items-center ${compact ? "grid-cols-[14px_1fr] gap-1.5" : "grid-cols-[18px_1fr] gap-2 sm:gap-3"}`}
            >
              <span
                className={`editorial-label text-right ${
                  compact ? (isActive ? "font-medium text-ink" : "text-ink") : isActive ? "text-accent" : "text-muted"
                }`}
              >
                {String(rowIndex + 1).padStart(2, "0")}
              </span>
              <div className={`grid grid-cols-5 ${compact ? "gap-[4px]" : "gap-[6px] sm:gap-2"}`}>
                {Array.from({ length: WORD_LENGTH }, (_, column) => {
                  const letter = guess?.[column] ?? (isDraftRow ? draft[column] ?? "" : "");
                  const state = guess && states ? states[column] : isDraftRow && draft[column] ? "filled" : "empty";

                  return (
                    <Tile
                      key={column}
                      letter={letter}
                      state={state}
                      tileIndex={column}
                      revealing={revealingRow === rowIndex}
                      shaking={shaking && rowIndex === guesses.length}
                      compact={compact}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
