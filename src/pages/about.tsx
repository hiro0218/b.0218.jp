import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import Heading from '@/components/Heading';
import { PageContentContainer } from '@/components/Layout';
import PagePost from '@/components/PagePost'
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

      <PagePost>
        <header>
          <Heading text={'About'} />
        </header>

        <PageContentContainer>
          <div
            className="p-post__content"
            dangerouslySetInnerHTML={{
              __html: `${page.content}`,
            }}
          />
        </PageContentContainer>
      </PagePost>
    </>
  );
};

export default About;

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps = async () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'about');

  return {
    props: {
      page,
    },
  };
};
