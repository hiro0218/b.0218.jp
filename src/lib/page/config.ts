export type PageSlug = 'about' | 'privacy';

export type PageConfig = {
  title: string;
  description: string;
};

export const PAGE_CONFIGS: Record<PageSlug, PageConfig> = {
  about: {
    title: 'About',
    description: 'サイトと運営者について',
  },
  privacy: {
    title: 'Privacy',
    description: 'プライバシーポリシー',
  },
};
