import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Adsense, { GOOGLE_ADSENSE } from '@/components/Adsense';
import PageContainer from '@/components/layout/PageContainer';
import { getPostsJson } from '@/lib/posts';
const PostPager = dynamic(() => import('@/components/PostPager'));
const PostShare = dynamic(() => import('@/components/post/share'));
import PostHeader from '@/components/post/header';
import { SITE } from '@/constant';
import { Post as PostType } from '@/types/source';
import { getBlogPostingStructured, getBreadcrumbStructured } from '@/utils/json-ld';
import { mokuji } from '@/utils/mokuji';

type PostProps = {
  post: PostType;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<Props> = ({ post }) => {
  const { asPath } = useRouter();
  const permalink = `${SITE.URL}${post.slug}.html`;

  useEffect(() => {
    const postContent = document.querySelector<HTMLDivElement>('.js-post-content');
    mokuji(postContent);
    if (window.twttr) window.twttr.widgets.load(postContent);
  }, [asPath]);

  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
        <meta key="description" name="description" content={post.excerpt} />
        <meta key="og:url" property="og:url" content={permalink} />
        <meta key="og:title" property="og:title" content={post.title} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={post.excerpt} />
        <meta key="og:updated_time" property="og:updated_time" content={post.updated} />
        <meta key="article:published_time" property="article:published_time" content={post.date} />
        <meta key="article:modified_time" property="article:modified_time" content={post.updated} />
        <meta key="og:image" property="og:image" content={`${SITE.URL}images/ogp/${post.slug}.png`} />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={permalink} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogPostingStructured(post)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbStructured(post)) }}
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE.CLIENT}`}
          crossOrigin="anonymous"
        ></script>
        {post.content.includes('twitter-tweet') && (
          <script async src="https://platform.twitter.com/widgets.js"></script>
        )}
      </Head>

      <PageContainer>
        <article className="p-post">
          <header>
            <PostHeader post={post} />
          </header>

          <Adsense />

          <div
            className="p-post__content js-post-content"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{
              __html: `${post.content}`,
            }}
          />
        </article>

        <div className="p-post__share">
          <PostShare title={post.title} url={permalink} />
        </div>

        <div className="p-post__pager">
          <PostPager next={post.next} prev={post.prev} />
        </div>
      </PageContainer>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getPostsJson();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const posts = getPostsJson();

  // next build: 拡張子が含まれていると出力できない
  // 拡張子がないとデータが取得できないため .html を付与する
  if (!context.params.slug.includes('.html')) {
    context.params.slug += '.html';
  }

  const slug = context.params.slug as string;

  const post = posts.find((post) => {
    return post.slug === slug.replace('.html', '');
  });

  return {
    props: {
      post,
    },
  };
};
