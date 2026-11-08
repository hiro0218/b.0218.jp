import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { IconSwap } from './IconSwap';

afterEach(() => {
  cleanup();
});

describe('IconSwap', () => {
  it('primary が active の場合、data-active-icon に primary を設定する', () => {
    const { container } = render(
      <IconSwap
        activeIcon="primary"
        primaryIcon={<svg aria-label="primary icon" />}
        secondaryIcon={<svg aria-label="secondary icon" />}
      />,
    );

    const root = container.querySelector('[data-active-icon="primary"]');

    expect(root).not.toBeNull();
    expect(root?.getAttribute('aria-hidden')).toBe('true');
    expect(root?.querySelector('[data-icon="primary"]')).not.toBeNull();
    expect(root?.querySelector('[data-icon="secondary"]')).not.toBeNull();
  });

  it('secondary が active の場合、data-active-icon に secondary を設定する', () => {
    const { container } = render(
      <IconSwap
        activeIcon="secondary"
        primaryIcon={<svg aria-label="primary icon" />}
        secondaryIcon={<svg aria-label="secondary icon" />}
      />,
    );

    const root = container.querySelector('[data-active-icon="secondary"]');

    expect(root).not.toBeNull();
    expect(root?.querySelector('[data-icon="primary"]')).not.toBeNull();
    expect(root?.querySelector('[data-icon="secondary"]')).not.toBeNull();
  });
});
