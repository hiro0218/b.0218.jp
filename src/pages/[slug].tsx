import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useRef } from 'react';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PostEdit, PostHeader, PostNextRead, PostNote, PostShare } from '@/components/Page/Post';
import Mokuji from '@/components/Page/Post/Mokuji';
import { Adsense } from '@/components/UI/Adsense';
import { PageContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { AUTHOR, READ_TIME_SUFFIX, SITE } from '@/constant';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getPostsJson, getTagsJson, getTagsWithCount } from '@/lib/posts';
import { textSegmenter } from '@/lib/textSegmenter';
import { Post as PostType, TermsPostList } from '@/types/source';

type PostProps = {
  post: PostType & { segmentedTitle: string };
  nextRead: TermsPostList[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({ post, nextRead }: Props) {
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = `${SITE.URL}${post.slug}.html`;
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
        <meta
          content={`${SITE.URL}images/ogp/${post.slug}.webp?ts=${process.env.BUILD_ID}`}
          key="og:image"
          property="og:image"
        />
        <meta content="summary_large_image" key="twitter:card" name="twitter:card" />
        <meta content="Written by" name="twitter:label1" />
        <meta content={AUTHOR.NAME} name="twitter:data1" />
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
          <PostHeader date={post.date} readingTime={post.readingTime} tags={post.tags} updated={post.updated} />
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

        <PostNextRead posts={nextRead} />
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  const posts = getPostsJson();
  const paths = posts.map((post) => ({
    params: { slug: `${post.slug}.html` },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = (context) => {
  const posts = getPostsJson();
  const slug = (context.params.slug as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => {
    return post.slug === slug;
  });

  // tagsを件数順に並び替える
  post.tags =
    post.tags.length > 1
      ? getTagsWithCount()
          .filter(([key]) => {
            return post.tags.filter((tag) => tag === key).length > 0;
          })
          .map(([slug]) => {
            return slug;
          })
      : post.tags;

  // タイトルの文字組み
  const segmentedTitle = textSegmenter(post.title);

  // 関連記事
  const tag = post.tags[0];
  const tagData = getTagsJson();
  const nextRead = Object.entries(tagData)
    .filter(([key]) => key === tag)
    .flatMap(([, values]) =>
      values
        .filter((post, i) => !post.includes(slug) && i < 6)
        .map((slug) => {
          const post = posts.find((post) => post.slug === slug);
          return {
            title: post.title,
            slug,
            date: post.date,
            updated: post.updated,
            excerpt: post.excerpt,
          };
        }),
    );

  // 奇数の場合は偶数に寄せる
  if (nextRead.length % 2 !== 0) {
    nextRead.pop();
  }

  return {
    props: {
      post: { ...post, segmentedTitle },
      nextRead,
    },
  };
};
