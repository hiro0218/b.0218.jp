import { CSSProperties, memo } from 'react';

import { mobile } from '@/lib/mediaQuery';
import { css } from '@/ui/styled';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const Container = memo(function Container(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <div className="l-container" css={cssContainer} {...others}>
      {children}
    </div>
  );
});

const cssContainer = css`
  max-width: var(--container-width);
  margin: var(--space-md) auto 0;
  transition: padding 0.1s ease-in-out;

  ${mobile} {
    padding: 0 5vw;
  }
`;
