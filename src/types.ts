export interface Game {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  gameType: string;
  difficulty: string;
  tags: string[];
  icon: string;
  coverImage: string;
  screenshots: string[];
  features: { id: string; title: string; description: string; icon: string }[];
  howToPlay: { id: string; title: string; description: string; image: string }[];
  audience: string;
  storeLinks: {
    googlePlay: { enabled: boolean; buttonText: string; url: string };
    appStore: { enabled: boolean; buttonText: string; url: string };
  };
  accentColor: string;
  infoStrip: { playStyle: string; platform: string; session: string; };
  whatIsIt: string[];
  audienceCards: string[];
  whyPlay: { heading: string; subheading: string; points: string[]; };
  sectionOrder: { id: string; type: string; visible: boolean; order: number; config?: any }[];
  status: 'Draft' | 'Published' | 'Hidden' | 'Archived';
  featured: boolean;
  sortOrder: number;
  privacyPolicy: { enabled: boolean; title: string; content: string; lastUpdated: string; slug: string };
  termsAndConditions: { enabled: boolean; title: string; content: string; lastUpdated: string; slug: string };
  whatsapp: { enabled: boolean; message: string; number: string };
  seo: { title: string; description: string; noIndex: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface PageSection {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  image: string;
  buttons: { text: string; url: string; style: 'primary' | 'secondary' }[];
  visible: boolean;
  sortOrder: number;
  settings: Record<string, any>;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'Published' | 'Hidden';
  seo: { title: string; description: string };
  sections: PageSection[];
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  logo: string;
  companyName: string;
  header: {
    enabled: boolean;
    logoText: string;
    navigation: { id: string; label: string; url: string; visible: boolean; order: number }[];
    cta: { enabled: boolean; text: string; url: string };
    sticky: boolean;
  };
  footer: {
    enabled: boolean;
    description: string;
    socialLinks: { platform: string; url: string; visible: boolean }[];
    copyrightText: string;
  };
  globalStoreLinks: {
    stripEnabled: boolean;
    stripText: string;
    googlePlayUrl: string;
    appStoreUrl: string;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    defaultMessage: string;
  };
  globalCta: {
    enabled: boolean;
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
    indexing: boolean;
    analyticsId?: string;
  };
}

export interface DatabaseSchema {
  games: Game[];
  pages: Page[];
  settings: SiteSettings;
  privacyPolicy: {
    enabled: boolean;
    title: string;
    content: string;
    lastUpdated: string;
  };
}
