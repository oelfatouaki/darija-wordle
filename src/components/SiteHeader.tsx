import { HelpIcon, StatsIcon } from "./icons";
import Logo from "./Logo";

type Props = {
  onHelp: () => void;
  onStats: () => void;
};

export default function SiteHeader({ onHelp, onStats }: Props) {
  return (
    <header className="flex items-center justify-between gap-3 border-b-2 border-ink py-5">
      <Logo />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onStats}
          aria-label="View your statistics"
          title="Statistics"
          className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-surface hover:shadow-[4px_4px_0_var(--color-flame)] sm:h-11 sm:w-11"
        >
          <StatsIcon className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={onHelp}
          aria-label="How to play"
          title="How to play"
          className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-surface text-ink shadow-[2px_2px_0_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-surface hover:shadow-[4px_4px_0_var(--color-flame)] sm:h-11 sm:w-11"
        >
          <HelpIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}
