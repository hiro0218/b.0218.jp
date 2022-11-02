import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import PostContent from '@/components/Page/Post/Content';
import PostEdit from '@/components/Page/Post/Edit';
import PostHeader from '@/components/Page/Post/Header';
import { PostNextRead } from '@/components/Page/Post/NextRead';
import PostNote from '@/components/Page/Post/Note';
import PostShare from '@/components/Page/Post/Share';
import { Adsense } from '@/components/UI/Adsense';
import { PageContentContainer } from '@/components/UI/Layout';
import Mokuji from '@/components/UI/Mokuji';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
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
  const { asPath } = useRouter();
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = `${SITE.URL}${post.slug}.html`;
  const description = getDescriptionText(post.content);
  const cacheBusting = new Date(post?.updated || post.date).getTime();

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
        <meta
          key="og:image"
          property="og:image"
          content={`${SITE.URL}images/ogp/${post.slug}.png?ts=${cacheBusting}`}
        />
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
          <script async defer src="https://platform.twitter.com/widgets.js"></script>
        )}
      </Head>

      <PageContentContainer>
        <Title heading={post.segmentedTitle}>
          <PostHeader post={post} />
        </Title>

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

        <PostEdit slug={post.slug} />

        <PostNextRead posts={nextRead} />
      </PageContentContainer>
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
