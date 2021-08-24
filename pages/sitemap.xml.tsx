import { GetServerSidePropsContext } from 'next';

import { SITE } from '@/constant';
import { getPostsJson } from '@/lib/posts';
import { Post } from '@/types/source';

async function generateSitemapXml(posts: Array<Post>) {
  let xml = '';

  xml += `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  xml += `<url>`;
  xml += ` <loc>${SITE.URL}</loc>`;
  xml += ` <changefreq>daily</changefreq>`;
  xml += ` <priority>1</priority>`;
  xml += `</url>`;

  posts?.forEach((post) => {
    xml += `<url>`;
    xml += ` <loc>${SITE.URL}${post.slug}.html</loc>`;
    xml += ` <lastmod>${post.date}</lastmod>`;
    xml += ` <changefreq>weekly</changefreq>`;
    xml += ` <priority>0.6</priority>`;
    xml += `</url>`;
  });

  xml += `</urlset>`;

  return xml;
}

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const posts = getPostsJson();
  const xml = await generateSitemapXml(posts);

  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.setHeader('Content-Type', 'text/xml');
  res.end(xml);

  return {
    props: {},
  };
};

const Sitemap = () => null;
export default Sitemap;
