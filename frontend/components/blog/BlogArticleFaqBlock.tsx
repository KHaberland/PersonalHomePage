type FaqItem = {
  question: string;
  answer: string;
  answered_at: string | null;
};

type Props = {
  title: string;
  items: FaqItem[];
};

export function BlogArticleFaqBlock({ title, items }: Props) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      className="mt-12 border-t border-border pt-8"
      aria-labelledby="blog-faq-heading"
    >
      <h2 id="blog-faq-heading" className="heading-3 text-foreground">
        {title}
      </h2>
      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <details
            key={`${index}-${item.question.slice(0, 32)}`}
            className="card group p-4"
          >
            <summary className="cursor-pointer text-sm font-medium text-foreground marker:text-accent-orange">
              {item.question}
            </summary>
            <div className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
