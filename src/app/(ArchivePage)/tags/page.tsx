import { getMetadata } from '@/app/(ArchivePage)/metadata';
import { TagSection } from '@/components/Page/Share/TagSection';
import { Box } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';
import type { Metadata } from 'next/types';

const tags = getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);
const slug = 'tags';
const title = 'Tags';
const description = `${tags.length}件のタグ`;

export const metadata: Metadata = getMetadata({
  title,
  description,
  url: `${SITE_URL}/${slug}`,
});

export default async function Page() {
  return (
    <>
      <Title heading={title} paragraph={description} />
      <Box mt={4}>
        <TagSection tags={tags} />
      </Box>
    </>
  );
}
