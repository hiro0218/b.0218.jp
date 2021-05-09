import fs from 'fs-extra';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import path from 'path';

import Heading from '@/components/Heading';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import PageContainer from '@/components/layout/PageContainer';
import LinkCard from '@/components/LinkCard';
import { SITE } from '@/constant';
import { TermsPostLits } from '@/types/source';

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
                  <LinkCard link={`/${post.slug}.html`} title={post.title} date={post.date} excerpt={post.excerpt} />
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
  const dataPath = path.join(process.cwd(), 'dist/tags.json');
  const posts = fs.readJsonSync(dataPath);
  const paths = Object.keys(posts).map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const dataPath = path.join(process.cwd(), 'dist/tags.json');
  const posts = fs.readJsonSync(dataPath);
  const slug = context.params.slug as string;

  return {
    props: {
      title: slug,
      posts: posts[slug],
    },
  };
};
