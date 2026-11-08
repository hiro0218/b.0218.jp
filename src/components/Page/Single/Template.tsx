/**
 * about/privacyページで使用する共通テンプレート
 */
import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { StructuredData } from '@/components/Functional/StructuredData';
import { parser } from '@/components/Page/_shared/HTMLParser';
import { Title } from '@/components/UI/Title';
import {
  getAboutPageStructured,
  getActivitiesStructured,
  getProfilePageStructured,
  getWebPageStructured,
} from '@/lib/domain/json-ld';
import { PAGE_CONFIGS, type PageConfig, type PageSlug } from '@/lib/page/config';
import { getActivitiesJson } from '@/lib/source/activities';
import { getPagesJson } from '@/lib/source/page';
import { css, cx, styled } from '@/ui/styled';

// 値は JSON-LD そのものでなく、関数にする。そのものだと、表示しないページの分まで組み立て、privacy でも活動実績を読んでしまうため
const JSON_LD: Record<PageSlug, (config: PageConfig) => ComponentProps<typeof StructuredData>['data']> = {
  about: ({ title, description }) => [
    getAboutPageStructured({ name: title, description }),
    getProfilePageStructured(),
    getActivitiesStructured(getActivitiesJson()),
  ],
  privacy: ({ title, description }) => getWebPageStructured({ name: title, description, includeOrganization: true }),
};

export function Template({ slug }: { slug: PageSlug }) {
  const config = PAGE_CONFIGS[slug];
  const page = getPagesJson().find((page) => page.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <StructuredData data={JSON_LD[slug](config)} />
      <Intro>
        <Title paragraph={config.description}>{config.title}</Title>
        <article className={cx('post-content', articleStyle)}>{parser(page.content)}</article>
      </Intro>
    </>
  );
}

const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-title);
`;

// .post-content のリンク全体には min-width・min-height を付けない。文の中のリンクまで広げてしまうため
const articleStyle = css`
  & li > a:only-child {
    display: inline-flex;
    align-items: center;
    min-width: var(--control-min-size);
    min-height: var(--control-min-size);
  }
`;
