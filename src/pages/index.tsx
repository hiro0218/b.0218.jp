import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/UI/Heading';
import { Columns, Flex, PageContentContainer } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import PostTag, { Props as PostTagProps } from '@/components/UI/Tag';
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
        <meta name="thumbnail" content="https://b.0218.jp/hiro0218.png" />
      </Head>

      <header>
        <Heading text={'Home'} />
      </header>

      <PageContentContainer>
        <Columns title={'Recent Articles'}>
          <Flex direction="column" gap="var(--space-x-xs) 0" role="list">
            {recentPosts.map((post, index) => (
              <Flex.Item key={index} display="block" role="listitem">
                <LinkCard
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              </Flex.Item>
            ))}
          </Flex>
        </Columns>

        <Columns title={'Updated Articles'}>
          <Flex direction="column" gap="var(--space-x-xs) 0" role="list">
            {updatesPosts.map((post, index) => (
              <Flex.Item key={index} display="block" role="listitem">
                <LinkCard
                  link={`${post.slug}.html`}
                  title={post.title}
                  date={post.updated || post.date}
                  excerpt={post.excerpt}
                />
              </Flex.Item>
            ))}
          </Flex>
        </Columns>

        <Columns title={'Tags'}>
          <Flex wrap="wrap" gap="var(--space-x-xs)">
            <PostTag tags={tags} />
          </Flex>
        </Columns>
      </PageContentContainer>
    </>
  );
};

export default Home;

const pickPosts = (posts: Partial<PropsPost>) => {
  const { title, slug, date, updated, excerpt } = posts;
  return { title, slug, date, updated, excerpt };
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPostsListJson();
  const recentPosts = posts
    .filter((_, i) => i < POST_DISPLAY_LIMIT)
    .map((post) => {
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
    .filter((_, i) => i < POST_DISPLAY_LIMIT)
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
