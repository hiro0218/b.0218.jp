import type { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useMemo } from 'react';

import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import { AUTHOR_NAME, READ_TIME_SUFFIX } from '@/constant';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getOgpImage, getPermalink } from '@/lib/url';
import {
  Content as PostContent,
  Edit as PostEdit,
  Header as PostHeader,
  Note as PostNote,
  Share as PostShare,
} from '@/pages/[post]/_components';
import { PostSection } from '@/pages/_components/PostSection';
import { TagSection } from '@/pages/_components/TagSection';

import { createGetLayout } from '../_layouts/PostPageLayout';
import { getStaticPathsPost, getStaticPropsPost } from './_libs';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function PostPage({ post, similarPost, similarTags, recentPosts }: Props) {
  const { title, date, updated, slug, readingTime, note, noindex: isNoindex, content, tagsWithCount } = post;
  const hasTweet = content.includes('twitter-tweet');
  const permalink = getPermalink(slug);
  const description = getDescriptionText(content);
  const ShareComponent = useMemo(() => <PostShare title={title} url={permalink} />, [permalink, title]);

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
        <meta name="robots" content="max-image-preview:large" />
        {isNoindex ? <meta content="noindex" name="robots" /> : <link href={permalink} rel="canonical" />}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([getBlogPostingStructured(post), getBreadcrumbStructured(post)]),
          }}
          type="application/ld+json"
        />
      </Head>
      {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      <Container size="small" space={false}>
        <Stack space={6}>
          <Stack as="article" space={4}>
            <PostHeader
              date={date}
              readingTime={readingTime}
              render={
                <>
                  {ShareComponent}
                  {!!note && <PostNote note={note} />}
                </>
              }
              tagsWithCount={tagsWithCount}
              title={title}
              updated={updated}
            />
            <PostContent content={content} />
            <Stack direction="horizontal" justify="space-between">
              {ShareComponent}
              <PostEdit slug={slug} />
            </Stack>
          </Stack>
          <Stack as="footer" space={5}>
            <TagSection
              as="aside"
              heading="関連タグ"
              headingLevel="h2"
              headingWeight="normal"
              isWideCluster={false}
              tags={similarTags}
            />
            <PostSection as="aside" heading="関連記事" headingLevel="h2" posts={similarPost} updateTarget="date" />
            <PostSection
              as="aside"
              heading="最新記事"
              headingLevel="h2"
              href="/archive"
              posts={recentPosts}
              updateTarget="date"
            />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

PostPage.getLayout = createGetLayout();

export const getStaticPaths = getStaticPathsPost;

export const getStaticProps = getStaticPropsPost;
