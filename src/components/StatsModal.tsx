import type { GameStatus, Stats } from "@/lib/types";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  stats: Stats;
  countdown: string;
  currentGuessCount: number;
  status: GameStatus;
};

export default function StatsModal({ open, onClose, stats, countdown, currentGuessCount, status }: Props) {
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxCount = Math.max(1, ...stats.distribution);

  const cells = [
    { label: "Played", value: stats.played },
    { label: "Win %", value: winRate },
    { label: "Streak", value: stats.currentStreak },
    { label: "Best", value: stats.maxStreak },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Your statistics" eyebrow="Stats">
      <div className="grid grid-cols-4 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="border border-line-dark bg-paper/5 px-2 py-3 text-center shadow-[3px_3px_0_var(--color-line-dark)]"
          >
            <p className="font-display text-[25px] leading-none font-extrabold tracking-tight text-paper">{cell.value}</p>
            <p className="editorial-label mt-2 tracking-[0.08em] text-dim">{cell.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="editorial-label text-dim">Guess distribution</p>
        <div className="mt-3 space-y-1.5">
          {stats.distribution.map((count, index) => {
            const isToday = status === "won" && currentGuessCount === index + 1;
            return (
              <div key={index} className="flex items-center gap-2 text-[12px] font-semibold text-paper">
                <span className="w-3 text-right font-mono text-dim">{index + 1}</span>
                <div className="h-5 flex-1 bg-line-dark/60">
                  <div
                    className={`flex h-full min-w-[20px] items-center justify-end px-1.5 font-mono text-[11px] transition-[width] duration-500 ${
                      isToday ? "bg-flame text-ink" : "bg-paper text-ink"
                    }`}
                    style={{ width: `${count ? Math.max(12, (count / maxCount) * 100) : 0}%` }}
                  >
                    {count || ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between border-t border-line-dark pt-4">
        <span className="editorial-label text-dim">Next word in</span>
        <span className="font-mono text-[15px] font-medium tabular-nums text-paper">{countdown}</span>
      </div>
    </Modal>
  );
}
