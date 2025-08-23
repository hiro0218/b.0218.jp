import type { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { css, cx, styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components';
import { textEllipsis } from '@/ui/styled/utilities';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  excerpt?: ReactNode | string;
  date: PostDateProps['date'];
  updated: PostDateProps['updated'];
  tags?: string[];
  prefetch?: boolean;
};

function LinkCard({ link, title, date, updated, excerpt, tags, titleTagName = 'h3', prefetch = false }: Props) {
  const Title = titleTagName;

  return (
    <Container>
      <PostDate date={date} updated={updated} />
      <Anchor className={anchorStyle} href={link} prefetch={prefetch}>
        <Title className={cx('line-clamp-2', titleStyle)}>{title}</Title>
      </Anchor>
      {!!excerpt && (
        <Paragraph className={textEllipsis} {...(typeof excerpt !== 'string' && { as: 'div' })}>
          {excerpt}
        </Paragraph>
      )}
      {!!tags && (
        <Tags>
          {tags.map((tag) => (
            <TagItem className={postTagAnchor} key={tag}>
              {tag}
            </TagItem>
          ))}
        </Tags>
      )}
    </Container>
  );
}

export default LinkCard;

const Container = styled.article`
  --container-space: var(--spacing-3);
  --hover-color: var(--colors-accent-10);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  contain-intrinsic-size: 0 200px;
  padding: var(--container-space);
  contain: layout style;
  content-visibility: auto;
  word-break: break-all;
  background-color: var(--colors-white);
  border-radius: var(--radii-4);
  box-shadow: 0 0 0 1px var(--colors-gray-4);
  transition: box-shadow 0.2s;

  @media (--isMobile) {
    --container-space: var(--spacing-2);
  }

  @container (max-width: 480px) {
    --container-space: var(--spacing-2);
  }

  &:hover,
  &:focus,
  &:focus-within {
    box-shadow: 0 0 0 1px var(--hover-color);
  }

  &:active {
    box-shadow: 0 0 0 2px var(--hover-color);
  }

  time {
    font-size: var(--font-sizes-sm);
    line-height: var(--line-heights-xs);
    color: var(--colors-gray-10);
  }
`;

const anchorStyle = css`
  &::before {
    position: absolute;
    inset: 0;
    z-index: var(--z-index-base);
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
  }

  &:hover {
    & > * {
      color: var(--hover-color);
    }
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const titleStyle = css`
  font-size: var(--font-sizes-sm);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-12);
  transition: color 0.4s;
`;

const Paragraph = styled.p`
  color: var(--colors-gray-11);
  letter-spacing: var(--letter-spacings-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--spacing-1);
  margin-top: auto;
  overflow: clip;
  mask-image: linear-gradient(to right, transparent, #000 0, #000 calc(100% - 2em), transparent);

  @container (max-width: 480px) {
    display: none;
  }
`;

const TagItem = styled.span`
  padding: var(--spacing-½) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  border-radius: var(--radii-4);
`;
