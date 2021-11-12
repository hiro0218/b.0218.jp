import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Heading from '@/components/Heading';
import { Stack } from '@/components/layout/Stack';
import LinkCard from '@/components/LinkCard';
import { getPostsJson, getTermJson } from '@/lib/posts';
import { Post as PropsPost } from '@/types/source';

interface Props {
  recentPosts: Array<PropsPost>;
  updatesPosts: Array<PropsPost>;
  tags: { [key: string]: number };
}

const Home: NextPage<Props> = ({ recentPosts, updatesPosts, tags }) => {
  return (
    <>
      <Head>
        <meta name="thumbnail" content="https://b.0218.jp/hiro0218.png" />
      </Head>

      <header>
        <Heading text={'Home'} />
      </header>
      <section className="p-home">
        <section className="p-home-section">
          <header>
            <Heading tagName={'h2'} text={'Recent Articles'} isWeightNormal={true} />
          </header>
          <div className="p-home-section__contents">
            <Stack direction="column" gap="calc(var(--margin-base) * 0.25) 0" role="list">
              {recentPosts.map((post, index) => (
                <Stack.Item key={index} display="block" role="listitem">
                  <LinkCard
                    link={`${post.slug}.html`}
                    title={post.title}
                    date={post.updated || post.date}
                    excerpt={post.excerpt}
                  />
                </Stack.Item>
              ))}
            </Stack>
          </div>
        </section>

        <section className="p-home-section">
          <header>
            <Heading tagName={'h2'} text={'Updated Articles'} isWeightNormal={true} />
          </header>
          <div className="p-home-section__contents">
            <Stack direction="column" gap="calc(var(--margin-base) * 0.25) 0" role="list">
              {updatesPosts.map((post, index) => (
                <Stack.Item key={index} display="block" role="listitem">
                  <LinkCard
                    link={`${post.slug}.html`}
                    title={post.title}
                    date={post.updated || post.date}
                    excerpt={post.excerpt}
                  />
                </Stack.Item>
              ))}
            </Stack>
          </div>
        </section>

        <section className="p-home-section">
          <header>
            <Heading tagName={'h2'} text={'Tags'} isWeightNormal={true} />
          </header>
          <div className="p-home-section__contents">
            <Stack wrap="wrap" gap="calc(var(--margin-base) * 0.5) calc(var(--margin-base) * 0.25)" role="list">
              {Object.entries(tags).map(([slug, number]) => {
                return (
                  <Stack.Item align="center" key={slug} role="listitem">
                    <div className="c-post-meta-tag">
                      <Link href={'/tags/' + slug} prefetch={false}>
                        <a className="c-post-meta__link--tag" title={`${slug}: ${number}件`}>
                          {slug}
                        </a>
                      </Link>
                    </div>
                  </Stack.Item>
                );
              })}
            </Stack>
          </div>
        </section>
      </section>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const posts = getPostsJson();
  const recentPosts = posts.filter((_, i) => i < 5);
  const updatesPosts = posts
    .sort((a, b) => {
      return a.updated < b.updated ? 1 : -1;
    })
    .filter((post) => post.date < post.updated)
    .filter((post) => {
      // recentPosts に含まれているものは除外する
      return !recentPosts.filter((recentPost) => post.slug === recentPost.slug).length;
    })
    .filter((_, i) => i < 5);

  const tags = Object.fromEntries(
    Object.entries(getTermJson('tags'))
      .map(([key, val]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return [key, val.length];
      })
      .sort((a, b) => b[1] - a[1]) // 件数の多い順にソート
      .filter((item, i) => item[1] >= 10 && i < 25), // 件数が10件以上を25個抽出
  );

  return {
    props: {
      recentPosts,
      updatesPosts,
      tags,
    },
  };
};
