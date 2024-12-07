import type { AriaRole, ComponentProps, ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { PostTagAnchorStyle } from '@/components/UI/Tag';
import { easeOutExpo } from '@/ui/foundation/easing';
import { isContainer } from '@/ui/lib/mediaQuery';
import { lineClamp, textEllipsis } from '@/ui/mixin';
import { styled } from '@/ui/styled';

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
};

function LinkCard({ link, title, date, updated, excerpt, tags, role, titleTagName = 'h3' }: Props) {
  return (
    <Container role={role}>
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

const Container = styled.article`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: calc(var(--space-3) * 0.85);
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  contain: layout style paint;
  word-break: break-all;
  background-color: var(--white);
  border-radius: var(--border-radius-8);
  box-shadow: inset var(--shadow-3);
  transition:
    box-shadow 0.4s ${easeOutExpo},
    padding 0.4s ${easeOutExpo};

  ${isContainer['@3xl']} {
    padding: var(--space-3);
  }

  &:hover,
  &:focus-visible {
    box-shadow: inset var(--shadow-4);
  }

  &:active {
    box-shadow: inset var(--shadow-3);
  }

  time {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-xs);
    color: var(--color-gray-11);
  }
`;

const Anchor = styled(_Anchor)`
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: var(--zIndex-base);
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
  }

  &:hover,
  &:focus-visible {
    text-decoration-line: underline;
    text-decoration-color: var(--color-gray-8);
    text-underline-offset: 4%;
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
  font-size: var(--font-size-xs);
`;

const TagItem = styled.span`
  ${PostTagAnchorStyle}

  padding:  var(--space-½) var(--space-1);
`;
