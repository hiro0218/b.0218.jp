import type { GetStaticProps, InferGetStaticPropsType, PageConfig } from 'next';
import Head from 'next/head';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import type { PageProps } from '@/types/source';

interface Props {
  page: PageProps;
}

type AboutProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function About({ page }: AboutProps) {
  return (
    <>
      <Head>
        <link href={`${SITE_URL}/about`} rel="canonical" />
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
  head: { title: `サイトについて - ${SITE_NAME}` },
  title: {
    heading: 'About',
    paragraph: 'サイトと運営者について',
  },
});

export const config: PageConfig = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'about');

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
    },
  };
};
