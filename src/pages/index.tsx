import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { Hero, Works } from '@/components/Page/Home';
import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { githubPinnedItems } from '@/lib/getData';
import { getPostsListJson, getTermWithCount } from '@/lib/posts';
import { GithubPinnedItems, Post as PropsPost } from '@/types/source';

const POST_DISPLAY_LIMIT = 5;

interface Props {
  pinnedItems: Array<GithubPinnedItems>;
  recentPosts: Array<PropsPost>;
  updatesPosts: Array<PropsPost>;
  tags: Array<PostTagProps>;
}

const Home: NextPage<Props> = ({ pinnedItems, recentPosts, updatesPosts, tags }) => {
  return (
    <>
      <Head>
        <meta name="thumbnail" content="https://b.0218.jp/hiro0218.png" />
        <template
          dangerouslySetInnerHTML={{
            __html: `<!--
                        <PageMap>
                          <DataObject type="thumbnail">
                            <Attribute name="src" value="https://b.0218.jp/hiro0218.png"/>
                            <Attribute name="width" value="100"/>
                            <Attribute name="height" value="100"/>
                          </DataObject>
                        </PageMap>
                      -->`,
          }}
        />
      </Head>

      <PageContentContainer>
        <Hero />

        <Works items={pinnedItems} />

        <Columns title={'Recent Articles'}>
          <Stack space="var(--space-x-xs)">
            {recentPosts.map((post, index) => (
              <LinkCard
                key={index}
                link={`${post.slug}.html`}
                title={post.title}
                date={post.updated || post.date}
                excerpt={post.excerpt}
              />
            ))}
          </Stack>
        </Columns>

        <Columns title={'Updated Articles'}>
          <Stack space="var(--space-x-xs)">
            {updatesPosts.map((post, index) => (
              <LinkCard
                key={index}
                link={`${post.slug}.html`}
                title={post.title}
                date={post.updated || post.date}
                excerpt={post.excerpt}
              />
            ))}
          </Stack>
        </Columns>

        <Columns title={'Tags'}>
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
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
  const pinnedItems = githubPinnedItems();
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
      pinnedItems,
      recentPosts,
      updatesPosts,
      tags,
    },
  };
};
