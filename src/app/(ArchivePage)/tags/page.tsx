import type { Metadata } from 'next/types';
import { getMetadata } from '@/app/_metadata';
import { JsonLdScript } from '@/components/Functional/JsonLdScript';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Title } from '@/components/UI/Title';
import { SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getWebPageStructured } from '@/lib/json-ld';
import { getTagsWithCount } from '@/lib/posts';

type ListItemProps = Parameters<typeof getWebPageStructured>[0]['listItem'];

const tags = getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);
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

export default async function Page() {
  return (
    <>
      <JsonLdScript
        jsonLd={getWebPageStructured({
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
