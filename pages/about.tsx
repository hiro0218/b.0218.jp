import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/Heading';
import PageContainer from '@/components/layout/PageContainer';
import { SITE } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Pages } from '@/types/source';

interface Props {
  page: Pages;
}

const About: NextPage<Props> = ({ page }) => {
  return (
    <>
      <Head>
        <title key="title">サイトについて - {SITE.NAME}</title>
      </Head>

      <PageContainer>
        <article className="p-post">
          <header>
            <Heading text={'About'} />
          </header>

          <div
            className="p-post__content"
            dangerouslySetInnerHTML={{
              __html: `${page.content}`,
            }}
          />
        </article>
      </PageContainer>
    </>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'about');

  return {
    props: {
      page,
    },
  };
};
