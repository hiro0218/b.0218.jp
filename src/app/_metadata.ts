import type { Metadata } from 'next/types';

import { SCREEN_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/constant';

export const openGraph: Metadata['openGraph'] = {
  type: 'website',
  url: SITE_URL,
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  locale: 'ja_JP',
  images: [
    {
      url: SCREEN_IMAGE,
      alt: SITE_NAME,
    },
  ],
};
