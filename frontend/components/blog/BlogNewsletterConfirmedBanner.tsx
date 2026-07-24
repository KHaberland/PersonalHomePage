type Props = {
  message: string;
};

export function BlogNewsletterConfirmedBanner({ message }: Props) {
  if (!message) return null;

  return (
    <div
      className="card-cta mb-8 border border-accent-orange/40 px-5 py-4 text-sm text-foreground/90"
      role="status"
    >
      {message}
    </div>
  );
}
