import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oleg Suvorov | Welding Engineer',
  description:
    'Professional welding engineer portfolio, technical blog, and engineering calculators',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
