import Head from 'next/head';

import { Hero, LinkMore } from '@/client/home';
import Heading from '@/components/UI/Heading';
import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import PostTag, { PostTagGridContainer } from '@/components/UI/Tag';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { getData } from '@/server/home';

const data = getData();

export default function Index() {
  const { recentPosts, updatesPosts, tags } = data;

  return (
    <>
      <Head>
        <meta content={AUTHOR_ICON} name="thumbnail" />
        <link href={SITE_URL} rel="canonical" />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getOrganizationStructured()),
          }}
          type="application/ld+json"
        ></script>
      </Head>

      <PageContainer>
        <ScreenReaderOnlyText as="h1" text="トップページ" />

        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="最新記事" textSide={<LinkMore href="/archive" text="archive" />} />
          <Columns title="Recent Articles" titleTagName="h3">
            <Stack space="½">
              {recentPosts.map(({ date, excerpt, slug, tags, title, updated }) => (
                <LinkCard
                  date={date}
                  excerpt={excerpt}
                  key={slug}
                  link={`${slug}.html`}
                  tags={tags}
                  title={title}
                  updated={updated}
                />
              ))}
            </Stack>
          </Columns>

          <Columns title="Updated Articles" titleTagName="h3">
            <Stack space="½">
              {updatesPosts.map(({ date, excerpt, slug, tags, title, updated }) => (
                <LinkCard
                  date={date}
                  excerpt={excerpt}
                  key={slug}
                  link={`${slug}.html`}
                  tags={tags}
                  title={title}
                  updated={updated}
                />
              ))}
            </Stack>
          </Columns>
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="タグ" textSide={<LinkMore href="/tags" text="tags" />} />
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
        </Stack>
      </PageContainer>
    </>
  );
}
