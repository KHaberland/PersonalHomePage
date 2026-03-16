'use client';

import { useTranslations } from 'next-intl';

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
const HERO_VIDEO_POSTER = process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER;
const HERO_VIDEO_WEBM = process.env.NEXT_PUBLIC_HERO_VIDEO_WEBM;

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[75vh] overflow-hidden sm:min-h-[80vh]">
      {/* Видео или градиентный фон */}
      <div className="absolute inset-0">
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_VIDEO_POSTER || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            {HERO_VIDEO_WEBM && (
              <source src={HERO_VIDEO_WEBM} type="video/webm" />
            )}
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-gradient absolute inset-0" />
        )}
        {/* Overlay для читаемости — сварочные оттенки */}
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Контент — крупные заголовки, сварочные акценты */}
      <div className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[80vh] sm:px-6">
        <h1 className="heading-1 max-w-4xl text-white drop-shadow-lg">
          {t('heroTitle')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/90 drop-shadow-md sm:text-xl">
          {t('heroSubtitle')}
        </p>
        <p className="mt-3 text-xl font-semibold text-accent-orange drop-shadow-md sm:text-2xl">
          {t('subtitle')}
        </p>
        {/* Декоративная линия — индустриальный акцент */}
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-12 bg-accent-orange" />
          <span className="h-2 w-2 rounded-full bg-accent-blue" />
          <span className="h-px w-12 bg-accent-orange" />
        </div>
      </div>
    </section>
  );
}
