import { FC } from 'react';

import Heading from '@/components/Heading';
import { MenuList, MenuListItem } from '@/components/layout/MenuList';
import LinkCard from '@/components/LinkCard';
import { TermsPostLits } from '@/types/source';

interface Props {
  posts?: Array<TermsPostLits>;
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
        <MenuList className="p-term-section__contents">
          {posts.map((post, index) => (
            <MenuListItem key={index}>
              <LinkCard link={`/${post.slug}.html`} title={post.title} date={post.date} excerpt={post.excerpt} />
            </MenuListItem>
          ))}
        </MenuList>
      </section>
    </section>
  );
};

export default Term;
