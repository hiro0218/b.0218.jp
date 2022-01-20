import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi';

import { mobile } from '@/lib/mediaQuery';
import { convertDateToSimpleFormat } from '@/utils/date';

interface Props {
  link: string;
  title: string;
  date: string;
  excerpt?: string;
  target?: boolean;
}

const LinkCard: FC<Props> = ({ link, title, date, excerpt, target = false }) => {
  return (
    <Link href={link} prefetch={false} passHref>
      <LinkCardAnchor {...(target && { target: '_blank' })}>
        <LinkCardText>
          <LinkCardTitle>{title}</LinkCardTitle>
          <LinkCardParagraph>
            <time dateTime={date}>{convertDateToSimpleFormat(date)}</time>
            {excerpt && <span>{excerpt}</span>}
          </LinkCardParagraph>
        </LinkCardText>
        <LinkCardIcon>
          <HiOutlineChevronRight />
        </LinkCardIcon>
      </LinkCardAnchor>
    </Link>
  );
};

export default LinkCard;

const LinkCardAnchor = styled.a`
  display: flex;
  height: 100%;
  padding: calc(var(--margin-base) * 0.6) calc(var(--margin-base) * 0.8);
  transition: background-color 0.2s ease, box-shadow 0.4s ease;
  border-radius: 0.25rem;

  ${mobile} {
    padding: calc(var(--margin-base) * 0.6);
  }

  &:hover {
    background-color: var(--component-backgrounds-4);
    box-shadow: 0 0 0 0.25rem var(--component-backgrounds-4);
  }
`;

const LinkCardText = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  overflow: hidden;
`;

const LinkCardTitle = styled.h3`
  color: var(--text-12);
  font-size: var(--font-size-md);
  font-weight: normal;
  line-height: 1.8;
`;

const LinkCardParagraph = styled.p`
  margin-top: 0.25rem;
  overflow: hidden;
  color: var(--text-11);
  font-size: var(--font-size-sm);
  letter-spacing: 0.025em;
  line-height: 1.8;
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
  padding-left: calc(var(--margin-base) * 0.4);
  color: var(--text-11);

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
