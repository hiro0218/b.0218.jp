import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Container } from '@/components/Functional/Container';
import {
  Content as PostContent,
  Edit as PostEdit,
  Header as PostHeader,
  Note as PostNote,
  Share as PostShare,
} from '@/components/Page/Post';
import { PostSection } from '@/components/Page/Share/PostSection';
import { TagSection } from '@/components/Page/Share/TagSection';
import { Stack } from '@/components/UI/Layout';
import { AUTHOR_NAME, READ_TIME_SUFFIX } from '@/constant';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/json-ld';
import { getPostsJson } from '@/lib/posts';
import { getOgpImage, getPermalink } from '@/lib/url';
import { getData } from './lib/getData';

type Params = Promise<{ slug: string }>;

const posts = getPostsJson();

export async function generateStaticParams() {
  const paths = [];

  for (let i = 0; i < posts.length; i++) {
    paths.push({
      slug: `${posts[i].slug}.html`,
    });
  }

  return paths;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug: _slug } = await params;
  const slug = _slug.replace('.html', '');
  const data = getData(slug);
  const { title, content, noindex, readingTime, meta } = data.post;
  const { publishedTime, modifiedTime } = meta;
  const permalink = getPermalink(slug);
  const description = getDescriptionText(content);
  const ogpImage = `${getOgpImage(slug)}?ts=${process.env.BUILD_ID}`;

  return {
    title,
    description,
    openGraph: {
      url: permalink,
      title,
      description,
      type: 'article',
      images: [{ url: ogpImage }],
    },
    other: {
      // biome-ignore lint/style/useNamingConvention: key names should remain unchanged
      updated_time: modifiedTime || publishedTime,
      // biome-ignore lint/style/useNamingConvention: key names should remain unchanged
      published_time: publishedTime,
      // biome-ignore lint/style/useNamingConvention: key names should remain unchanged
      modified_time: modifiedTime || publishedTime,
      label1: 'Written by',
      data1: AUTHOR_NAME,
      label2: 'Reading time',
      data2: `${readingTime} ${READ_TIME_SUFFIX}`,
    },
    twitter: {
      card: 'summary_large_image',
      images: [{ url: ogpImage }],
    },
    robots: {
      ['max-image-preview']: 'large',
      ...(noindex === true && { index: true }),
    },
    alternates: {
      canonical: permalink,
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug: _slug } = await params;
  const slug = _slug.replace('.html', '');
  const data = getData(slug);

  if (!data) {
    notFound();
  }

  const { post, similarPost, similarTags, recentPosts } = data;
  const { title, date, updated, readingTime, note, content, tagsWithCount } = post;
  const hasTweet = content.includes('twitter-tweet');
  const permalink = getPermalink(slug);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([getBlogPostingStructured(post), getBreadcrumbStructured(post)]),
        }}
        type="application/ld+json"
      />
      {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      <Container size="small" space={false}>
        <Stack space={6}>
          <Stack as="article" space={4}>
            <PostHeader
              date={date}
              readingTime={readingTime}
              render={
                <>
                  <PostShare title={title} url={permalink} />
                  {!!note && <PostNote note={note} />}
                </>
              }
              tagsWithCount={tagsWithCount}
              title={title}
              updated={updated}
            />
            <PostContent content={content} />
            <Stack direction="horizontal" justify="space-between">
              <PostShare title={title} url={permalink} />
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
            {[
              {
                heading: '関連記事',
                posts: similarPost,
              },
              {
                heading: '最新記事',
                posts: recentPosts,
                href: '/archive',
                prefetch: true,
              },
            ].map(({ heading, posts, ...rest }, index) => (
              <PostSection key={index} as="aside" heading={heading} headingLevel="h2" posts={posts} {...rest} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
