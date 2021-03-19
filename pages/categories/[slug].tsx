import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import Layout from '@/components/Layout';
import { SITE } from '@/constant';
import styleHoverCard from '@/styles/Components/hover-card.module.css';
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
          {title} - {SITE.NAME}
        </title>
      </Head>

      <Layout>
        <section className="p-term">
          <section className="p-term-section">
            <header className="l-section-header">
              <h1 className="c-heading">{title}</h1>
            </header>

            <ul className="p-term-section__contents">
              {posts.map((post, index: number) => (
                <li key={index}>
                  <Link href={'/' + post.path}>
                    <a className={styleHoverCard['hover-card']}>
                      <h3 className={styleHoverCard['hover-card__title']}>{post.title}</h3>
                      <div className={styleHoverCard['hover-card__text']}>{post.excerpt}</div>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </Layout>
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
