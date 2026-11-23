type Props = {
  className?: string;
  inverse?: boolean;
};

/** The zellij-inspired mark shared by the header, intro, and app icon. */
export default function LogoMark({ className = "h-10 w-10", inverse = false }: Props) {
  return (
    <svg viewBox="0 0 44 44" className={className} aria-hidden="true" focusable="false">
      <rect width="44" height="44" fill={inverse ? "var(--color-ink)" : "var(--color-surface)"} />
      <polygon points="22,3 41,22 22,41 3,22" fill="var(--color-ink)" />
      <polygon points="22,6 38,22 22,22" fill="var(--color-flame)" />
      <polygon points="38,22 22,38 22,22" fill="var(--color-correct)" />
      <polygon points="22,38 6,22 22,22" fill="var(--color-present)" />
      <polygon points="6,22 22,6 22,22" fill="var(--color-surface)" />
      <polygon points="22,16 28,22 22,28 16,22" fill="var(--color-ink)" />
      <polygon points="22,19 25,22 22,25 19,22" fill="var(--color-flame)" />
    </svg>
  );
}
