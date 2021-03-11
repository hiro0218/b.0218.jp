import { GetStaticProps } from "next";
import fs from "fs-extra";
import path from "path";
import Link from "next/link";
import Layout from "../components/layout";

const Home = ({ recentPosts, updatesPosts }) => {
  return (
    <>
      <Layout>
        <h2>Recent Articles</h2>
        <ul>
          {recentPosts.map((post, index: number) => (
            <li key={index}>
              <Link href={"/" + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <hr />
        <h2>Updated Articles</h2>
        <ul>
          {updatesPosts.map((post, index: number) => (
            <li key={index}>
              <Link href={"/" + post.path}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Layout>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const recentPostsPath = path.join(process.cwd(), "_source/recent_posts.json");
  const updatesPostsPath = path.join(
    process.cwd(),
    "_source/updates_posts.json"
  );
  const recentPosts = fs.readJsonSync(recentPostsPath);
  const updatesPosts = fs.readJsonSync(updatesPostsPath);

  return {
    props: {
      recentPosts,
      updatesPosts,
    },
  };
};
