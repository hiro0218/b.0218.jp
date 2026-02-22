import Link from 'next/link';
import { css, styled } from '@/ui/styled';

export function Hero() {
  return (
    <div className={containerStyle}>
      <Avatar>
        <img alt="" height={100} src="/hiro0218.svg" width={100} />
      </Avatar>
      <p>
        <Link href="/about">hiro</Link> is web developer.
      </p>
    </div>
  );
}

const containerStyle = css`
  display: grid;
  gap: var(--spacing-2);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-900);

  a {
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-decoration-color: var(--colors-gray-600);
    text-underline-offset: 2%;

    &:hover {
      text-decoration-color: var(--colors-gray-800);
    }
  }

  p {
    color: var(--colors-gray-700);
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: var(--sizes-icon-xl);
  height: var(--sizes-icon-xl);

  img {
    aspect-ratio: 1/1;
    border-radius: var(--radii-full);
  }
`;
