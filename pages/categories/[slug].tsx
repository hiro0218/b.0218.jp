import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';

import HoverCard from '@/components/HoverCard';
import PageContainer from '@/components/layout/PageContainer';
import { SITE } from '@/constant';
import { Terms, TermsPostLits } from '@/types/source';

interface Props {
  title: string;
  posts: Array<TermsPostLits>;
}

const Categories = ({ title, posts }: Props) => {
  return (
    <>
      <Head>
        <title key="title">
          category: {title} - {SITE.NAME}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <PageContainer>
        <section className="p-term">
          <section className="p-term-section">
            <header className="l-section-header">
              <h1 className="c-heading">{title}</h1>
              <span className="c-heading-sub">category</span>
            </header>

            <ul className="l-menu-list p-term-section__contents">
              {posts.map((post, index) => (
                <li key={index} className="l-menu-list__item">
                  <HoverCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </li>
              ))}
            </ul>
          </section>
        </section>
      </PageContainer>
    </>
  );
};

export default Categories;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), '_source/categories.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), '_source/categories_posts.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
  const slug = context.params.slug;

  const postData = posts.filter((post: Terms) => {
    return post.slug === slug;
  });

  return {
    props: {
      title: postData[0].name,
      posts: postData[0].posts,
    },
  };
};
