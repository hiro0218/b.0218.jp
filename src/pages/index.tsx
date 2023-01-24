import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { Hero } from '@/components/Page/Home/Hero';
import Heading from '@/components/UI/Heading';
import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { SITE } from '@/constant';
import { getPostsListJson, getTermWithCount } from '@/lib/posts';
import { Post as PropsPost } from '@/types/source';

const POST_DISPLAY_LIMIT = 5;

interface Props {
  recentPosts: Array<PropsPost>;
  updatesPosts: Array<PropsPost>;
  tags: Array<PostTagProps>;
}

const Home: NextPage<Props> = ({ recentPosts, updatesPosts, tags }) => {
  return (
    <>
      <Head>
        <meta name="thumbnail" content={`${SITE.URL}hiro0218.png`} />
      </Head>

      <div
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: `<!--
                      <PageMap>
                        <DataObject type="thumbnail">
                          <Attribute name="src" value="${SITE.URL}hiro0218.png"/>
                          <Attribute name="width" value="100"/>
                          <Attribute name="height" value="100"/>
                        </DataObject>
                      </PageMap>
                    -->`,
        }}
      />

      <PageContainer>
        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="Articles" />
          <Columns title="Recent Articles" titleTagName="h3">
            <Stack space="var(--space-x-xs)">
              {recentPosts.map((post) => (
                <LinkCard
                  key={post.slug}
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              ))}
            </Stack>
          </Columns>

          <Columns title="Updated Articles" titleTagName="h3">
            <Stack space="var(--space-x-xs)">
              {updatesPosts.map((post) => (
                <LinkCard
                  key={post.slug}
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              ))}
            </Stack>
          </Columns>
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="Tags" />
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
        </Stack>
      </PageContainer>
    </>
  );
};

export default Home;

const pickPosts = ({ title, slug, date, updated, excerpt }: Partial<PropsPost>) => {
  return { title, slug, date, updated, excerpt };
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPostsListJson();
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT).map((post) => {
    return pickPosts(post);
  });
  const updatesPosts = posts
    .sort((a, b) => {
      return a.updated < b.updated ? 1 : -1;
    })
    .filter((post) => post.updated && post.date < post.updated)
    .filter((post) => {
      // recentPosts に含まれているものは除外する
      return !recentPosts.filter((recentPost) => post.slug === recentPost.slug).length;
    })
    .slice(0, POST_DISPLAY_LIMIT)
    .map((post) => {
      return pickPosts(post);
    });

  const tags = getTermWithCount('tags')
    .filter((item, i) => item[1] >= 10 && i < 25) // 件数が10件以上を25個抽出
    .map(([slug, count]) => {
      return { slug, count };
    });

  return {
    props: {
      recentPosts,
      updatesPosts,
      tags,
    },
  };
};
