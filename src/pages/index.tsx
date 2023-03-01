import { GetStaticProps } from 'next';
import Head from 'next/head';

import { Hero } from '@/components/Page/Home/Hero';
import { LinkMoreArchive } from '@/components/Page/Home/LinkMore';
import { LinkMoreTag } from '@/components/Page/Home/LinkMore/index';
import Heading from '@/components/UI/Heading';
import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { AUTHOR } from '@/constant';
import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
import { Post as PropsPost } from '@/types/source';

const POST_DISPLAY_LIMIT = 5;

interface Props {
  recentPosts: PropsPost[];
  updatesPosts: PropsPost[];
  tags: PostTagProps[];
}

export default function Index({ recentPosts, updatesPosts, tags }: Props) {
  return (
    <>
      <Head>
        <meta name="thumbnail" content={AUTHOR.ICON} />
      </Head>

      <PageContainer>
        <ScreenReaderOnlyText as="h1" text="トップページ" />

        <Stack as="section">
          <Hero />
        </Stack>

        <Stack as="section">
          <Heading as="h2" text="最新記事" textSide={<LinkMoreArchive />} />
          <Columns title="Recent Articles" titleTagName="h3">
            <Stack space="half">
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
            <Stack space="half">
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
          <Heading as="h2" text="タグ" textSide={<LinkMoreTag />} />
          <PostTagGridContainer>
            <PostTag tags={tags} />
          </PostTagGridContainer>
        </Stack>
      </PageContainer>
    </>
  );
}

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

  const tags = getTagsWithCount()
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
