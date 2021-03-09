import { GetStaticProps, GetStaticPaths } from "next";
import fs from "fs-extra";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import { SITE } from "../../constant";

const Categories = ({ title, posts }) => {
  return (
    <>
      <Head>
        <title key="title">
          {title} - {SITE.NAME}
        </title>
      </Head>

      <Layout>
        <ul>
          {posts.map((post, index: number) => (
            <li key={index}>
              <Link href={"/" + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Categories;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), "_source/categories.json");
  const posts = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => `/${post.path}`);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), "_source/categories_posts.json");
  const posts = fs.readJsonSync(dataPath);
  const slug = context.params.slug;

  const postData = posts.filter((post) => {
    return post.slug === slug;
  });

  return {
    props: {
      title: postData[0].name,
      posts: postData[0].posts,
    },
  };
};
