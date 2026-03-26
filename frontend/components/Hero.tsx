'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

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

export function Hero() {
  const t = useTranslations('home');
  const overlayOpacity = getHeroOverlayOpacity();

  return (
    <section className="relative min-h-[75vh] overflow-hidden sm:min-h-[80vh]">
      {/* Видео или градиентный фон */}
      {/* isolate + z-index: иначе в части браузеров <video> рисуется поверх оверлея и затемнение не видно */}
      <div className="absolute inset-0 isolate">
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO_POSTER || undefined}
            className="absolute inset-0 z-0 h-full w-full object-cover"
          >
            {HERO_VIDEO_WEBM && (
              <source src={HERO_VIDEO_WEBM} type="video/webm" />
            )}
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-gradient absolute inset-0 z-0" />
        )}
        <div
          className="pointer-events-none absolute inset-0 z-[1] min-h-full min-w-full"
          style={{
            backgroundColor: `rgba(10, 12, 15, ${overlayOpacity})`,
          }}
          aria-hidden
        />
      </div>

      {/* Контент — крупные заголовки, сварочные акценты */}
      <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[80vh] sm:px-6">
        <h1 className="heading-1 hero-title-line1 max-w-4xl text-white drop-shadow-lg">
          {t('heroTitleLine1')}
        </h1>
        <p className="hero-title-line2 mt-6 max-w-2xl text-foreground/90 drop-shadow-md">
          {t('heroTitleLine2')}
        </p>
        <p className="hero-title-line3 mt-3 font-semibold text-accent-orange drop-shadow-md">
          {t('heroTitleLine3')}
        </p>
        {/* Декоративная линия — индустриальный акцент */}
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-12 bg-accent-orange" />
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <span className="h-px w-12 bg-accent-orange" />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/contact"
            className="btn-primary inline-block min-w-[12rem] px-8 py-3 text-center"
          >
            {t('heroCtaContact')}
          </Link>
          <Link
            href="/tools"
            className="btn-secondary inline-block min-w-[12rem] px-8 py-3 text-center"
          >
            {t('heroCtaTools')}
          </Link>
        </div>
        <Link
          href="/#competencies"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline"
        >
          {t('heroScrollToCompetencies')}
        </Link>
      </div>
    </section>
  );
}
