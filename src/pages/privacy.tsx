import { GetStaticProps } from 'next';
import Head from 'next/head';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { PageContainer } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Pages } from '@/types/source';

interface Props {
  page: Pages;
}

export default function About({ page }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`プライバシーポリシー - ${SITE.NAME}`}</title>
      </Head>

      <PageContainer as="article">
        <Title heading="Privacy" paragraph="プライバシーポリシー" />

        <PostContent
          dangerouslySetInnerHTML={{
            __html: `${page.content}`,
          }}
        />
      </PageContainer>
    </>
  );
}

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps = async () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'privacy');

  return {
    props: {
      page,
    },
  };
};
