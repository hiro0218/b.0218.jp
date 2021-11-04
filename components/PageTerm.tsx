import { FC } from 'react';

import Heading from '@/components/Heading';
import { Stack } from '@/components/layout/Stack';
import LinkCard from '@/components/LinkCard';
import { TermsPostList } from '@/types/source';

interface Props {
  posts?: Array<TermsPostList>;
  title: string;
  type: 'Category' | 'Tag';
}

const Term: FC<Props> = ({ posts, title, type }) => {
  return (
    <section className="p-term">
      <header>
        <Heading text={type} textSide={`${posts.length}件`} />
      </header>
      <section className="p-term-section">
        <header>
          <Heading tagName={'h2'} text={title} isWeightNormal={true} />
        </header>
        <Stack direction="column" gap="calc(var(--margin-base) * 0.25) 0" role="list">
          {posts.map((post, index) => (
            <Stack.Item key={index} display="block" role="listitem">
              <LinkCard link={`/${post.slug}.html`} title={post.title} date={post.date} excerpt={post.excerpt} />
            </Stack.Item>
          ))}
        </Stack>
      </section>
    </section>
  );
};

export default Term;
