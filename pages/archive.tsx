import fs from 'fs-extra';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';

import Layout from '../components/layout';
import { SITE } from '../constant';

const Archive = ({ archives }) => {
  return (
    <>
      <Head>
        <title key="title">Archive - {SITE.NAME}</title>
      </Head>

      <Layout>
        <h1>Archive page</h1>
        <ul>
          {archives.map((archive, index: number) => (
            <li key={index}>
              <Link href={'/' + archive.path}>{archive.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Archive;

export const getStaticProps: GetStaticProps = async () => {
  const dataPath = path.join(process.cwd(), '_source/archives.json');
  const posts = fs.readJsonSync(dataPath);

  return {
    props: {
      archives: posts,
    },
  };
};
