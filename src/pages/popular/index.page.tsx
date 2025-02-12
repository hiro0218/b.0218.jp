import Head from 'next/head';

import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { convertPostSlugToPath } from '@/lib/url';
import { createGetLayout } from '../_layouts/ArchivePageLayout';
import { getData } from './_libs';

const data = getData();

export default function Popular() {
  const { popularPosts } = data;
  return (
    <>
      <Head>
        <title key="title">{`Popular - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/popular`} rel="canonical" />
      </Head>

      <Stack as="section" space={4}>
        <Title heading="Popular" paragraph={`${popularPosts.length}件の記事（過去7日間）`} />
        <Sidebar>
          <Sidebar.Side>
            <Sidebar.Title>注目記事</Sidebar.Title>
          </Sidebar.Side>
          <Sidebar.Main>
            <Stack>
              {popularPosts.map(({ date, slug, tags, title, updated }) => {
                const link = convertPostSlugToPath(slug);
                return <LinkCard date={date} key={slug} link={link} tags={tags} title={title} updated={updated} />;
              })}
            </Stack>
          </Sidebar.Main>
        </Sidebar>
      </Stack>
    </>
  );
}

Popular.getLayout = createGetLayout();
