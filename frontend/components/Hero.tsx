'use client';

import { useTranslations } from 'next-intl';

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
const HERO_VIDEO_POSTER = process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER;

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      {/* Video или градиентный фон */}
      <div className="absolute inset-0">
        {HERO_VIDEO_URL ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_VIDEO_POSTER || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117]" />
        )}
        {/* Overlay для читаемости текста */}
        <div className="absolute inset-0 bg-[#0d1117]/70" />
      </div>

      {/* Контент */}
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          {t('heroTitle')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#e6edf3]/90 drop-shadow-md sm:text-xl">
          {t('heroSubtitle')}
        </p>
        <p className="mt-2 text-2xl font-semibold text-[#f97316] drop-shadow-md">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
