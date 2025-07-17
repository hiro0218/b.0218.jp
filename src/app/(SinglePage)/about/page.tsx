import { getMetadata, PAGE_CONFIGS } from '@/app/_metadata';
import Template from '@/components/Page/Single/Template';
import { SITE_URL } from '@/constant';

export const metadata = getMetadata({
  title: PAGE_CONFIGS.about.title,
  description: PAGE_CONFIGS.about.description,
  url: `${SITE_URL}/about`,
});

export default function Page() {
  return <Template slug="about" />;
}
