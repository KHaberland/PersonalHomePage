import { Header } from './Header';
import { Footer } from './Footer';
import { HomeSectionProgress } from './HomeSectionProgress';
import { CookieConsentRoot } from './cookie-consent/CookieConsentRoot';
import type { Contact } from '@/lib/api-types';
import type { CommonUiLabels } from '@/lib/common-labels';

type LayoutProps = {
  children: React.ReactNode;
  contact?: Contact | null;
  labels: CommonUiLabels;
};

export function Layout({ children, contact, labels }: LayoutProps) {
  return (
    <CookieConsentRoot labels={labels.cookieConsent}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header
          headerLabels={labels.header}
          navLabels={labels.nav}
          brandLabels={labels.brand}
          languageLabels={labels.language}
        />
        <main className="flex-1">{children}</main>
        <HomeSectionProgress labels={labels.progress} />
        <Footer
          email={contact?.email}
          linkedinUrl={contact?.linkedin_url}
          youtubeUrl={contact?.youtube_url}
          footerLabels={labels.footer}
          navLabels={labels.nav}
          homeLabels={labels.home}
          brandLabels={labels.brand}
          platformLabels={labels.platforms}
          languageLabels={labels.language}
        />
      </div>
    </CookieConsentRoot>
  );
}
