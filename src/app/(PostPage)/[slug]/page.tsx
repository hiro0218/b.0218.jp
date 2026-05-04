import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getMetadata } from '@/app/_metadata';
import { ScrollProgress } from '@/components/App/ScrollProgress';
import { StructuredData } from '@/components/Functional/StructuredData';
import { PostSection } from '@/components/Page/_shared/PostSection';
import { TagSection } from '@/components/Page/_shared/TagSection';
import { PostContent } from '@/components/Page/Post/Content';
import { PostEdit } from '@/components/Page/Post/Edit';
import { PostHeader } from '@/components/Page/Post/Header';
import { PostShare } from '@/components/Page/Post/Share';
import { Alert } from '@/components/UI/Alert';
import { Container } from '@/components/UI/Layout/Container';
import { Stack } from '@/components/UI/Layout/Stack';
import { AUTHOR_NAME } from '@/constants';
import { buildId } from '@/lib/config/environment';
import { getBlogPostingStructured, getBreadcrumbStructured, getDescriptionText } from '@/lib/domain/json-ld';
import { getPostsListJson } from '@/lib/source/post';
import { tagPath } from '@/lib/tag/navigation';
import { getOgpImage, getPermalink } from '@/lib/utils/url';
import { getPostPageData } from './_lib/services/getPostPageData';

type Params = Promise<{ slug: string }>;

const postsList = getPostsListJson();

export async function generateStaticParams() {
  return postsList.map((post) => ({
    slug: `${post.slug}.html`,
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug: _slug } = await params;
  const slug = _slug.replace('.html', '');
  const data = getPostPageData(slug);

  if (!data) {
    notFound();
  }

  const { title, content, noindex, meta, tagsWithCount } = data.post;
  const { publishedTime, modifiedTime } = meta;
  const permalink = getPermalink(slug);
  const description = getDescriptionText(content);
  const ogpImage = `${getOgpImage(slug)}${buildId ? `?ts=${buildId}` : ''}`;

  return getMetadata({
    title,
    description,
    url: permalink,
    openGraph: {
      type: 'article',
      images: [{ url: ogpImage }],
      section: tagsWithCount[0]?.slug,
      tags: tagsWithCount.map((tag) => tag.slug),
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
    },
    other: {
      label1: 'Written by',
      data1: AUTHOR_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      images: [{ url: ogpImage }],
    },
    robots: {
      'max-image-preview': 'large',
      ...(noindex === true && { index: false }),
    },
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug: _slug } = await params;
  const slug = _slug.replace('.html', '');
  const data = getPostPageData(slug);

  if (!data) {
    notFound();
  }

  const { post, similarPost, similarTags, recentPosts, sameTagPosts, mostPopularTag, popularity } = data;
  const { title, date, updated, note, content, tagsWithCount } = post;
  const hasTweet = content.includes('twitter-tweet');
  const permalink = getPermalink(slug);

  return (
    <>
      <ScrollProgress />
      <StructuredData data={[getBlogPostingStructured(post, popularity), getBreadcrumbStructured(post)]} />
      {hasTweet && <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />}
      <Container size="small" space={false}>
        <Stack gap={6}>
          <Stack as="article" gap={4}>
            <PostHeader
              date={date}
              render={
                <>
                  <PostShare title={title} url={permalink} />
                  {!!note && <Alert hideLabel={true} html={note} type="note" />}
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
          <Stack as="footer" gap={5}>
            <TagSection
              as="aside"
              heading="関連タグ"
              headingLevel="h2"
              headingWeight="normal"
              isWideCluster={false}
              tags={similarTags}
            />
            <PostSection as="aside" heading="関連記事" headingLevel="h2" posts={similarPost} />
            {mostPopularTag && sameTagPosts.length > 0 && (
              <PostSection
                as="aside"
                heading={`「${mostPopularTag.slug}」タグの記事`}
                headingLevel="h2"
                href={tagPath(mostPopularTag.slug)}
                posts={sameTagPosts}
                prefetch={false}
              />
            )}
            <PostSection as="aside" heading="最新記事" headingLevel="h2" href="/archive" posts={recentPosts} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
