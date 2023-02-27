import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Pages } from '@/types/source';

interface Props {
  page: Pages;
}

type AboutProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function About({ page }: AboutProps) {
  return (
    <PostContent
      dangerouslySetInnerHTML={{
        __html: `${page.content}`,
      }}
    />
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
