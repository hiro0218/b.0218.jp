import Link from 'next/link';
import { AriaRole, ReactNode } from 'react';
import { HiOutlineChevronRight, HiOutlineExternalLink } from 'react-icons/hi';

import { convertDateToSimpleFormat } from '@/lib/date';
import { mobile } from '@/lib/mediaQuery';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  link: string;
  title: string;
  date?: string;
  excerpt?: ReactNode;
  target?: boolean;
  role?: AriaRole;
}

const LinkCard = ({ link, title, date, excerpt, target = false, role }: Props) => {
  return (
    <Link href={link} prefetch={false} passHref>
      <LinkCardAnchor {...(target && { target: '_blank' })} role={role}>
        <LinkCardText>
          <LinkCardTitle>{title}</LinkCardTitle>
          <LinkCardParagraph>
            {date && <time dateTime={date}>{convertDateToSimpleFormat(date)}</time>}
            {excerpt && <span>{excerpt}</span>}
          </LinkCardParagraph>
        </LinkCardText>
        <LinkCardIcon>{target ? <HiOutlineExternalLink /> : <HiOutlineChevronRight />}</LinkCardIcon>
      </LinkCardAnchor>
    </Link>
  );
};

export default LinkCard;

const LinkCardAnchor = styled.a`
  display: flex;
  height: 100%;
  padding: calc(var(--margin-base) * 0.6) var(--margin-base);
  border-radius: 0.25rem;
  gap: calc(var(--margin-base) * 0.25);

  ${mobile} {
    padding: var(--margin-base);
  }

  ${showHoverBackground}
`;

const LinkCardText = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
  gap: calc(var(--margin-base) * 0.5);
`;

const LinkCardTitle = styled.h3`
  color: var(--text-12);
  font-size: var(--font-size-md);
  font-weight: normal;
  line-height: 1.875;
`;

const LinkCardParagraph = styled.p`
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

const LinkCardIcon = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-11);

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
