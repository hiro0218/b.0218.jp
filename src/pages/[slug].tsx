import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import PostContent from '@/components/Page/Post/Content';
import { PostNextRead } from '@/components/Page/Post/NextRead';
import { Adsense } from '@/components/UI/Adsense';
import { PageContentContainer } from '@/components/UI/Layout';
import { getPostsJson, getTermJson, getTermWithCount } from '@/lib/posts';
const PostShare = dynamic(() => import('@/components/Page/Post/Share'));
const PostNote = dynamic(() => import('@/components/Page/Post/Note'));
const PostEdit = dynamic(() => import('@/components/Page/Post/Edit'));
import PostHeader from '@/components/Page/Post/Header';
import Mokuji from '@/components/UI/Mokuji';
import { Profile } from '@/components/UI/Profile';
import { SITE } from '@/constant';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { Post as PostType, TermsPostList } from '@/types/source';

type PostProps = {
  post: PostType;
  nextRead: TermsPostList[];
};
type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Post: NextPage<Props> = ({ post, nextRead }) => {
  const { asPath } = useRouter();
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = `${SITE.URL}${post.slug}.html`;
  const description = getDescriptionText(post.content);

  useEffect(() => {
    window?.twttr?.widgets.load(refContent.current);
  }, [asPath]);

  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
        <meta key="description" name="description" content={description} />
        <meta key="og:url" property="og:url" content={permalink} />
        <meta key="og:title" property="og:title" content={post.title} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={description} />
        {post.updated && <meta key="og:updated_time" property="og:updated_time" content={post.updated} />}
        <meta key="article:published_time" property="article:published_time" content={post.date} />
        {post.updated && <meta key="article:modified_time" property="article:modified_time" content={post.updated} />}
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

      <header>
        <PostHeader post={post} />
      </header>

      <PageContentContainer>
        <PostNote note={post.note} />

        <Adsense />

        <Mokuji refContent={refContent} />

        <PostContent
          ref={refContent}
          className="p-post__content"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{
            __html: `${post.content}`,
          }}
        />

        <PostShare title={post.title} url={permalink} />

        <Profile />

        <PostEdit slug={post.slug} />
      </PageContentContainer>

      <PostNextRead posts={nextRead} />
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
  const slug = context.params.slug as string;

  // slug に一致する post を取得
  const post = posts.find((post) => {
    return post.slug === slug.replace('.html', '');
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

  // 関連記事
  const tag = post.tags.at(0);
  const nextRead = Object.entries(getTermJson('tags'))
    .filter(([key]) => key === tag)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, val]) => val)
    .flat()
    .filter((post, i) => !post.slug.includes(slug) && i < 6);

  return {
    props: {
      post,
      nextRead,
    },
  };
};
