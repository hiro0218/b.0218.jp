import { type AriaRole, type ComponentProps, type ReactNode } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { PostTagAnchorStyle } from '@/components/UI/Tag';
import { lineClamp, showHoverBackground, textEllipsis } from '@/ui/mixin';
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
      <Anchor href={link} passHref prefetch={false}>
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
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
  /* stylelint-disable */
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
  contain: layout style paint;
  /* stylelint-enable */
  word-break: break-all;

  ${showHoverBackground}

  time {
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
  ${lineClamp(2)}

  overflow: hidden;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-12);
`;

const Paragraph = styled.p`
  ${textEllipsis}

  color: var(--text-11);
  letter-spacing: var(--letter-spacing-sm);
`;

const Tags = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-top: auto;
`;

const TagItem = styled.span`
  ${PostTagAnchorStyle}
`;
