import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRef } from 'react';

import PagePost from '@/components/PagePost'
import Heading from '@/components/UI/Heading';
import { PageContentContainer } from '@/components/UI/Layout';
import Mokuji from '@/components/UI/Mokuji';
import { SITE } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Pages } from '@/types/source';

interface Props {
  page: Pages;
}

const About: NextPage<Props> = ({ page }) => {
  const refContent = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title key="title">サイトについて - {SITE.NAME}</title>
      </Head>

      <>
        <header>
          <Heading text={'About'} />
        </header>

        <PageContentContainer>
          <Mokuji refContent={refContent} />

          <PagePost
            ref={refContent}
            className="p-post__content"
            dangerouslySetInnerHTML={{
              __html: `${page.content}`,
            }}
          />
        </PageContentContainer>
      </>
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
