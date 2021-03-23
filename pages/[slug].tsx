import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';
import React, { useEffect } from 'react';

import PageContainer from '@/components/layout/PageContainer';
import Pager from '@/components/Pager';
import PostDate from '@/components/PostDate';
import PostShare from '@/components/PostShare';
import PostTerm from '@/components/PostTerm';
import { AUTHOR, SITE } from '@/constant';
import { Archives, Post as PostType } from '@/types/source';
import filteredPost from '@/utils/filteredPost';
import { getBlogPostingStructured, getBreadcrumbStructured } from '@/utils/json-ld';
import { mokuji } from '@/utils/mokuji';

interface Props {
  post: PostType;
}

const getOgImagePath = (slug: string): string => {
  if (!slug) return '';

  const filename = slug.replace('.html', '');
  return slug ? `https://hiro0218.github.io/blog/images/ogp/${filename}.png` : AUTHOR.ICON;
};

const Post = ({ post }: Props) => {
  useEffect(() => {
    const postContent = document.querySelector<HTMLDivElement>('.js-post-content');
    mokuji(postContent);
    if (window.twttr) window.twttr.widgets.load(postContent);
  });

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
        <script async src="https://platform.twitter.com/widgets.js"></script>
      </Head>

      <PageContainer>
        <article className="p-post">
          <header className="l-section-header">
            <h1 className="c-heading">{post.title}</h1>
            <PostDate date={post.date} updated={post.updated} />
            <PostTerm categories={post.categories} tags={post.tags} />
          </header>

          <div
            className="p-post__content js-post-content"
            dangerouslySetInnerHTML={{
              __html: `${post.content}`,
            }}
          />
        </article>

        <div className="p-post__share">
          <PostShare title={post.title} url={SITE.URL + post.path} />
        </div>

        <div className="p-post__pager">
          <Pager next={post.next} prev={post.prev} />
        </div>
      </PageContainer>
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

  // SSG時に処理する
  postData.content = filteredPost(postData.content);

  return {
    props: {
      post: postData,
    },
  };
};
