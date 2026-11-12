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
    // [data-code-block] の属性や要素を、この部品だけで変えない。本文 CSS（post-content/index.css）と CopyButton が、この属性で選ぶため
    <Root data-code-block="">
      {/* tabindex を Shiki 任せにしない。言語指定のない pre は Shiki を通らず、tabindex が付かないため */}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: 横にスクロールする pre は、キーボードで焦点が入らないと矢印キーでスクロールできない（axe: scrollable-region-focusable） */}
      <pre tabIndex={0} {...preProps}>
        {children}
      </pre>
      <CopyButton />
    </Root>
  );
}

const Root = styled.div`
  position: relative;

  /* code の幅を箱の幅で止めない。止めると、あふれた文字は背景から外れて地に直接載り、続きがあることも分からなくなるため */
  & > pre > code {
    width: max-content;
    min-width: 100%;
    padding: var(--spacing-300);
  }

  /* 横にスクロールできることを、端の影・フェードで示さない。DESIGN.md が使わないため。
     Chrome・Safari では、macOS 既定のオーバーレイのスクロールバーにしない。動かすまで隠れるため、::-webkit-scrollbar で細いバーを常に出す（Firefox は OS の既定のまま）。
     scrollbar-width・scrollbar-color を併記しない。Chrome は併記すると ::-webkit-scrollbar を無視し、隠れるバーに戻るため */
  /* stylelint-disable-next-line plugin/browser-compat */
  & > pre::-webkit-scrollbar {
    height: var(--spacing-100);
    background-color: var(--colors-gray-a-50);
  }

  /* stylelint-disable-next-line plugin/browser-compat */
  & > pre::-webkit-scrollbar-thumb {
    background-color: var(--colors-gray-a-500);
    border-radius: var(--radii-sm);
  }

  &:hover > [data-slot='copy-button'] {
    opacity: 1;
  }
`;
