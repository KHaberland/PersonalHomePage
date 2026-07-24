import Image from 'next/image';
import { Link } from '@/i18n/navigation';

const identityPhoto = {
  src: '/images/photos/author.jpg',
} as const;

function IdentityPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 28rem"
        className="object-cover"
        style={{ objectPosition: 'center calc(50% + 20px)' }}
      />
    </div>
  );
}

type EngineerIdentityStripProps = {
  ariaLabel: string;
  photoAlt: string;
  title: string;
  lead: string[];
  bullets: string[];
  aboutCta: string;
  experienceCta: string;
};

export function EngineerIdentityStrip({
  ariaLabel,
  photoAlt,
  title,
  lead,
  bullets,
  aboutCta,
  experienceCta,
}: EngineerIdentityStripProps) {
  return (
    <section
      className="w-full bg-background py-2 sm:py-3"
      aria-labelledby="home-about-teaser-heading"
    >
      <div className="container-wide">
        <div
          className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)] md:items-stretch"
          aria-label={ariaLabel}
        >
          <div className="card card-passive order-2 flex min-h-0 flex-col p-5 md:order-1">
            <h2
              id="home-about-teaser-heading"
              className="heading-3 max-w-3xl text-foreground"
            >
              {title}
            </h2>
            <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-foreground/80">
              {lead.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul className="mt-5 grid list-none gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/about" className="btn-secondary">
                {aboutCta}
              </Link>
              <Link href="/experience" className="btn-pill">
                {experienceCta}
              </Link>
            </div>
          </div>

          <div className="about-photo-glow-wrap order-1 min-h-0 overflow-hidden rounded-lg border border-border md:order-2">
            <IdentityPhoto {...identityPhoto} alt={photoAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
