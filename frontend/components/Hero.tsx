'use client';

import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { Link } from '@/i18n/navigation';

import { CmsText } from '@/components/cms/CmsText';

const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL || '/Video/welding-bg.MP4';
const HERO_VIDEO_POSTER = process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER;
const HERO_VIDEO_WEBM = process.env.NEXT_PUBLIC_HERO_VIDEO_WEBM;

/** Затемнение поверх видео (0–1). Задаётся inline — так стиль не теряется при сборке Tailwind/кэше .next */
const DEFAULT_HERO_OVERLAY_OPACITY = 0.55;

function getHeroOverlayOpacity(): number {
  const raw = process.env.NEXT_PUBLIC_HERO_OVERLAY_OPACITY;
  if (raw === undefined || raw === '') return DEFAULT_HERO_OVERLAY_OPACITY;
  const n = Number.parseFloat(raw);
  if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
  return DEFAULT_HERO_OVERLAY_OPACITY;
}

/** Слабее затемнение на узких экранах, чтобы текст не «тонул» */
function getHeroOverlayOpacityMobile(desktopOpacity: number): number {
  const scaled = desktopOpacity * 0.72;
  const capped = Math.min(scaled, 0.45);
  return Math.max(0, capped);
}

export type HeroText = {
  videoDescription: string;
  titleLine1: string;
  titleLine2: string;
  titleLineHighlight: string;
  titleLine3: string;
  ctaSolutions: string;
  ctaTools: string;
};

type HeroProps = {
  text: HeroText;
};

const CMS_PAGE = 'home';
const CMS_BLOCK = 'hero';

const HERO_CMS_KEYS: Record<keyof HeroText, string> = {
  videoDescription: 'heroVideoDescription',
  titleLine1: 'heroTitleLine1',
  titleLine2: 'heroTitleLine2',
  titleLineHighlight: 'heroTitleLineHighlight',
  titleLine3: 'heroTitleLine3',
  ctaSolutions: 'heroCtaSolutions',
  ctaTools: 'heroCtaTools',
};

function HeroCms({
  field,
  children,
}: {
  field: keyof HeroText;
  children: ReactNode;
}) {
  return (
    <CmsText page={CMS_PAGE} block={CMS_BLOCK} cmsKey={HERO_CMS_KEYS[field]}>
      {children}
    </CmsText>
  );
}

export function Hero({ text }: HeroProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const overlayLg = getHeroOverlayOpacity();
  const overlaySm = getHeroOverlayOpacityMobile(overlayLg);
  const overlayStyle = {
    '--hero-overlay-sm': String(overlaySm),
    '--hero-overlay-lg': String(overlayLg),
  } as CSSProperties;

  const showVideo = Boolean(HERO_VIDEO_URL) && !videoFailed;

  return (
    <section
      id="hero"
      className="scroll-mt-24 relative min-h-[75vh] overflow-hidden sm:min-h-[80vh]"
      aria-labelledby="hero-heading"
    >
      {/* Градиент всегда снизу: видео при успешной загрузке перекрывает; при ошибке — остаётся фон */}
      {/* isolate + z-index: иначе в части браузеров <video> рисуется поверх оверлея */}
      <div className="absolute inset-0 isolate">
        <div className="hero-gradient absolute inset-0 z-0" aria-hidden />
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO_POSTER || undefined}
            className="absolute inset-0 z-[1] h-full w-full object-cover"
            aria-describedby="hero-video-desc"
            onError={() => setVideoFailed(true)}
          >
            {HERO_VIDEO_WEBM && (
              <source src={HERO_VIDEO_WEBM} type="video/webm" />
            )}
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : null}
        <div
          className="hero-media-overlay pointer-events-none absolute inset-0 z-[2] min-h-full min-w-full"
          style={overlayStyle}
          aria-hidden
        />
      </div>

      {/* Контент — крупные заголовки, сварочные акценты */}
      <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[80vh] sm:px-6">
        <p id="hero-video-desc" className="sr-only">
          <HeroCms field="videoDescription">{text.videoDescription}</HeroCms>
        </p>
        <h1
          id="hero-heading"
          className="heading-1 hero-title-line1 mx-auto w-full max-w-4xl text-white drop-shadow-lg leading-tight sm:leading-snug"
        >
          <HeroCms field="titleLine1">{text.titleLine1}</HeroCms>
        </h1>
        <p className="hero-title-line2 mx-auto mt-6 w-full max-w-2xl text-foreground/90 drop-shadow-md leading-tight sm:leading-snug">
          <HeroCms field="titleLine2">{text.titleLine2}</HeroCms>
        </p>
        <p className="mx-auto mt-4 w-full max-w-3xl text-sm font-medium tracking-wide text-white drop-shadow-md sm:text-base leading-tight sm:leading-snug">
          <HeroCms field="titleLineHighlight">
            {text.titleLineHighlight}
          </HeroCms>
        </p>
        <p className="hero-title-line3 hero-title-accent mx-auto mt-3 w-full max-w-3xl font-semibold drop-shadow-md">
          <HeroCms field="titleLine3">{text.titleLine3}</HeroCms>
        </p>
        {/* Декор: линии и точка — нативный CSS, без SVG */}
        <div className="mt-8 flex items-center gap-4" aria-hidden>
          <span className="h-px w-12 bg-accent-orange-soft" />
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <span className="h-px w-12 bg-accent-orange-soft" />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link href="/solutions" className="btn-primary btn-lg">
            <HeroCms field="ctaSolutions">{text.ctaSolutions}</HeroCms>
          </Link>
          <Link href="/tools" className="btn-secondary btn-lg">
            <HeroCms field="ctaTools">{text.ctaTools}</HeroCms>
          </Link>
        </div>
      </div>
    </section>
  );
}
