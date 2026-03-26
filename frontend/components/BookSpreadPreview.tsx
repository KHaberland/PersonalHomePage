type Props = {
  title: string;
  caption: string;
};

/** Декоративный разворот книги (без реальных сканов страниц) — ощущение объёма и содержания */
export function BookSpreadPreview({ title, caption }: Props) {
  return (
    <figure className="w-full">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent-orange">
        {title}
      </p>
      <div
        className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border border-border bg-[#1a1614] p-4 shadow-lg"
        aria-hidden
      >
        <div className="flex min-h-[11rem] gap-0 shadow-inner sm:min-h-[13rem]">
          <div className="flex flex-1 flex-col rounded-l-md bg-[#ebe4d8] p-3 text-[#2c2419] shadow-[inset_-2px_0_0_rgba(0,0,0,0.06)]">
            <div className="mb-2 h-1.5 w-1/3 rounded bg-[#c4b8a8]" />
            <div className="space-y-1.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded bg-[#c4b8a8]/70"
                  style={{ width: `${68 + (i % 4) * 6}%` }}
                />
              ))}
            </div>
          </div>
          <div className="w-px shrink-0 bg-[#8b7355]/40" />
          <div className="flex flex-1 flex-col rounded-r-md bg-[#f2ebe0] p-3 text-[#2c2419] shadow-[inset_2px_0_0_rgba(0,0,0,0.04)]">
            <div className="mb-2 h-1.5 w-2/5 rounded bg-[#c4b8a8]" />
            <div className="space-y-1.5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-1 rounded bg-[#c4b8a8]/65"
                  style={{ width: `${62 + (i % 5) * 5}%` }}
                />
              ))}
            </div>
            <div className="mt-auto flex gap-1 pt-3">
              <div className="h-8 flex-1 rounded bg-[#d4cbb8]/80" />
              <div className="h-8 flex-1 rounded bg-[#d4cbb8]/80" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-foreground/70">
        {caption}
      </figcaption>
    </figure>
  );
}
