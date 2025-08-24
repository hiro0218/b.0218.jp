import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/url';
import type { PostListProps } from '@/types/source';
import { css, styled } from '@/ui/styled';
import { textEllipsis } from '@/ui/styled/utilities';

type Props = {
  posts: PostListProps[];
  year: string;
};

export const Timeline = ({ posts, year }: Props) => {
  return (
    <Section>
      <Header>
        <Title id={`${year}年`}>{year}</Title>
        <span />
        <PostCount>{posts.length} posts</PostCount>
      </Header>
      <div>
        {posts.map(({ slug, title, date }: PostListProps) => {
          const link = convertPostSlugToPath(slug);
          return (
            <Anchor className={styleAnchor} href={link} key={slug}>
              <Date>{date.replace(`${year}/`, '')}</Date>
              <Separator />
              <span className={textEllipsis}>{title}</span>
            </Anchor>
          );
        })}
      </div>
    </Section>
  );
};

const Section = styled.section`
  --vertical-space: var(--spacing-3);
  --columns-1: 12%;
  --columns-2: 8%;
  --year-heading-height: var(--spacing-5);
  --year-heading-circle-color: var(--colors-gray-8);
  --year-heading-separator-size: var(--spacing-2);
  --year-post-separator-size-h: var(--spacing-1);
  --year-post-separator-size-w: var(--spacing-1);
  --year-post-separator-color: var(--colors-gray-7);
  --year-post-separator-border-radius: var(--radii-full);

  @media (--isMobile) {
    --columns-1: 16%;
  }

  position: relative;
  gap: var(--spacing-1);

  /* Separator */
  &::before {
    position: absolute;
    inset: 0;
    left: calc(var(--columns-1) + var(--columns-2) / 2);
    z-index: -1;
    width: 2px;
    margin-top: var(--vertical-space);
    color: var(--colors-gray-7);
    pointer-events: none;
    content: '';
    background-image: repeating-linear-gradient(-45deg, currentColor, currentColor 1px, #0000 0 50%);
    background-size: 6px 6px;
    transform: translateX(-50%);
  }

  /* circle */
  &::after {
    position: absolute;
    inset: 0;
    top: var(--vertical-space);
    left: calc(var(--columns-1) + var(--columns-2) / 2);
    z-index: 1;
    display: block;
    width: var(--year-heading-separator-size);
    height: var(--year-heading-separator-size);
    content: '';
    background-color: var(--colors-white);
    border: 4px solid var(--year-heading-circle-color);
    border-radius: var(--radii-full);
    transform: translateX(-50%);
    transition: border 0.2s var(--easings-ease-out);
  }

  &:hover {
    --year-heading-circle-color: var(--colors-accent-8);
  }
`;

const Header = styled.header`
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: var(--columns-1) var(--columns-2) 1fr;
  align-items: center;
  height: var(--year-heading-height);
`;

const Title = styled.h2`
  padding-left: var(--spacing-1);
  font-size: var(--font-sizes-h3);
`;

const PostCount = styled.span`
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-10);
  text-align: right;
`;

const Date = styled.span`
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-10);
  text-align: center;
`;

const Separator = styled.span`
  width: var(--year-post-separator-size-w);
  height: var(--year-post-separator-size-h);
  margin: auto;
  background-color: var(--year-post-separator-color);
  border-radius: var(--year-post-separator-border-radius);
  transition: all 0.15s var(--easings-ease-out);
`;

const styleAnchor = css`
  position: relative;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: var(--columns-1) var(--columns-2) 1fr;
  align-items: center;
  width: 100%;
  padding-block: var(--spacing-1);
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-a-3);

    --year-post-separator-size-h: var(--spacing-3);
    --year-post-separator-size-w: var(--spacing-1);
    --year-post-separator-color: var(--colors-accent-8);
    --year-post-separator-border-radius: var(--radii-8);
  }

  &:active {
    background-color: var(--colors-gray-a-4);
  }
`;
