import type { ReactNode } from 'react';

type WhyChooseCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

/** Карточка секции «Почему выбирают»: тёмный фон, акцент #FF7A00 по макету why_me.md */
export function WhyChooseCard({
  title,
  description,
  icon,
}: WhyChooseCardProps) {
  return (
    <article className="group flex h-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-white/[0.22] hover:bg-white/[0.07]">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center text-[#FF7A00] transition-colors duration-200 group-hover:text-[#ff9a40]"
        aria-hidden
      >
        <span className="block h-10 w-10 [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
          {icon}
        </span>
      </div>
      <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-white">
        {title}
      </h3>
      <p className="text-[14px] leading-[1.45] text-white/[0.88] group-hover:text-white/95">
        {description}
      </p>
    </article>
  );
}
