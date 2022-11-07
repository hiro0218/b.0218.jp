import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PageContentContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
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
        <title key="title">{`サイトについて - ${SITE.NAME}`}</title>
      </Head>

      <PageContentContainer>
        <Title heading="About" />

        <PostContent
          className="p-post__content"
          dangerouslySetInnerHTML={{
            __html: `${page.content}`,
          }}
        />
      </PageContentContainer>
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
