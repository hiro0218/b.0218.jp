import Link from 'next/link';
import { SITE_DESCRIPTION } from '@/constants';
import { css, styled } from '@/ui/styled';

export function Hero() {
  return (
    <div className={containerStyle}>
      <Avatar>
        <img alt="" height={100} src="/hiro0218.svg" width={100} />
      </Avatar>
      <Title>
        hiro<span> ─ web developer</span>
      </Title>
      <p>
        {SITE_DESCRIPTION}
        <br />
        <Link href="/about">about</Link>
      </p>
    </div>
  );
}

const containerStyle = css`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: var(--sizes-icon-xl) 1fr;
  gap: var(--spacing-2);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-900);

  a {
    text-decoration-line: underline;
    text-decoration-thickness: var(--border-widths-medium);
    text-decoration-color: var(--colors-gray-600);
    text-underline-offset: 2%;

    &:hover {
      text-decoration-color: var(--colors-gray-800);
    }
  }

  p {
    line-height: var(--line-heights-lg);
    color: var(--colors-gray-600);
  }
`;

const Avatar = styled.div`
  display: grid;
  grid-row: 1 / -1;
  place-items: center;
  width: var(--sizes-icon-xl);

  img {
    flex-shrink: 0;
    aspect-ratio: 1/1;
    border-radius: var(--radii-full);
  }
`;

const Title = styled.h2`
  display: flex;
  gap: var(--spacing-1);
  align-items: center;
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-sm);

  & > span {
    font-size: var(--font-sizes-lg);
    font-weight: var(--font-weights-normal);
    color: var(--colors-gray-600);
  }
`;
