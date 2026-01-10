import type { CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type ReelProps = {
  as?: keyof JSX.IntrinsicElements;
  itemWidth?: string;
  gap?: SpaceGap;
  noScrollbar?: boolean;
  className?: string;
  children: ReactNode;
};

export const Reel = ({
  as: Tag = 'div',
  itemWidth = 'auto',
  gap = 2,
  noScrollbar = false,
  className,
  children,
  ...props
}: ReelProps) => {
  const reelStyle = cx(
    css`
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;

      & > * {
        flex: 0 0 var(--reel-item-width);
      }

      & > img {
        flex-basis: auto;
        inline-size: auto;
        block-size: 100%;
      }
    `,
    noScrollbar &&
      css`
        scrollbar-width: none;
        /* stylelint-disable-next-line */
        &::-webkit-scrollbar {
          display: none;
        }
      `,
  );

  return (
    <Tag
      className={cx(className, reelStyle)}
      data-gap={gap}
      style={{ '--reel-item-width': itemWidth } as CSSProperties}
      {...props}
    >
      {children}
    </Tag>
  );
};
