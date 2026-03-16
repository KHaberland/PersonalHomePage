import { Header } from './Header';
import { Footer } from './Footer';
import type { Contact } from '@/lib/api-types';

type LayoutProps = {
  children: React.ReactNode;
  contact?: Contact | null;
};

export function Layout({ children, contact }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        email={contact?.email}
        linkedinUrl={contact?.linkedin_url}
        youtubeUrl={contact?.youtube_url}
      />
    </div>
  );
}
