import { GetStaticProps } from "next";
import fs from "fs-extra";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../constant";
import Layout from "../components/layout";

const Archive = ({ archives }) => {
  return (
    <>
      <Head>
        <title>Archive - {SITE.NAME}</title>
      </Head>

      <Layout>
        <h1>Archive page</h1>
        <ul>
          {archives.map((archive, index: number) => (
            <li key={index}>
              <Link href={"/" + archive.path}>{archive.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Archive;

export const getStaticProps: GetStaticProps = async () => {
  const dataPath = path.join(process.cwd(), "_source/archives.json");
  const posts = fs.readJsonSync(dataPath);

  return {
    props: {
      archives: posts,
    },
  };
};
