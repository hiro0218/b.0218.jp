import { getMetadata, PAGE_CONFIGS } from '@/app/_metadata';
import Template from '@/components/Page/Single/Template';
import { SITE_URL } from '@/constants';

export const metadata = getMetadata({
  title: PAGE_CONFIGS.privacy.title,
  description: PAGE_CONFIGS.privacy.description,
  url: `${SITE_URL}/privacy`,
});

export default function Page() {
  return <Template slug="privacy" />;
}
