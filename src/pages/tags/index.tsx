import Head from 'next/head';

import { Grid, Stack } from '@/components/UI/Layout';
import PostTag from '@/components/UI/Tag';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL, TAG_VIEW_LIMIT } from '@/constant';
import { getTagsWithCount } from '@/lib/posts';

const tags = getTagsWithCount()
  .filter(([, count]) => count >= TAG_VIEW_LIMIT)
  .map(([slug, count]) => ({ slug, count }));

export default function Tags() {
  return (
    <>
      <Head>
        <title key="title">{`Tags - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/tags`} rel="canonical" />
      </Head>

      <Stack space="4">
        <Title heading="Tags" paragraph={`${tags.length}件のタグ`} />
        <Stack>
          <Grid>
            <PostTag tags={tags} />
          </Grid>
        </Stack>
      </Stack>
    </>
  );
}
