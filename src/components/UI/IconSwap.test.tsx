import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IconSwap } from './IconSwap';

const originalMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: originalMatchMedia,
  });
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

  it('prefers-reduced-motion が reduce の場合も同一スロットの DOM 構造を維持する', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true } as MediaQueryList),
    });

    const { container } = render(
      <IconSwap
        activeIcon="secondary"
        primaryIcon={<svg aria-label="primary icon" />}
        secondaryIcon={<svg aria-label="secondary icon" />}
      />,
    );

    const slots = container.querySelectorAll('[data-icon]');

    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
    expect(slots).toHaveLength(2);
    expect(screen.getByLabelText('primary icon')).toBeDefined();
    expect(screen.getByLabelText('secondary icon')).toBeDefined();
  });
});
