import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import PostTag, { Props as PostTagProps } from '@/components/Page/Post/Tag';
import Heading from '@/components/UI/Heading';
import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { getPostsListJson, getTermJson } from '@/lib/posts';
import { Post as PropsPost } from '@/types/source';

interface Props {
  recentPosts: Array<PropsPost>;
  updatesPosts: Array<PropsPost>;
  tags: Array<PostTagProps>;
}

const Home: NextPage<Props> = ({ recentPosts, updatesPosts, tags }) => {
  return (
    <>
      <Head>
        <meta name="thumbnail" content="https://b.0218.jp/hiro0218.png" />
      </Head>

      <header>
        <Heading text={'Home'} />
      </header>

      <PageContentContainer>
        <Columns title={'Recent Articles'}>
          <Stack direction="column" gap="var(--space-x-xs) 0" role="list">
            {recentPosts.map((post, index) => (
              <Stack.Item key={index} display="block" role="listitem">
                <LinkCard
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              </Stack.Item>
            ))}
          </Stack>
        </Columns>

        <Columns title={'Updated Articles'}>
          <Stack direction="column" gap="var(--space-x-xs) 0" role="list">
            {updatesPosts.map((post, index) => (
              <Stack.Item key={index} display="block" role="listitem">
                <LinkCard
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              </Stack.Item>
            ))}
          </Stack>
        </Columns>

        <Columns title={'Tags'}>
          <Stack wrap="wrap" gap="var(--space-x-xs)">
            <PostTag tags={tags} />
          </Stack>
        </Columns>
      </PageContentContainer>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPostsListJson();
  const recentPosts = posts.filter((_, i) => i < 5);
  const updatesPosts = posts
    .sort((a, b) => {
      return a.updated < b.updated ? 1 : -1;
    })
    .filter((post) => post.date < post.updated)
    .filter((post) => {
      // recentPosts に含まれているものは除外する
      return !recentPosts.filter((recentPost) => post.slug === recentPost.slug).length;
    })
    .filter((_, i) => i < 5);

  const tags = Object.entries(getTermJson('tags'))
    .map(([key, val]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return [key, val.length] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]) // 件数の多い順にソート
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
