import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import PageContainer from '@/components/layout/PageContainer';
import { SITE } from '@/constant';
import styleHoverCard from '@/styles/Components/hover-card.module.css';
import { Archives } from '@/types/source';
import { convertDateToSimpleFormat } from '@/utils/date';

interface Props {
  archives: Array<Archives>;
}

const divideByYearArchive = (archives: Array<Archives>) => {
  const formatArchives = {};

  for (let i = 0; i < archives.length; i++) {
    const post = archives[i];

    // 日付を取得する
    const date = new Date(post.date);
    const year = date.getFullYear().toString() + ' ';

    // 配列で初期化
    if (!Array.isArray(formatArchives[year])) {
      formatArchives[year] = [];
    }

    formatArchives[year].push(post);
  }

  return formatArchives;
};

const Archive = ({ archives }: Props) => {
  const posts = divideByYearArchive(archives);

  return (
    <>
      <Head>
        <title key="title">Archive - {SITE.NAME}</title>
      </Head>

      <PageContainer>
        <article className="p-archive">
          <header className="l-section-header">
            <h1 className="c-heading">Archive</h1>
          </header>

          <section className="p-archive__contents">
            {Object.keys(posts).map((key: string) => {
              return (
                <div key={key} className="archive-list">
                  <div className="archive-year">
                    <h2 className="archive-year__title">{key}</h2>
                  </div>
                  <ul className="archive-post">
                    {posts[key].map((post: Archives, index: number) => {
                      return (
                        <li key={index}>
                          <Link href={'/' + post.path}>
                            <a className={styleHoverCard['hover-card']}>
                              <h2 className={styleHoverCard['hover-card__title']}>{post.title}</h2>
                              <div className={styleHoverCard['hover-card__text']}>
                                <time dateTime={post.date}>{convertDateToSimpleFormat(post.date)}: </time>
                                {post.excerpt}
                              </div>
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </section>
        </article>
      </PageContainer>
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
