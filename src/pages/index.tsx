import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Hero } from '@/components/Page/Home/Hero';
import { LinkMoreArchive, LinkMoreTag } from '@/components/Page/Home/LinkMore';
import Heading from '@/components/UI/Heading';
import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { AUTHOR, SITE } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
import { Post as PropsPost } from '@/types/source';

const POST_DISPLAY_LIMIT = 5;

type pickupPostsProps = Pick<PropsPost, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>;

type IndexProps = {
  recentPosts: pickupPostsProps[];
  updatesPosts: pickupPostsProps[];
  tags: PostTagProps[];
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Index({ recentPosts, updatesPosts, tags }: Props) {
  return (
    <>
      <Head>
        <meta content={AUTHOR.ICON} name="thumbnail" />
        <link href={SITE.URL} rel="canonical" />
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
          <Heading as="h2" text="最新記事" textSide={<LinkMoreArchive />} />
          <Columns title="Recent Articles" titleTagName="h3">
            <Stack space="half">
              {recentPosts.map((post) => (
                <LinkCard
                  date={post.date}
                  excerpt={post.excerpt}
                  key={post.slug}
                  link={`${post.slug}.html`}
                  tags={post.tags}
                  title={post.title}
                  updated={post.updated}
                />
              ))}
            </Stack>
          </Columns>

          <Columns title="Updated Articles" titleTagName="h3">
            <Stack space="half">
              {updatesPosts.map((post) => (
                <LinkCard
                  date={post.date}
                  excerpt={post.excerpt}
                  key={post.slug}
                  link={`${post.slug}.html`}
                  tags={post.tags}
                  title={post.title}
                  updated={post.updated}
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

const pickPosts = ({ title, slug, date, updated, excerpt, tags }: Partial<PropsPost>): pickupPostsProps => {
  return { title, slug, date, updated, excerpt, tags };
};

export const getStaticProps: GetStaticProps<IndexProps> = () => {
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
    .map((post) => pickPosts(post));

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
