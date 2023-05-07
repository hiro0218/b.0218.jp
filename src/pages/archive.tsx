import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Columns, PageContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_NAME, SITE_URL } from '@/constant';
import { ArchiveProps, getStaticPropsArchive } from '@/server/archive';
import { Post as PropPost } from '@/types/source';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Archive({ archives, numberOfPosts }: Props) {
  return (
    <>
      <Head>
        <title key="title">{`Archive - ${SITE_NAME}`}</title>
        <link href={`${SITE_URL}/archive`} rel="canonical" />
      </Head>

      <PageContainer as="article">
        <Title heading="Archive" paragraph={`${numberOfPosts}件`} />

        {Object.keys(archives)
          .reverse()
          .map((year) => (
            <Columns key={year} title={`${year}年`}>
              <Stack space="half">
                {archives[year].map(({ slug, title, date, updated, excerpt, tags }: PropPost) => (
                  <LinkCard
                    date={date}
                    excerpt={excerpt}
                    key={slug}
                    link={`/${slug}.html`}
                    tags={tags}
                    title={title}
                    updated={updated}
                  />
                ))}
              </Stack>
            </Columns>
          ))}
      </PageContainer>
    </>
  );
}

export const config = {
  unstable_runtimeJS: false,
};

export const getStaticProps: GetStaticProps<ArchiveProps> = (context) => getStaticPropsArchive(context);
