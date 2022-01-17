import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';
import { HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';

import { mobile } from '@/lib/mediaQuery';
import { NextPrevPost } from '@/types/source';

type Props = {
  next: NextPrevPost;
  prev: NextPrevPost;
};

const PostPager: FC<Props> = ({ next, prev }) => {
  return (
    <PagerRoot>
      {Object.keys(prev).length !== 0 && (
        <Link href={`${prev.slug}.html`} prefetch={false} passHref>
          <PagerAnchorItem>
            <PagerIcon>
              <HiOutlineArrowLeft />
            </PagerIcon>
            <PagerMain data-label="Prev">
              <div className="title">{prev.title}</div>
            </PagerMain>
          </PagerAnchorItem>
        </Link>
      )}
      {Object.keys(next).length !== 0 && (
        <Link href={`${next.slug}.html`} prefetch={false} passHref>
          <PagerAnchorItem>
            <PagerMain data-label="Next">
              <div className="title">{next.title}</div>
            </PagerMain>
            <PagerIcon>
              <HiOutlineArrowRight />
            </PagerIcon>
          </PagerAnchorItem>
        </Link>
      )}
    </PagerRoot>
  );
};

export default PostPager;

const PagerRoot = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: var(--font-size-sm);
`;

const PagerAnchorItem = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 50%;
  padding: 1rem;
  transition: background 0.2s ease, box-shadow 0.4s ease;
  border-radius: 0.25em;
  color: var(--color-text);
  line-height: 1.8;
  word-break: break-all;

  ${mobile} {
    width: 100%;
  }

  &:hover {
    background: var(--bg-color--lighter);
    box-shadow: 0 0 0 0.25rem var(--bg-color--lighter);
  }

  &:only-child {
    flex-grow: 1;
  }

  &:nth-child(2) {
    text-align: right;
  }
`;

const PagerMain = styled.div`
  flex-grow: 1;

  &::before {
    content: attr(data-label);
    color: var(--color-text--lighter);
  }

  .title {
    margin-top: 0.25rem;
    color: var(--color-text);
  }
`;

const PagerIcon = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  color: var(--color-text--lighter);

  svg {
    width: 1rem;
    height: 1rem;
  }
`;
