import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import Adsense from '@/components/Adsense';
import { PageContentContainer } from '@/components/Layout';
import PagePost from '@/components/PagePost'
import { getPostsJson } from '@/lib/posts';
const PostPager = dynamic(() => import('@/components/PostPager'));
const PostShare = dynamic(() => import('@/components/post/share'));
const PostNote = dynamic(() => import('@/components/PostNote'));
import Mokuji from '@/components/Mokuji';
import PostHeader from '@/components/post/header';
import { SITE } from '@/constant';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { Post as PostType } from '@/types/source';

type PostProps = {
  post: PostType;
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<Props> = ({ post }) => {
  const { asPath } = useRouter();
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = `${SITE.URL}${post.slug}.html`;

  useEffect(() => {
    window?.twttr?.widgets.load(refContent.current);
  }, [asPath]);

  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
        <meta key="description" name="description" content={getDescriptionText(post.content)} />
        <meta key="og:url" property="og:url" content={permalink} />
        <meta key="og:title" property="og:title" content={post.title} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={getDescriptionText(post.content)} />
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
        {post.content.includes('twitter-tweet') && (
          <script async src="https://platform.twitter.com/widgets.js"></script>
        )}
      </Head>

      <PagePost>
        <header>
          <PostHeader post={post} />
        </header>

        <PageContentContainer>
          <PostNote note={post.note} />

          <Adsense />

          <Mokuji refContent={refContent} />

          <div
            ref={refContent}
            className="p-post__content"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{
              __html: `${post.content}`,
            }}
          />

          <div>
            <PostShare title={post.title} url={permalink} />
          </div>

          <div>
            <PostPager next={post.next} prev={post.prev} />
          </div>
        </PageContentContainer>
      </PagePost>
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
