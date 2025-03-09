import type { AriaRole, ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { css, cx, styled } from '@/ui/styled/static';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  excerpt?: ReactNode | string;
  date: PostDateProps['date'];
  updated: PostDateProps['updated'];
  tags?: string[];
  role?: AriaRole;
  showNewLabel?: boolean;
};

function LinkCard({
  link,
  title,
  date,
  updated,
  excerpt,
  tags,
  role,
  titleTagName = 'h3',
  showNewLabel = false,
}: Props) {
  const Title = titleTagName;

  return (
    <Container role={role} {...(showNewLabel && { 'data-is-new': showNewLabel })}>
      <PostDate date={date} updated={updated} />
      <Anchor className={anchorStyle} href={link} prefetch={false}>
        <Title className={cx('line-clamp-2', titleStyle)}>{title}</Title>
      </Anchor>
      {!!excerpt && (
        <Paragraph className="text-ellipsis" {...(typeof excerpt !== 'string' && { as: 'div' })}>
          {excerpt}
        </Paragraph>
      )}
      {!!tags && (
        <Tags>
          {tags.map((tag) => (
            <TagItem className="post-tag-anchor" key={tag}>
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
  --container-space: var(--space-3);

  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--container-space);
  word-break: break-all;
  background-color: var(--white);
  border: 1px solid var(--color-gray-3A);
  border-radius: var(--border-radius-8);
  transition: background-color 0.4s var(--easing-ease-out-expo);
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  contain: layout style;

  @media (--isMobile) {
    --container-space: var(--space-2);
  }

  @container (max-width: 480px) {
    --container-space: var(--space-2);
  }

  &[data-is-new='true'] {
    @container (max-width: 480px) {
      display: none;
    }

    &::before {
      position: absolute;
      top: calc(var(--container-space) - var(--space-1));
      right: calc(var(--container-space) - var(--space-1));
      display: grid;
      place-content: center;
      padding: var(--space-½) var(--space-1);
      font-size: var(--font-size-xs);
      font-family: var(--font-family-monospace);
      line-height: 1;
      color: var(--white);
      content: 'NEW';
      background-color: var(--color-gray-11);
      border-radius: var(--border-radius-12);
      isolation: isolate;
    }
  }

  &:hover,
  &:focus,
  &:focus-within {
    background-color: var(--color-gray-2A);
  }

  &:active {
    background-color: var(--color-gray-3A);
  }

  time {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-xs);
    color: var(--color-gray-11);
  }
`;

const anchorStyle = css`
  transition: text-decoration-line 0.4s linear;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--zIndex-base);
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
    isolation: isolate;
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const titleStyle = css`
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-md);
  color: var(--color-gray-12);
`;

const Paragraph = styled.p`
  color: var(--color-gray-11);
  letter-spacing: var(--letter-spacing-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-top: auto;
  overflow: clip;

  @container (max-width: 480px) {
    display: none;
  }
`;

const TagItem = styled.span`
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-4);
`;
