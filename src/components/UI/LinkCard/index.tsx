import type { AriaRole, ComponentProps, ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { PostTagAnchorStyle } from '@/components/UI/Tag';
import { easeOutExpo } from '@/ui/foundation/easing';
import { isContainer } from '@/ui/lib/mediaQuery';
import { lineClamp, textEllipsis } from '@/ui/mixin';
import { css, styled } from '@/ui/styled';

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
  return (
    <Container role={role} showNewLabel={showNewLabel}>
      <PostDate date={date} updated={updated} />
      <Anchor href={link} prefetch={false}>
        <Title as={titleTagName}>{title}</Title>
      </Anchor>
      {!!excerpt && <Paragraph {...(typeof excerpt !== 'string' && { as: 'div' })}>{excerpt}</Paragraph>}
      {!!tags && (
        <Tags>
          {tags.map((tag) => (
            <TagItem key={tag}>{tag}</TagItem>
          ))}
        </Tags>
      )}
    </Container>
  );
}

export default LinkCard;

const Container = styled.article<Pick<Props, 'showNewLabel'>>`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: calc(var(--space-3) * 0.85);
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  contain: layout style;
  word-break: break-all;
  background-color: var(--white);
  border-radius: var(--border-radius-8);
  box-shadow: var(--shadows-sm);
  transition:
    box-shadow 0.4s ${easeOutExpo},
    padding 0.4s ${easeOutExpo};

  ${isContainer['@3xl']} {
    padding: var(--space-3);
  }

  ${({ showNewLabel }) =>
    showNewLabel &&
    css`
      &::before {
        position: absolute;
        top: 0;
        right: 0;
        display: grid;
        place-content: center;
        padding: var(--space-½) var(--space-1);
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        line-height: 1;
        color: var(--white);
        content: 'NEW';
        background-color: var(--color-gray-12);
        isolation: isolate;
        border-bottom-left-radius: var(--border-radius-8);
      }
    `}

  &:hover,
  &:focus-visible {
    box-shadow: var(--shadows-md);
  }

  &:active {
    box-shadow: var(--shadows-sm);
  }

  time {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-xs);
    color: var(--color-gray-11);
  }
`;

const Anchor = styled(_Anchor)`
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

  &:hover,
  &:focus-visible {
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: var(--color-gray-7);
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const Title = styled.h3`
  ${lineClamp(2)}

  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-md);
  color: var(--color-gray-12);
`;

const Paragraph = styled.p`
  ${textEllipsis}

  color: var(--color-gray-11);
  letter-spacing: var(--letter-spacing-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-top: auto;
  overflow: clip;
`;

const TagItem = styled.span`
  ${PostTagAnchorStyle}

  padding: var(--space-½) var(--space-1);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-4);
`;
