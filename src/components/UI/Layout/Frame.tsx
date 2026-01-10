import type { CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';

type FrameProps = {
  as?: keyof JSX.IntrinsicElements;
  ratio?: string;
  className?: string;
  children: ReactNode;
};

const frameStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: var(--frame-ratio);
  overflow: hidden;

  & > * {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }
`;

export const Frame = ({ as: Tag = 'div', ratio = '16:9', className, children, ...props }: FrameProps) => {
  const [width = 16, height = 9] = ratio.split(':').map(Number);
  const ratioValue = !width || !height || Number.isNaN(width) || Number.isNaN(height) ? 16 / 9 : width / height;

  return (
    <Tag className={cx(className, frameStyle)} style={{ '--frame-ratio': ratioValue } as CSSProperties} {...props}>
      {children}
    </Tag>
  );
};
