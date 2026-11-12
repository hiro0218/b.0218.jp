import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { ClipboardCopyState } from '@/hooks/useClipboardCopy';
import { CopyFeedbackIcon } from './CopyFeedbackIcon';

afterEach(cleanup);

function renderIcon(state: ClipboardCopyState) {
  const { container } = render(<CopyFeedbackIcon idleIcon={<svg data-testid="idle-icon" />} state={state} />);
  return container;
}

describe('CopyFeedbackIcon', () => {
  it.each(['idle', 'copying'] as const)(
    '%s の場合、呼び出し側の idleIcon を見せる側（primary）を有効にする',
    (state) => {
      const container = renderIcon(state);

      expect(container.querySelector('[data-active-icon]')?.getAttribute('data-active-icon')).toBe('primary');
      expect(container.querySelector('[data-icon="primary"] [data-testid="idle-icon"]')).not.toBeNull();
    },
  );

  it.each(['copied', 'failed', 'unsupported'] as const)(
    '%s の場合、結果のアイコン（secondary）を有効にする',
    (state) => {
      const container = renderIcon(state);

      expect(container.querySelector('[data-active-icon]')?.getAttribute('data-active-icon')).toBe('secondary');
    },
  );

  it('成功・失敗・未対応の場合、それぞれ別のアイコンを出す', () => {
    const resultIcons = (['copied', 'failed', 'unsupported'] as const).map((state) => {
      const container = renderIcon(state);
      const icon = container.querySelector('[data-icon="secondary"]')?.innerHTML;
      cleanup();
      return icon;
    });

    expect(resultIcons.every((icon) => !!icon)).toBe(true);
    expect(new Set(resultIcons).size).toBe(3);
  });

  it('状態を data-state に付ける（色の切り替えに使う）', () => {
    const container = renderIcon('failed');

    expect(container.firstElementChild?.getAttribute('data-state')).toBe('failed');
  });
});
