import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';

import Layout from '../components/layout';
import { SITE } from '../constant';
import { Pages } from '../types/source';

interface Props {
  page: Pages;
}

const About = ({ page }: Props) => {
  return (
    <>
      <Head>
        <title key="title">サイトについて - {SITE.NAME}</title>
      </Head>

      <Layout>
        <h1>{page.title}</h1>
        <div
          dangerouslySetInnerHTML={{
            __html: `${page.content}`,
          }}
        />
      </Layout>
    </>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async () => {
  const dataPath = path.join(process.cwd(), '_source/pages.json');
  const pages: Array<Pages> = fs.readJsonSync(dataPath);
  const postData = pages.find((page) => page.slug === 'about');

  return {
    props: {
      page: postData,
    },
  };
};
