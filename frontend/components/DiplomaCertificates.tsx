'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export type DiplomaCertificateItem = {
  id: string;
  pdfUrl: string;
  fileName: string;
  title: string;
  summary: string;
  previewAlt: string;
  /** Необязательное превью (например `/diplomas/previews/bachelor.webp`). При ошибке загрузки — плейсхолдер. */
  previewSrc?: string | null;
};

export type DiplomaCertificateLabels = {
  openInModal: string;
  download: string;
  openNewTab: string;
  closeModal: string;
  pdfViewerTitle: string;
};

type Props = {
  items: DiplomaCertificateItem[];
  labels: DiplomaCertificateLabels;
};

function PreviewPlaceholder() {
  return (
    <div
      className="flex h-full min-h-[7.5rem] flex-col items-center justify-center gap-2 bg-[linear-gradient(145deg,var(--surface-elevated)_0%,#121820_50%,var(--surface)_100%)] px-3 py-4 text-center"
      aria-hidden
    >
      <svg
        className="h-10 w-10 shrink-0 text-accent-orange/90"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 12h8v2H8v-2zm0 4h8v2H8v-2zm0-8h3v2H8V8z" />
      </svg>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-foreground/45">
        PDF
      </span>
    </div>
  );
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <PreviewPlaceholder />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover object-top"
      sizes="(max-width: 640px) 100vw, 25vw"
      loading="lazy"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

function CertificatePreview({
  previewSrc,
  alt,
}: {
  previewSrc?: string | null;
  alt: string;
}) {
  if (!previewSrc) {
    return <PreviewPlaceholder />;
  }
  return (
    <div className="relative h-full min-h-[7.5rem] w-full">
      <PreviewImage key={previewSrc} src={previewSrc} alt={alt} />
    </div>
  );
}

export function DiplomaCertificates({ items, labels }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [active, setActive] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    setActive(null);
  }, []);

  const openModal = useCallback((url: string, title: string) => {
    setActive({ url, title });
  }, []);

  useLayoutEffect(() => {
    if (!active) return;
    const dlg = dialogRef.current;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  }, [active]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => setActive(null);
    dlg.addEventListener('close', onClose);
    return () => dlg.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="card flex flex-col overflow-hidden p-0 transition-[border-color,box-shadow]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
              <CertificatePreview
                previewSrc={item.previewSrc}
                alt={item.previewAlt}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-sm font-semibold leading-snug text-foreground">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-foreground/70">
                {item.summary}
              </p>
              <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
                <button
                  type="button"
                  className="btn-primary flex-1 px-3 py-2 text-center text-xs sm:text-sm"
                  onClick={() => openModal(item.pdfUrl, item.title)}
                >
                  {labels.openInModal}
                </button>
                <a
                  href={item.pdfUrl}
                  download={item.fileName}
                  className="btn-secondary inline-flex flex-1 items-center justify-center px-3 py-2 text-center text-xs sm:text-sm"
                >
                  {labels.download}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="diploma-dialog"
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            closeModal();
          }
        }}
      >
        {active ? (
          <div className="flex max-h-[90vh] flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
              <h2 id={titleId} className="heading-3 pr-2 text-foreground">
                {active.title}
              </h2>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-3 py-1.5 text-xs"
                >
                  {labels.openNewTab}
                </a>
                <button
                  type="button"
                  className="btn-primary px-3 py-1.5 text-xs"
                  onClick={closeModal}
                >
                  {labels.closeModal}
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 bg-[var(--background)]">
              <iframe
                src={`${active.url}#view=FitH`}
                title={labels.pdfViewerTitle}
                className="h-[min(78vh,720px)] w-full border-0"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
