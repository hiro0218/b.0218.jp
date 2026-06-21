import type { ReactNode } from 'react';
import { styled } from '@/ui/styled';

import { CopyButton } from './CodeBlock/CopyButton';

type CodeBlockProps = {
  preProps?: Record<string, unknown>;
  children: ReactNode;
};

/**
 * @summary 構文ハイライト付きコードブロック。コード本文の静的表示に Copy code 操作を併設する。
 */
export function CodeBlock({ preProps, children }: CodeBlockProps) {
  return (
    <Root data-code-block="">
      <pre {...preProps}>{children}</pre>
      <CopyButton />
    </Root>
  );
}

const Root = styled.div`
  position: relative;

  &:hover > [data-slot='copy-button'] {
    opacity: 1;
  }
`;
