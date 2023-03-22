import Head from 'next/head';

import Content from '@/components/Page/404/Content';

export default function Custom404() {
  return (
    <>
      <Head>
        <meta content="noindex" name="robots" />
      </Head>
      <Content />
    </>
  );
}
