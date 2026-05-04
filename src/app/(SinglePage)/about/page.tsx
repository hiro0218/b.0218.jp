import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { Template } from '@/components/Page/Single/Template';
import { SITE_URL } from '@/constants';
import { PAGE_CONFIGS } from '@/lib/page/config';

export const metadata: Metadata = getMetadata({
  title: PAGE_CONFIGS.about.title,
  description: PAGE_CONFIGS.about.description,
  url: `${SITE_URL}/about`,
});

export default function Page() {
  return <Template description={PAGE_CONFIGS.about.description} slug="about" title={PAGE_CONFIGS.about.title} />;
}
