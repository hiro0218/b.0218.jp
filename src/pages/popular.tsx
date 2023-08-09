import Head from 'next/head';

import { Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getData } from '@/server/popular';

const data = getData();

export default function Popular() {
  const { popularPosts } = data;
  return (
    <>
      <Head>
        <title key="title">{`Popular - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/popular`} rel="canonical" />
      </Head>

      <Stack space="4">
        <Title heading="Popular" paragraph={`${popularPosts.length}件の記事`} />
        <Stack>
          {popularPosts.map(({ date, slug, tags, title, updated }) => (
            <LinkCard date={date} key={slug} link={`${slug}.html`} tags={tags} title={title} updated={updated} />
          ))}
        </Stack>
      </Stack>
    </>
  );
}
