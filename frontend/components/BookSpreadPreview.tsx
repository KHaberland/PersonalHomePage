'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type PreviewImage = {
  src: string;
  alt: string;
};

type Props = {
  title: ReactNode;
  caption: ReactNode;
  images?: PreviewImage[];
};

function DecorativeSpread() {
  return (
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
  );
}

function ImageCarousel({ images }: { images: PreviewImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = images.length;
  const current = images[index];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + count) % count);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % count);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    dialogRef.current?.close();
    setLightboxOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (!lightboxOpen) return;
    const dlg = dialogRef.current;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  }, [lightboxOpen]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => setLightboxOpen(false);
    dlg.addEventListener('close', onClose);
    return () => dlg.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-lg border border-border bg-[#1a1614] shadow-lg">
        <button
          type="button"
          onClick={openLightbox}
          className="relative aspect-[3/2] w-full cursor-zoom-in"
          aria-label={`Enlarge: ${current.alt}`}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            className="object-contain p-2"
            sizes="(max-width: 1024px) 100vw, 42rem"
            unoptimized={current.src.startsWith('http')}
          />
        </button>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-sm text-foreground shadow-sm transition hover:border-accent-orange hover:text-accent-orange"
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-sm text-foreground shadow-sm transition hover:border-accent-orange hover:text-accent-orange"
              aria-label="Next page"
            >
              ›
            </button>
            <div
              className="flex justify-center gap-1.5 border-t border-border px-3 py-2"
              role="tablist"
              aria-label="Book pages"
            >
              {images.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Page ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full transition ${
                    i === index
                      ? 'bg-accent-orange'
                      : 'bg-foreground/25 hover:bg-foreground/45'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        className="diploma-dialog"
        aria-label={current.alt}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            closeLightbox();
          }
        }}
      >
        {lightboxOpen ? (
          <div className="flex max-h-[90vh] flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <p className="text-sm text-foreground/80">{current.alt}</p>
              <button
                type="button"
                className="btn-secondary btn-sm shrink-0"
                onClick={closeLightbox}
              >
                ×
              </button>
            </div>
            <div className="relative min-h-[50vh] flex-1 bg-[#1a1614] p-4">
              <div className="relative mx-auto h-full min-h-[50vh] w-full max-w-4xl">
                <Image
                  key={`lightbox-${current.src}`}
                  src={current.src}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  sizes="96vw"
                  unoptimized={current.src.startsWith('http')}
                />
              </div>
              {count > 1 ? (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-lg text-foreground shadow-sm transition hover:border-accent-orange hover:text-accent-orange"
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/90 text-lg text-foreground shadow-sm transition hover:border-accent-orange hover:text-accent-orange"
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/** Иллюстративный разворот книги: карусель из admin или CSS-заглушка */
export function BookSpreadPreview({ title, caption, images }: Props) {
  const hasImages = Boolean(images?.length);

  return (
    <figure className="w-full">
      <p className="eyebrow mb-3">{title}</p>
      {hasImages ? <ImageCarousel images={images!} /> : <DecorativeSpread />}
      <figcaption className="caption mt-3">{caption}</figcaption>
    </figure>
  );
}
