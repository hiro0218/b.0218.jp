import { AriaRole, ReactNode, useMemo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { convertDateToSimpleFormat } from '@/lib/date';
import { RxCaretRight } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  link: string;
  title: string;
  date?: string;
  excerpt?: ReactNode | string;
  role?: AriaRole;
}

const LinkCard = ({ link, title, date, excerpt, role }: Props) => {
  const IconArrow = useMemo(() => {
    return (
      <Icon className="icon">
        <RxCaretRight size={24} />
      </Icon>
    );
  }, []);

  return (
    <Container role={role}>
      <Main>
        <Anchor href={link} prefetch={false} passHref>
          <Title>{title}</Title>
        </Anchor>
        <Paragraph {...(typeof excerpt !== 'string' && { as: 'div' })}>
          {date && <time dateTime={date}>{convertDateToSimpleFormat(date)}</time>}
          {excerpt && <span>{excerpt}</span>}
        </Paragraph>
      </Main>
      {IconArrow}
    </Container>
  );
};

export default LinkCard;

const Container = styled.div`
  display: flex;
  height: 100%;
  padding: var(--space-2);
  padding-right: var(--space-1);
  border-radius: var(--border-radius-4);
  gap: var(--space-1);

  ${showHoverBackground}

  &:hover,
&:focus-within {
    .icon {
      opacity: 1;
    }
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  gap: var(--space-2);
`;

const Anchor = styled(_Anchor)`
  &::before {
    position: absolute;
    top: 0;
    left: 0;
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
  color: var(--text-12);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
`;

const Paragraph = styled.p`
  overflow: hidden;
  color: var(--text-11);
  font-size: var(--font-size-sm);
  letter-spacing: 0.025em;
  line-height: 1.4;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;

  time {
    &:not(:only-child) {
      &::after {
        content: ' — ';
      }
    }
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease-in-out;
  opacity: 0;
  color: var(--text-11);
`;
