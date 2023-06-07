import Head from 'next/head';

import PostContentStyle from '@/client/post/Content/style';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE_NAME, SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';

const pages = getPagesJson();
const { content } = pages.find((page) => page.slug === 'about');

export default function About() {
  return (
    <>
      <Head>
        <link href={`${SITE_URL}/about`} rel="canonical" />
      </Head>
      <div
        css={PostContentStyle}
        dangerouslySetInnerHTML={{
          __html: content,
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
