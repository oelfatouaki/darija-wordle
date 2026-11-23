export const TICKER_ITEMS = [
  "Coming soon · Darija Daily",
  "5 letters · 6 tries · 1 word a day",
  "3 = ع · 7 = ح",
  "Enter to submit · Backspace to edit",
  "Words from darija.io",
  "New word at midnight, Morocco time",
];

export default function Ticker() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-b-2 border-ink bg-ink py-2 text-surface">
      <div className="marquee-track editorial-label">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center whitespace-nowrap">
            {TICKER_ITEMS.map((item, index) => (
              <span key={item} className={`flex items-center ${index === 0 ? "text-flame" : ""}`}>
                <span className="mx-3 text-flame">✳</span>
                {item}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
