"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `modal-title-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby={titleId}
      className="w-[calc(100%-2rem)] max-w-[440px] rounded-none border-2 border-ink bg-surface p-0 text-ink shadow-[9px_9px_0_var(--color-ink)]"
    >
      <div className="modal-in max-h-[85vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="editorial-label mb-2 text-flame">Darija wordle / daily</p>
            <h2 id={titleId} className="font-display text-[28px] leading-[1.05] font-extrabold tracking-[-0.04em]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-surface"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
