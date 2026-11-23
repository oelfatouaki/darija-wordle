import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t-2 border-ink pt-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <p className="editorial-label text-muted">
          Words &amp; meanings from{" "}
          <a
            className="font-medium text-ink underline decoration-flame decoration-2 underline-offset-[3px] hover:text-accent"
            href="https://darija.io"
            target="_blank"
            rel="noreferrer"
          >
            darija.io
          </a>
        </p>
        <a
          className="editorial-label text-muted underline decoration-line underline-offset-[3px] hover:text-accent"
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY-NC-ND 4.0
        </a>
      </div>

      <div aria-hidden="true" className="mt-3 overflow-hidden text-center">
        <p className="outline-wordmark font-display text-[clamp(34px,10.5vw,86px)] font-extrabold leading-[0.9] tracking-[-0.07em] whitespace-nowrap">
          darija.wordle
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line pt-3">
        <span className="editorial-label text-muted">A little Darija, every day.</span>
        <Link href="/" className="editorial-label text-muted underline decoration-flame decoration-2 underline-offset-2 hover:text-accent">
          Official edition ↗
        </Link>
        <span className="font-mono text-[10px] tracking-[0.1em] text-ink">
          Developped by{" "}
          <a
            href="https://github.com/oelfatouaki"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline decoration-line underline-offset-2 hover:text-ink"
          >
            Oussama EL Fatouaki
          </a>
        </span>
      </div>
    </footer>
  );
}
