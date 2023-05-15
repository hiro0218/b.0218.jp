import { GetStaticProps, InferGetStaticPropsType, PageConfig } from 'next';

import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE_NAME } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import { Page } from '@/types/source';

interface Props {
  page: Page;
}

type PrivacyProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Privacy({ page }: PrivacyProps) {
  return (
    <PostContent
      dangerouslySetInnerHTML={{
        __html: `${page.content}`,
      }}
    />
  );
}

Privacy.getLayout = createGetLayout({
  head: { title: `プライバシーポリシー - ${SITE_NAME}` },
  title: {
    heading: 'Privacy',
    paragraph: 'プライバシーポリシー',
  },
});

export const config: PageConfig = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<Props> = () => {
  const pages = getPagesJson();
  const page = pages.find((page) => page.slug === 'privacy');

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
