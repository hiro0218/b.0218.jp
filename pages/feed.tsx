import { GetServerSidePropsContext } from 'next';
import RSS from 'rss';

import { SITE } from '@/constant';
import { getPostsJson } from '@/lib/posts';
import { Post } from '@/types/source';

async function generateFeedXml(posts: Array<Post>) {
  const feed = new RSS({
    title: `${SITE.NAME}`,
    description: `${SITE.DESCRIPTION}`,
    site_url: `${SITE.URL}`,
    feed_url: `${SITE.URL}feed`,
    language: 'ja',
    hub: 'https://pubsubhubbub.appspot.com/',
  });

  posts?.forEach((post, i) => {
    if (i < 30) {
      feed.item({
        title: post.title,
        description: post.excerpt,
        date: new Date(post.date),
        url: `${SITE.URL}${post.slug}.html`,
      });
    }
  });

  return feed.xml();
}

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const posts = getPostsJson();
  const xml = await generateFeedXml(posts);

  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // 24時間キャッシュする
  res.setHeader('Content-Type', 'text/xml');
  res.end(xml);

  return {
    props: {},
  };
};

const Page = () => null;
export default Page;
