import type { Metadata } from 'next/types';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { Title } from '@/components/UI/Title';
import { SITE_URL, TAG_VIEW_LIMIT } from '@/constants';
import { getWebPageStructured } from '@/lib/domain/json-ld';
import { getTagsWithCount } from '@/lib/source/tag';
import { tagPermalink } from '@/lib/tag/navigation';
import { tagFromUrlPath } from '@/lib/tag/url';
import type { TagCounts } from '@/types/source';

type ListItemProps = Parameters<typeof getWebPageStructured>[0]['listItem'];
type NavigableTag = TagCounts & { isNavigable: true };

const tags = getTagsWithCount().reduce<NavigableTag[]>((filteredTags, tag) => {
  if (tag.count >= TAG_VIEW_LIMIT) {
    filteredTags.push({ ...tag, isNavigable: true });
  }

  return filteredTags;
}, []);
const title = 'Tags';
const description = `${tags.length}件のタグ`;
const url = `${SITE_URL}/tags`;

// 構造化データのリスト
const listItem: ListItemProps = tags.slice(0, 20).map(({ slug }, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  name: tagFromUrlPath(slug),
  url: tagPermalink(slug),
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
      <Title paragraph={description}>{title}</Title>
      <TagSection tags={tags} />
    </>
  );
}
