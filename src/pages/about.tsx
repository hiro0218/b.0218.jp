import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Page } from '@/types/source';

interface Props {
  page: Page;
}

type AboutProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function About({ page }: AboutProps) {
  return (
    <>
      <Head>
        <link href={`${SITE.URL}/about`} rel="canonical" />
      </Head>
      <PostContent
        dangerouslySetInnerHTML={{
          __html: `${page.content}`,
        }}
      />
    </>
  );
}

About.getLayout = createGetLayout({
  head: { title: `サイトについて - ${SITE.NAME}` },
  title: {
    heading: 'About',
    paragraph: 'サイトと運営者について',
  },
});

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'about');

  return {
    props: {
      page,
    },
  };
};
