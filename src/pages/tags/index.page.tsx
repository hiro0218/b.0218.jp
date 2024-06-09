import Head from 'next/head';

import { TagSection } from '@/components/Feature/TagSection';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

import { createGetLayout } from '../_layouts/ArchivePageLayout';

const tags = getTagsWithCount().filter((tag) => tag.count >= TAG_VIEW_LIMIT);

export default function Tags() {
  return (
    <>
      <Head>
        <title key="title">{`Tags - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/tags`} rel="canonical" />
      </Head>

      <Stack space={4}>
        <Title heading="Tags" paragraph={`${tags.length}件のタグ`} />
        <TagSection tags={tags} />
      </Stack>
    </>
  );
}

Tags.getLayout = createGetLayout();
