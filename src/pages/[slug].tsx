import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useRef } from 'react';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PostEdit, PostHeader, PostNextRead, PostNote, PostShare } from '@/components/Page/Post';
import Mokuji from '@/components/Page/Post/Mokuji';
import TagSimilar from '@/components/Page/Post/TagSimilar';
import { Adsense } from '@/components/UI/Adsense';
import { PageContainer } from '@/components/UI/Layout';
import { Props as PostTagProps } from '@/components/UI/Tag';
import { Title } from '@/components/UI/Title';
import { AUTHOR_NAME, READ_TIME_SUFFIX, TAG_VIEW_LIMIT } from '@/constant';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getPostsJson, getTagSimilar, getTagsJson } from '@/lib/posts';
import { textSegmenter } from '@/lib/textSegmenter';
import { getOgpImage, getPermalink } from '@/lib/url';
import { Post as PostType, TermsPostList } from '@/types/source';

type PostProps = {
  post: PostType & {
    tagsWithCount: PostTagProps[];
    segmentedTitle: string;
  };
  nextRead: TermsPostList[];
  similarTags: PostTagProps[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({ post, nextRead, similarTags }: Props) {
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = getPermalink(post.slug);
  const description = getDescriptionText(post.content);

  useTwitterWidgetsLoad({ ref: refContent });

  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
        <meta content={description} key="description" name="description" />
        <meta content={permalink} key="og:url" property="og:url" />
        <meta content={post.title} key="og:title" property="og:title" />
        <meta content="article" key="og:type" property="og:type" />
        <meta content={description} key="og:description" property="og:description" />
        <meta content={post.updated || post.date} key="og:updated_time" property="og:updated_time" />
        <meta content={post.date} key="article:published_time" property="article:published_time" />
        <meta content={post.updated || post.date} key="article:modified_time" property="article:modified_time" />
        <meta content={`${getOgpImage(post.slug)}?ts=${process.env.BUILD_ID}`} key="og:image" property="og:image" />
        <meta content="summary_large_image" key="twitter:card" name="twitter:card" />
        <meta content="Written by" name="twitter:label1" />
        <meta content={AUTHOR_NAME} name="twitter:data1" />
        <meta content="Reading time" name="twitter:label2" />
        <meta content={`${post.readingTime} ${READ_TIME_SUFFIX}`} name="twitter:data2" />
        {post.noindex ? <meta content="noindex" name="robots" /> : <link href={permalink} rel="canonical" />}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getBlogPostingStructured(post), getBreadcrumbStructured(post)]),
          }}
          type="application/ld+json"
        />
      </Head>

      {post.content.includes('twitter-tweet') && (
        <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
      )}

      <PageContainer as="article">
        <Title heading={post.segmentedTitle}>
          <PostHeader
            date={post.date}
            readingTime={post.readingTime}
            tagsWithCount={post.tagsWithCount}
            updated={post.updated}
          />
        </Title>

        <PostNote note={post.note} />

        <Mokuji refContent={refContent} />

        <PostContent
          dangerouslySetInnerHTML={{
            __html: `${post.content}`,
          }}
          itemProp="articleBody"
          ref={refContent}
        />

        <Adsense />

        <PostShare title={post.title} url={permalink} />

        <PostEdit slug={post.slug} />

        <TagSimilar similarTags={similarTags} />

        <PostNextRead posts={nextRead} />
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getPostsJson();
  const paths = posts.map(({ slug }) => ({
    params: { slug: `${slug}.html` },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = (context) => {
  const posts = getPostsJson();
  const tagData = getTagsJson();
  const tagDataWithCount = Object.entries(tagData)
    .map(([slug, val]) => {
      return { slug, count: val.length };
    })
    .sort((a, b) => b.count - a.count);
  const slug = (context.params.slug as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => post.slug === slug);

  // tagsに件数を追加
  const tagsWithCount: PostTagProps[] = post.tags.map((slug) => {
    return tagDataWithCount.find((tag) => tag.slug === slug) || null;
  });

  // タイトルの文字組み
  const segmentedTitle = textSegmenter(post.title);

  // 関連記事
  const tag = post.tags[0];
  const nextRead = Object.entries(tagData)
    .filter(([key]) => key === tag)
    .flatMap(([, values]) =>
      values
        .filter((post, i) => !post.includes(slug) && i < 6)
        .map((slug) => {
          const { title, date, updated, excerpt } = posts.find((post) => post.slug === slug);

          return {
            title,
            slug,
            date,
            updated,
            excerpt,
          };
        }),
    );

  // 奇数の場合は偶数に寄せる
  if (nextRead.length % 2 !== 0) {
    nextRead.pop();
  }

  // 関連タグ
  const getTagBySlug = (slug: PostTagProps['slug']) => {
    return Object.entries(tagData).find(([key]) => key === slug);
  };
  const similarTagsList = getTagSimilar()[tag];
  const similarTags: PostTagProps[] = !!similarTagsList
    ? Object.entries(similarTagsList)
        .map(([slug]) => {
          const tag = getTagBySlug(slug);
          const count = tag.length > 1 ? tag[1].length : 0;
          return count >= TAG_VIEW_LIMIT ? { slug, count } : null;
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.count - a.count)
    : [];

  return {
    props: {
      post: { ...post, tagsWithCount, segmentedTitle },
      nextRead,
      similarTags,
    },
  };
};
