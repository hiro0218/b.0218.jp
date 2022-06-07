import Heading from '@/components/UI/Heading';
import { Columns, PageContentContainer, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { TermsPostList } from '@/types/source';

interface Props {
  posts?: Array<TermsPostList>;
  title: string;
  type: 'Tag';
}

const Term = ({ posts, title, type }: Props) => {
  return (
    <section>
      <header>
        <Heading text={type} textSide={`${posts.length}件`} />
      </header>
      <PageContentContainer>
        <Columns title={title}>
          <Stack space="calc(var(--margin-base) * 0.25)" role="list">
            {posts.map((post, index) => (
              <LinkCard
                key={index}
                link={`/${post.slug}.html`}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                role="listitem"
              />
            ))}
          </Stack>
        </Columns>
      </PageContentContainer>
    </section>
  );
};

export default Term;
