import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';

import { Works } from '@/components/Page/Works';
import { PageContentContainer } from '@/components/UI/Layout';
import { SITE } from '@/constant';
import { githubPinnedItems } from '@/lib/getData';
import { GithubPinnedItems } from '@/types/source';

interface Props {
  pinnedItems: Array<GithubPinnedItems>;
}

const WorksPage: NextPage<Props> = ({ pinnedItems }) => {
  return (
    <>
      <Head>
        <title key="title">{`Works - ${SITE.NAME}`}</title>
      </Head>

      <PageContentContainer>
        <Works.Title />
        <Works.Lists items={pinnedItems} />
      </PageContentContainer>
    </>
  );
};

export default WorksPage;

export const getStaticProps: GetStaticProps = async () => {
  const pinnedItems = githubPinnedItems();

  return {
    props: {
      pinnedItems,
    },
  };
};
