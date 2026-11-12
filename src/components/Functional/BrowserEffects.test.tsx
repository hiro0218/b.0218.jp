import { act, render } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { BrowserEffects } from './BrowserEffects';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function clickAnchor() {
  document.getElementById('link')?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

test('ページ内リンクをクリックした場合、URL を更新し、描画が済んでからスクロールを始める', () => {
  Element.prototype.scrollIntoView = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  document.body.innerHTML = `
    <a id="link" href="#section">Section</a>
    <h2 id="section">Section</h2>
  `;
  const scrollSpy = vi.spyOn(document.getElementById('section') as HTMLElement, 'scrollIntoView');
  const pushStateSpy = vi.spyOn(history, 'pushState');
  render(<BrowserEffects />);

  act(() => {
    clickAnchor();
    // クリックの処理の中でスクロールを始めない。ルーターの再描画の確定前に始めると、復元がスクロールを打ち切るため
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  expect(pushStateSpy).toHaveBeenCalledOnce();
  expect(scrollSpy).toHaveBeenCalledOnce();
  expect(pushStateSpy.mock.invocationCallOrder[0]).toBeLessThan(scrollSpy.mock.invocationCallOrder[0]);
});

test('同じリンクを続けてクリックした場合も、そのたびにスクロールを始める', () => {
  Element.prototype.scrollIntoView = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  document.body.innerHTML = `
    <a id="link" href="#section">Section</a>
    <h2 id="section">Section</h2>
  `;
  const scrollSpy = vi.spyOn(document.getElementById('section') as HTMLElement, 'scrollIntoView');
  render(<BrowserEffects />);

  act(() => clickAnchor());
  act(() => clickAnchor());

  expect(scrollSpy).toHaveBeenCalledTimes(2);
});
