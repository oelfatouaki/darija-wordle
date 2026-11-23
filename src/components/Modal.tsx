"use client";

import { useEffect, useRef } from "react";
import LogoMark from "./LogoMark";
import { CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, eyebrow = "Guide", children }: Props) {
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
      className="poster-dialog w-[calc(100%-2rem)] max-w-[480px] rounded-none border-2 border-paper bg-ink p-0 text-paper shadow-[10px_10px_0_var(--color-flame)]"
    >
      <div className="modal-in relative max-h-[88vh] overflow-y-auto px-5 py-6 sm:px-7">
        <div aria-hidden="true" className="poster-grid pointer-events-none absolute inset-0 opacity-20" />
        <span aria-hidden="true" className="pointer-events-none absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-flame" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-flame" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <LogoMark className="h-5 w-5" />
              <p className="editorial-label text-flame">Darija Daily / {eyebrow}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-line-dark text-paper transition-colors hover:border-flame hover:text-flame"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <h2
            id={titleId}
            className="mt-4 font-display text-[clamp(28px,6vw,42px)] leading-[0.95] font-extrabold tracking-[-0.05em]"
          >
            {title}<span className="text-flame">.</span>
          </h2>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </dialog>
  );
}
