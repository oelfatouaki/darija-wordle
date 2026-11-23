import { KEYBOARD_ROWS } from "@/lib/game";
import type { LetterState } from "@/lib/types";
import { BackspaceIcon } from "./icons";

type Props = {
  keyStates: Record<string, LetterState>;
  onKey: (key: string) => void;
  disabled: boolean;
  compact?: boolean;
};

const keyClasses: Record<LetterState | "default", string> = {
  default: "border-line bg-surface text-ink shadow-[0_3px_0_var(--color-line)] hover:bg-paper",
  correct: "border-correct bg-correct text-surface shadow-[0_3px_0_#084e3e]",
  present: "border-present bg-present text-ink shadow-[0_3px_0_#bd8e03]",
  absent: "border-absent bg-absent text-surface shadow-[0_3px_0_#57534c]",
};

export default function Keyboard({ keyStates, onKey, disabled, compact = false }: Props) {
  return (
    <div
      className={`mx-auto w-full ${compact ? "max-w-[min(100%,42vh)] space-y-1" : "max-w-[500px] space-y-2 sm:space-y-2.5"}`}
    >
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex ${compact ? "gap-1" : "gap-1.5 sm:gap-2"}`}>
          {row.map((key) => {
            const special = key === "enter" || key === "backspace";
            const visual = keyStates[key] ?? "default";
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onKey(key)}
                aria-label={key === "backspace" ? "Delete last character" : undefined}
                className={[
                  "flex min-w-0 flex-1 items-center justify-center rounded-[4px] border-2 font-display font-bold uppercase transition-[transform,box-shadow,background-color] duration-100 hover:-translate-y-[2px] active:translate-y-[3px] active:shadow-none disabled:cursor-default",
                  compact
                    ? "h-[clamp(34px,5.2vh,48px)] text-[10px] sm:text-[11px]"
                    : "h-[50px] text-[13px] sm:h-[54px] sm:text-[14px]",
                  special ? "flex-[1.55] font-sans tracking-[0.12em]" : "",
                  keyClasses[visual],
                ].join(" ")}
              >
                {key === "backspace" ? (
                  <BackspaceIcon className={compact ? "h-4 w-4" : "h-5 w-5"} />
                ) : key === "enter" ? (
                  "Enter"
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
