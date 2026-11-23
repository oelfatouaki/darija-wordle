import Modal from "./Modal";
import Tile from "./Tile";

type Props = { open: boolean; onClose: () => void };

export default function HelpModal({ open, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="How to play" eyebrow="Guide">
      <div className="space-y-5 text-[13px] leading-relaxed text-paper/90">
        <p>
          Guess the <strong className="font-bold text-flame">five-character</strong> Darija word in six tries. Every
          guess uses letters a–z, <strong className="text-flame">3</strong> or{" "}
          <strong className="text-flame">7</strong>. Press Enter to submit.
        </p>

        <div className="border border-line-dark bg-paper/5 p-4 shadow-[4px_4px_0_var(--color-line-dark)]">
          <p className="editorial-label mb-3 text-dim">Colour guide</p>
          <div className="flex gap-2">
            <div className="w-10"><Tile letter="a" state="correct" /></div>
            <div className="w-10"><Tile letter="r" state="present" /></div>
            <div className="w-10"><Tile letter="t" state="absent" /></div>
          </div>
          <ul className="mt-4 space-y-1.5">
            <li><span className="font-bold text-[#79d6b4]">Green</span> — right letter, right place.</li>
            <li><span className="font-bold text-present">Amber</span> — right letter, wrong place.</li>
            <li><span className="font-bold text-dim">Grey</span> — that letter isn’t in the word.</li>
          </ul>
        </div>

        <div>
          <p className="font-display text-[17px] font-bold tracking-tight text-paper">Numbers in Darija</p>
          <p className="mt-1">
            Darija is often typed with numbers: <span className="font-arabic text-base" lang="ar">ع</span> becomes{" "}
            <strong className="text-flame">3</strong>, and{" "}
            <span className="font-arabic text-base" lang="ar">ح</span> becomes{" "}
            <strong className="text-flame">7</strong>. They count as characters, just like letters — try{" "}
            <code className="bg-line-dark px-1.5 py-0.5 font-mono text-[12px] text-paper">3afak</code> (please) or{" "}
            <code className="bg-line-dark px-1.5 py-0.5 font-mono text-[12px] text-paper">sh7al</code> (how much).
          </p>
        </div>

        <p className="border-t border-line-dark pt-4 text-[12px] text-dim">
          Repeated letters are scored one at a time. A fresh word lands every day at midnight, Morocco time.
        </p>
      </div>
    </Modal>
  );
}
