import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useRef } from 'react';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PostEdit, PostHeader, PostNextRead, PostNote, PostShare } from '@/components/Page/Post';
import Mokuji from '@/components/Page/Post/Mokuji';
import { Adsense } from '@/components/UI/Adsense';
import { PageContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { AUTHOR, SITE } from '@/constant';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getPostsJson, getTermJson, getTermWithCount } from '@/lib/posts';
import { textSegmenter } from '@/lib/textSegmenter';
import { Post as PostType, TermsPostList } from '@/types/source';

type PostProps = {
  post: PostType & { segmentedTitle: string };
  nextRead: TermsPostList[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<Props> = ({ post, nextRead }) => {
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = `${SITE.URL}${post.slug}.html`;
  const description = getDescriptionText(post.content);

  useTwitterWidgetsLoad({ ref: refContent });

  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:url" property="og:url" content={permalink} />
        <meta key="og:title" property="og:title" content={post.title} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={description} />
        <meta key="og:updated_time" property="og:updated_time" content={post.updated || post.date} />
        <meta key="article:published_time" property="article:published_time" content={post.date} />
        <meta key="article:modified_time" property="article:modified_time" content={post.updated || post.date} />
        <meta
          key="og:image"
          property="og:image"
          content={`${SITE.URL}images/ogp/${post.slug}.webp?ts=${process.env.BUILD_ID}`}
        />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={AUTHOR.NAME} />
        <meta name="twitter:label2" content="Reading time" />
        <meta name="twitter:data2" content={post.readingTime} />
        {post.noindex ? <meta name="robots" content="noindex" /> : <link rel="canonical" href={permalink} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getBlogPostingStructured(post), getBreadcrumbStructured(post)]),
          }}
        />
      </Head>

      {post.content.includes('twitter-tweet') && (
        <Script strategy="lazyOnload" src="https://platform.twitter.com/widgets.js" />
      )}

      <PageContainer as="article">
        <Title heading={post.segmentedTitle}>
          <PostHeader date={post.date} updated={post.updated} readingTime={post.readingTime} tags={post.tags} />
        </Title>

        <PostNote note={post.note} />

        <Mokuji refContent={refContent} />

        <PostContent
          ref={refContent}
          itemProp="articleBody"
          dangerouslySetInnerHTML={{
            __html: `${post.content}`,
          }}
        />

        <Adsense />

        <PostShare title={post.title} url={permalink} />

        <PostEdit slug={post.slug} />

        <PostNextRead posts={nextRead} />
      </PageContainer>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getPostsJson();
  const paths = posts.map((post) => ({
    params: { slug: `${post.slug}.html` },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const posts = getPostsJson();
  const slug = (context.params.slug as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => {
    return post.slug === slug;
  });

  // tagsを件数順に並び替える
  post.tags =
    post.tags.length > 1
      ? getTermWithCount('tags')
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
  const tag = post.tags.at(0);
  const nextRead = Object.entries(getTermJson('tags'))
    .filter(([key]) => key === tag)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, val]) => val)
    .flat()
    .filter((post, i) => !post.slug.includes(slug) && i < 6);

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
