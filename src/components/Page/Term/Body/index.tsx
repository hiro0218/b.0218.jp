import Head from 'next/head';

import PageTerm from '@/components/Page/Term';
import { SITE } from '@/constant';
import { TermsPostList } from '@/types/source';

type Props = {
  type: 'Tag';
  title: string;
  posts: Array<TermsPostList>;
};

const TermsBody = ({ type, title, posts }: Props) => {
  return (
    <>
      <Head>
        <title key="title">
          {type}: {title} - {SITE.NAME}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <PageTerm posts={posts} title={title} type={type} />
    </>
  );
};

export default TermsBody;
