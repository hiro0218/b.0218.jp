import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useRef } from 'react';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PostEdit, PostHeader, PostNote, PostShare, PostSimilar, TagSimilar } from '@/components/Page/Post';
import Mokuji from '@/components/Page/Post/Mokuji';
import { Adsense } from '@/components/UI/Adsense';
import { PageContainer } from '@/components/UI/Layout';
import { AUTHOR_NAME, READ_TIME_SUFFIX } from '@/constant';
import useTwitterWidgetsLoad from '@/hooks/useTwitterWidgetsLoad';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getOgpImage, getPermalink } from '@/lib/url';
import { getStaticPathsPost, getStaticPropsPost, PostPageProps } from '@/server/[slug]';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Post({ post, similarPost, similarTags }: Props) {
  const {
    title,
    date,
    updated,
    slug,
    readingTime,
    note,
    segmentedTitle,
    noindex: isNoindex,
    content,
    tagsWithCount,
  } = post;
  const hasTweet = content.includes('twitter-tweet');
  const refContent = useRef<HTMLDivElement>(null);
  const permalink = getPermalink(post.slug);
  const description = getDescriptionText(post.content);

  useTwitterWidgetsLoad({ ref: refContent });

  return (
    <>
      <Head>
        <title key="title">{title}</title>
        <meta content={description} key="description" name="description" />
        <meta content={permalink} key="og:url" property="og:url" />
        <meta content={title} key="og:title" property="og:title" />
        <meta content="article" key="og:type" property="og:type" />
        <meta content={description} key="og:description" property="og:description" />
        <meta content={updated || date} key="og:updated_time" property="og:updated_time" />
        <meta content={date} key="article:published_time" property="article:published_time" />
        <meta content={updated || date} key="article:modified_time" property="article:modified_time" />
        <meta content={`${getOgpImage(slug)}?ts=${process.env.BUILD_ID}`} key="og:image" property="og:image" />
        <meta content="summary_large_image" key="twitter:card" name="twitter:card" />
        <meta content="Written by" name="twitter:label1" />
        <meta content={AUTHOR_NAME} name="twitter:data1" />
        <meta content="Reading time" name="twitter:label2" />
        <meta content={`${readingTime} ${READ_TIME_SUFFIX}`} name="twitter:data2" />
        {isNoindex ? <meta content="noindex" name="robots" /> : <link href={permalink} rel="canonical" />}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getBlogPostingStructured(post), getBreadcrumbStructured(post)]),
          }}
          type="application/ld+json"
        />
        {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      </Head>
      <PageContainer as="article">
        <PostHeader
          date={date}
          readingTime={readingTime}
          tagsWithCount={tagsWithCount}
          title={segmentedTitle}
          updated={updated}
        />
        <PostNote note={note} />
        <Mokuji refContent={refContent} />
        <PostContent
          dangerouslySetInnerHTML={{
            __html: content,
          }}
          itemProp="articleBody"
          ref={refContent}
        />
        <Adsense />
        <PostShare title={title} url={permalink} />
        <PostEdit slug={slug} />
        <TagSimilar tags={similarTags} />
        <PostSimilar posts={similarPost} />
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = (context) => getStaticPathsPost(context);

export const getStaticProps: GetStaticProps<PostPageProps> = (context) => getStaticPropsPost(context);
