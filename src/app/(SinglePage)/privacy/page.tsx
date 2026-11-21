import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { SingleTemplate } from '@/components/Page/Single/Template';
import { SITE_URL } from '@/constants';
import { PAGE_CONFIGS } from '@/lib/page/config';

export const metadata: Metadata = getMetadata({
  title: PAGE_CONFIGS.privacy.title,
  description: PAGE_CONFIGS.privacy.description,
  url: `${SITE_URL}/privacy`,
});

export default function Page() {
  return <SingleTemplate slug="privacy" />;
}
