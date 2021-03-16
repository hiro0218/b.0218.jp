import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import Layout from '@/components/layout';
import { AUTHOR, SITE } from '@/constant';
import { Archives, Post as PostType } from '@/types/source';
import { getBlogPostingStructured, getBreadcrumbStructured } from '@/utils/json-ld';

interface Props {
  post: PostType;
}

const getOgImagePath = (slug: string): string => {
  if (!slug) return '';

  const filename = slug.replace('.html', '');
  return slug ? `https://hiro0218.github.io/blog/images/ogp/${filename}.png` : AUTHOR.ICON;
};

const Post = ({ post }: Props) => {
  return (
    <>
      <Head>
        <title key="title">
          {post.title} - {SITE.NAME}
        </title>
        <meta key="description" name="description" content={post.excerpt} />
        <meta key="og:url" property="og:url" content={SITE.URL + post.path} />
        <meta key="og:title" property="og:title" content={post.title} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:description" property="og:description" content={post.excerpt} />
        <meta key="og:updated_time" property="og:updated_time" content={post.updated} />
        <meta key="article:published_time" property="article:published_time" content={post.date} />
        <meta key="article:modified_time" property="article:modified_time" content={post.updated} />
        <meta key="og:image" property="og:image" content={getOgImagePath(post.path)} />
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={SITE.URL + post.path} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBlogPostingStructured(post)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbStructured(post)) }}
        />
      </Head>

      <Layout>
        <article>
          <h1>{post.title}</h1>

          {post.categories.length !== 0 && (
            <ul>
              {post.categories.map((category, index) => (
                <li key={index}>
                  <Link href={'/' + category.path}>{category.name}</Link>
                </li>
              ))}
            </ul>
          )}

          {post.tags.length !== 0 && (
            <ul>
              {post.tags.map((tag, index) => (
                <li key={index}>
                  <Link href={'/' + tag.path}>{tag.name}</Link>
                </li>
              ))}
            </ul>
          )}

          <div
            dangerouslySetInnerHTML={{
              __html: `${post.content}`,
            }}
          />
        </article>

        <div>
          <nav>
            <ul>
              {Object.keys(post.prev).length !== 0 && (
                <li>
                  <Link href={post.prev.path}>{post.prev.title}</Link>
                </li>
              )}
              {Object.keys(post.next).length !== 0 && (
                <li>
                  <Link href={post.next.path}>{post.next.title}</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </Layout>
    </>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), '_source/archives.json');
  const posts: Array<Archives> = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => ({
    // next build: 拡張子が含まれていると出力できない
    params: { slug: post.path.replace('.html', '') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), '_source/posts.json');
  const posts: Array<PostType> = fs.readJsonSync(dataPath);

  // next build: 拡張子が含まれていると出力できない
  // 拡張子がないとデータが取得できないため .html を付与する
  if (!context.params.slug.includes('.html')) {
    context.params.slug += '.html';
  }

  const postData: PostType = posts.find((post) => {
    return post.path === context.params.slug;
  });

  return {
    props: {
      post: postData,
    },
  };
};
