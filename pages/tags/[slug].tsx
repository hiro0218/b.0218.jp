import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';

import Heading from '@/components/Heading';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import PageContainer from '@/components/layout/PageContainer';
import LinkCard from '@/components/LinkCard';
import { SITE } from '@/constant';
import { Terms, TermsPostLits } from '@/types/source';

interface Props {
  title: string;
  posts: Array<TermsPostLits>;
}

const Tags = ({ title, posts }: Props) => {
  return (
    <>
      <Head>
        <title key="title">
          tag: {title}- {SITE.NAME}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <PageContainer>
        <section className="p-term">
          <section className="p-term-section">
            <header>
              <Heading text={title} descriptionText={'tag'} />
            </header>

            <MenuList className="p-term-section__contents">
              {posts.map((post, index) => (
                <MenuListItem key={index}>
                  <LinkCard link={'/' + post.path} title={post.title} date={post.date} excerpt={post.excerpt} />
                </MenuListItem>
              ))}
            </MenuList>
          </section>
        </section>
      </PageContainer>
    </>
  );
};

export default Tags;

export const getStaticPaths: GetStaticPaths = async () => {
  const dataPath = path.join(process.cwd(), '_source/tags.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), '_source/tags_posts.json');
  const posts: Array<Terms> = fs.readJsonSync(dataPath);
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
