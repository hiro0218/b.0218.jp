import fs from "fs-extra";
import path from "path";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/layout";

const Post = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>

      <Layout>
        <h1>{post.title}</h1>

        {post.categories.length !== 0 && (
          <ul>
            {post.categories.map((category, index) => (
              <li key={index}>
                <Link href={"/" + category.path}>{category.name}</Link>
              </li>
            ))}
          </ul>
        )}

        {post.tags.length !== 0 && (
          <ul>
            {post.tags.map((tag, index) => (
              <li key={index}>
                <Link href={"/" + tag.path}>{tag.name}</Link>
              </li>
            ))}
          </ul>
        )}

        <div
          dangerouslySetInnerHTML={{
            __html: `${post.content}`,
          }}
        />
      </Layout>
    </>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), "_source/archives.json");
  const posts = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => `/${post.path}`);

  return { paths, fallback: false };
};

export const getStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), "_source/posts.json");
  const posts = fs.readJsonSync(dataPath);
  const slug = context.params.post_slug;

  const postData = posts.find((post: { path: string }) => {
    return post.path === slug;
  });

  return {
    props: {
      post: postData,
    },
  };
};
