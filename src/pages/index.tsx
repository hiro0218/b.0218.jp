import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Hero } from '@/components/Page/Home/Hero';
import { LinkMore } from '@/components/Page/Home/LinkMore';
import Heading from '@/components/UI/Heading';
import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import PostTag, { PostTagGridContainer, Props as PostTagProps } from '@/components/UI/Tag';
import { AUTHOR_ICON, SITE_URL } from '@/constant';
import { getOrganizationStructured } from '@/lib/json-ld';
import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
import { PostProps } from '@/types/source';

const POST_DISPLAY_LIMIT = 5;

type PostListProps = UnpackedArray<ReturnType<typeof getPostsListJson>>;

type pickupPostsProps = Pick<PostProps, 'title' | 'slug' | 'date' | 'updated' | 'excerpt' | 'tags'>;

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
            <Stack space="half">
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
            <Stack space="half">
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

const pickPosts = ({ title, slug, date, updated, excerpt, tags }: PostListProps): PostListProps => {
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
