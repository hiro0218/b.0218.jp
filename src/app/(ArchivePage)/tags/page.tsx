import type { Metadata } from 'next/types';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Title } from '@/components/UI/Title';
import { SITE_URL, TAG_VIEW_LIMIT } from '@/constants';
import { getTagsWithCount } from '@/lib/data/posts';
import { getWebPageStructured } from '@/lib/domain/json-ld';

type ListItemProps = Parameters<typeof getWebPageStructured>[0]['listItem'];

const tags = getTagsWithCount()
  .filter((tag) => tag.count >= TAG_VIEW_LIMIT)
  .map((tag) => ({ ...tag, isNavigable: true as const }));
const title = 'Tags';
const description = `${tags.length}件のタグ`;
const url = `${SITE_URL}/tags`;

// 構造化データのリスト
const listItem: ListItemProps = tags.slice(0, 20).map(({ slug }, i) => ({
  '@type': 'ListItem',
  position: i,
  name: decodeURIComponent(slug),
  url: `${url}/${slug}`,
}));

export const metadata: Metadata = getMetadata({
  title,
  description,
  url,
});

export default function Page() {
  return (
    <>
      <StructuredData
        data={getWebPageStructured({
          name: title,
          description,
          listItem,
        })}
      />
      <Title heading={title} paragraph={description} />
      <TagSection tags={tags} />
    </>
  );
}
