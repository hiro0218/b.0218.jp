import { type AriaRole, type ComponentProps, type ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { PostTagAnchorStyle } from '@/components/UI/Tag';
import { showHoverBackground, textEllipsis } from '@/ui/mixin';
import { styled } from '@/ui/styled';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  excerpt?: ReactNode | string;
  date: PostDateProps['date'];
  updated: PostDateProps['updated'];
  tags?: string[];
  role?: AriaRole;
};

function LinkCard({ link, title, date, updated, excerpt, tags, role }: Props) {
  return (
    <Container role={role}>
      {!!date && <PostDate date={date} updated={updated} />}
      <Anchor href={link} passHref prefetch={false}>
        <Title>{title}</Title>
      </Anchor>
      <Paragraph {...(typeof excerpt !== 'string' && { as: 'div' })}>{!!excerpt && <span>{excerpt}</span>}</Paragraph>
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
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--space-1);
  padding: var(--space-3);
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  contain: layout style paint;
  overflow: hidden;
  word-break: break-all;

  ${showHoverBackground}

  time {
    font-size: var(--font-size-sm);
    line-height: 1.1;
    color: var(--text-11);
  }
`;

const Anchor = styled(_Anchor)`
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const Title = styled.h3`
  display: -webkit-box;
  overflow: hidden;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-12);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const Paragraph = styled.p`
  ${textEllipsis}

  font-size: var(--font-size-sm);
  color: var(--text-11);
  letter-spacing: var(--letter-spacing-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-top: var(--space-1);
`;

const TagItem = styled.span`
  ${PostTagAnchorStyle}
`;
