import { Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled/static';

import { useHash } from '@/lib/useHash';
import type { divideByYearArchive } from '../_libs';

type Props = {
  totalPosts: number;
  archives: ReturnType<typeof divideByYearArchive>;
};

export const Chart = ({ archives, totalPosts }: Props) => {
  const [hash, setHash] = useHash();

  return (
    <Container>
      {Object.keys(archives).map((year) => {
        const thisPosts = archives[year].length;
        const percentages = (Math.round((thisPosts / totalPosts) * 100000) / 100).toFixed(2);

        return (
          <Anchor
            className={AnchorStyle}
            href={`#${year}年`}
            key={year}
            // @ts-expect-error CSS Custom Properties
            style={{
              '--percent': `${percentages}%`,
            }}
            data-current={hash === year || (hash === '' && year === '2006')}
            onClick={() => setHash(year)}
          >
            {year}
          </Anchor>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: var(--space-½);
  height: var(--space-5);
  overflow-x: scroll;

  @media (--isMobile) {
    flex-direction: column;
    align-items: start;
    width: 100%;
    height: auto;
  }
`;

const AnchorStyle = css`
  --fill: var(--color-gray-3);
  --direction: to top;

  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  min-width: 5cap;
  height: 100%;
  font-size: var(--font-size-xs);
  line-height: var(--line-height-sm);
  color: var(--color-gray-11);
  background: linear-gradient(var(--direction), var(--fill) var(--percent), transparent var(--percent));

  @media (--isMobile) {
    --direction: to right;

    width: 100%;
    padding: var(--space-1) var(--space-½);
    font-size: var(--font-size-sm);
  }

  &[data-current='true'] {
    --fill: var(--color-gray-6);

    font-weight: var(--font-weight-bold);

    &:hover,
    &:active,
    &:focus-visible {
      --fill: var(--color-gray-6);
    }
  }

  &:hover {
    --fill: var(--color-gray-4);
  }

  &:active,
  &:focus-visible {
    --fill: var(--color-gray-5);
  }
`;
