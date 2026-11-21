/**
 * about/privacyページで使用する共通テンプレート
 */
import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { StructuredData } from '@/components/Functional/StructuredData';
import { parser } from '@/components/Page/_shared/HTMLParser';
import { SinglePage } from '@/components/Page/Single/SinglePage';
import {
  getAboutPageStructured,
  getActivitiesStructured,
  getProfilePageStructured,
  getWebPageStructured,
} from '@/lib/domain/json-ld';
import { PAGE_CONFIGS, type PageConfig, type PageSlug } from '@/lib/page/config';
import { getActivitiesJson } from '@/lib/source/activities';
import { getPagesJson } from '@/lib/source/page';

// 値は JSON-LD そのものでなく、関数にする。そのものだと、表示しないページの分まで組み立て、privacy でも活動実績を読んでしまうため
const JSON_LD: Record<PageSlug, (config: PageConfig) => ComponentProps<typeof StructuredData>['data']> = {
  about: ({ title, description }) => [
    getAboutPageStructured({ name: title, description }),
    getProfilePageStructured(),
    getActivitiesStructured(getActivitiesJson()),
  ],
  privacy: ({ title, description }) => getWebPageStructured({ name: title, description, includeOrganization: true }),
};

export function SingleTemplate({ slug }: { slug: PageSlug }) {
  const config = PAGE_CONFIGS[slug];
  const page = getPagesJson().find((page) => page.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <StructuredData data={JSON_LD[slug](config)} />
      <SinglePage description={config.description} title={config.title}>
        {parser(page.content)}
      </SinglePage>
    </>
  );
}
