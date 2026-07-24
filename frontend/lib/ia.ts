export type NavKey =
  | 'about'
  | 'blog'
  | 'book'
  | 'contact'
  | 'experience'
  | 'expertise'
  | 'home'
  | 'knowledgeNav'
  | 'privacyNav'
  | 'solutions'
  | 'toolsNav';

export type NavLink = {
  href: string;
  key: NavKey;
};

export const primaryNavLinks = [
  { href: '/solutions', key: 'solutions' },
  { href: '/experience', key: 'experience' },
  { href: '/expertise', key: 'expertise' },
  { href: '/tools', key: 'toolsNav' },
  { href: '/knowledge', key: 'knowledgeNav' },
  { href: '/contact', key: 'contact' },
] as const satisfies readonly NavLink[];

export const decisionSystemLayers = [
  {
    id: 'engineering-reasoning',
    titleKey: 'engineeringReasoning',
    links: [
      { href: '/solutions', key: 'solutions' },
      { href: '/expertise', key: 'expertise' },
    ],
  },
  {
    id: 'engineering-proof',
    titleKey: 'engineeringProof',
    links: [
      { href: '/experience', key: 'experience' },
      { href: '/tools', key: 'toolsNav' },
    ],
  },
  {
    id: 'knowledge-system',
    titleKey: 'knowledgeSystem',
    links: [
      { href: '/knowledge', key: 'knowledgeNav' },
      { href: '/blog', key: 'blog' },
      { href: '/book', key: 'book' },
    ],
  },
] as const satisfies readonly {
  id: string;
  titleKey: 'engineeringReasoning' | 'engineeringProof' | 'knowledgeSystem';
  links: readonly NavLink[];
}[];

export const supportNavLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
  { href: '/privacy', key: 'privacyNav' },
] as const satisfies readonly NavLink[];
