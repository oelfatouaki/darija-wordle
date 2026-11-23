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
    <Modal open={open} onClose={onClose} title="Your statistics">
      <div className="grid grid-cols-4 gap-2">
        {cells.map((cell) => (
          <div key={cell.label} className="border-2 border-ink bg-paper px-2 py-3 text-center">
            <p className="font-display text-[25px] leading-none font-extrabold tracking-tight">{cell.value}</p>
            <p className="editorial-label mt-2 tracking-[0.08em] text-muted">{cell.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <p className="editorial-label text-muted">Guess distribution</p>
        <div className="mt-3 space-y-1.5">
          {stats.distribution.map((count, index) => {
            const isToday = status === "won" && currentGuessCount === index + 1;
            return (
              <div key={index} className="flex items-center gap-2 text-[12px] font-semibold">
                <span className="w-3 text-right font-mono text-muted">{index + 1}</span>
                <div className="h-5 flex-1 bg-paper">
                  <div
                    className={`flex h-full min-w-[20px] items-center justify-end px-1.5 font-mono text-[11px] text-surface transition-[width] duration-500 ${
                      isToday ? "bg-flame text-ink" : "bg-ink"
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

      <div className="mt-7 flex items-center justify-between border-t-2 border-ink pt-4">
        <span className="editorial-label text-muted">Next word in</span>
        <span className="font-mono text-[15px] font-medium tabular-nums">{countdown}</span>
      </div>
    </Modal>
  );
}
