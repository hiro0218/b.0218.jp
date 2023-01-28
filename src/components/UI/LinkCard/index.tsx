import { AriaRole, ReactNode, useMemo } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { convertDateToSimpleFormat } from '@/lib/date';
import { isMobile } from '@/ui/lib/mediaQuery';
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
        <HiOutlineChevronRight />
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
  padding: calc(var(--space-3) * 0.6);
  padding-left: var(--space-3);
  border-radius: 0.25rem;
  gap: calc(var(--space-3) * 0.25);

  ${isMobile} {
    padding: calc(var(--space-3) * 0.8);
  }

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
  gap: calc(var(--space-3) * 0.5);
`;

const Anchor = styled(_Anchor)`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &:focus-within {
    box-shadow: none;
  }
`;

const Title = styled.h3`
  color: var(--text-12);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  line-height: 1.875;
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

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
