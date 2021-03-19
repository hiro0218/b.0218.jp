import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import Layout from '@/components/Layout';
import { SITE } from '@/constant';
import styleHoverCard from '@/styles/Components/hover-card.module.css';
import { Archives } from '@/types/source';

interface Props {
  archives: Array<Archives>;
}

const Archive = ({ archives }: Props) => {
  return (
    <>
      <Head>
        <title key="title">Archive - {SITE.NAME}</title>
      </Head>

      <Layout>
        <article className="p-archive">
          <header>
            <h1 className="c-heading">Archive</h1>
          </header>

          <ul>
            {archives.map((archive, index: number) => (
              <li key={index}>
                <Link href={'/' + archive.path}>
                  <a className={styleHoverCard['hover-card']}>
                    <h2 className={styleHoverCard['hover-card__title']}>{archive.title}</h2>
                    <div className={styleHoverCard['hover-card__text']}>{archive.excerpt}</div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </Layout>
    </>
  );
};

export default Archive;

export const getStaticProps: GetStaticProps = async () => {
  const dataPath = path.join(process.cwd(), '_source/archives.json');
  const posts: Array<Archives> = fs.readJsonSync(dataPath);

  return {
    props: {
      archives: posts,
    },
  };
};
