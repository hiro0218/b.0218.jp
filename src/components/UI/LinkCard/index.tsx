import { type AriaRole, type ComponentProps, type ReactNode, useMemo } from 'react';

import { PostDate } from '@/client/post';
import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { PostTagAnchorStyle } from '@/components/UI/Tag';
import { ICON_SIZE_SM, RxCaretRight } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
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
  const IconArrow = useMemo(
    () => (
      <Icon>
        <RxCaretRight size={ICON_SIZE_SM} />
      </Icon>
    ),
    [],
  );

  return (
    <Container role={role}>
      <Main>
        {!!date && <PostDate date={date} updated={updated} />}
        <Anchor href={link} passHref prefetch={false}>
          <Title>{title}</Title>
        </Anchor>
        <Paragraph {...(typeof excerpt !== 'string' && { as: 'div' })}>{!!excerpt && <span>{excerpt}</span>}</Paragraph>
        {!!tags && (
          <Tags>
            {tags.map((tag, index) => (
              <TagItem key={index}>{tag}</TagItem>
            ))}
          </Tags>
        )}
      </Main>
      {IconArrow}
    </Container>
  );
}

export default LinkCard;

const Icon = styled.div`
  position: absolute;
  top: 0;
  right: var(--space-½);
  bottom: 0;
  display: flex;
  align-items: center;
  color: var(--text-11);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  padding: var(--space-3);

  ${showHoverBackground}

  &:hover, &:focus-within {
    ${Icon} {
      opacity: 1;
    }
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--space-1);
  overflow: hidden;
  word-break: break-all;

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
  overflow: hidden;
  font-size: var(--font-size-sm);
  color: var(--text-11);
  text-overflow: ellipsis;
  letter-spacing: var(--letter-spacing-sm);
  white-space: nowrap;
`;

const Tags = styled.div`
  display: flex;
  gap: var(--space-1);
  margin-top: var(--space-1);
`;

const TagItem = styled.span`
  ${PostTagAnchorStyle}

  flex: 0;
`;
