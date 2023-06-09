import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';

import {
  Content as PostContent,
  Edit as PostEdit,
  Header as PostHeader,
  Note as PostNote,
  Share as PostShare,
} from '@/client/post';
import { Post as SimilarPost, Tag as SimilarTag } from '@/client/post/Similar';
import { Adsense } from '@/components/UI/Adsense';
import { PageContainer } from '@/components/UI/Layout';
import { AUTHOR_NAME, READ_TIME_SUFFIX } from '@/constant';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getOgpImage, getPermalink } from '@/lib/url';
import { getStaticPathsPost, getStaticPropsPost, type PostPageProps } from '@/server/post';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function PostPage({ post, similarPost, similarTags }: Props) {
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
  const permalink = getPermalink(slug);
  const description = getDescriptionText(content);

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
      </Head>
      {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      <PageContainer as="article">
        <PostHeader
          date={date}
          readingTime={readingTime}
          tagsWithCount={tagsWithCount}
          title={segmentedTitle}
          updated={updated}
        />
        <PostNote note={note} />
        <PostContent content={content} />
        <Adsense />
        <PostShare title={title} url={permalink} />
        <PostEdit slug={slug} />
        <SimilarTag tags={similarTags} />
        <SimilarPost posts={similarPost} />
      </PageContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = (context) => getStaticPathsPost(context);

export const getStaticProps: GetStaticProps<PostPageProps> = (context) => getStaticPropsPost(context);
