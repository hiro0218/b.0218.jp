import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import initializeSmoothScroll from './smoothScroll';

describe('initializeSmoothScroll', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    document.body.innerHTML = '';
    // jsdom は scrollIntoView と matchMedia を提供しないためスタブを追加する
    Element.prototype.scrollIntoView = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
  });

  const dispatchClickOn = (selector: string) => {
    const target = document.querySelector(selector) as HTMLElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  };

  it('mokuji.js v5 形式の URL-encoded id にそのままヒットするアンカーを解決する', () => {
    document.body.innerHTML = `
      <a id="link" href="#%E8%83%8C%E6%99%AF">背景</a>
      <h2 id="%E8%83%8C%E6%99%AF">背景</h2>
    `;
    const heading = document.getElementById('%E8%83%8C%E6%99%AF') as HTMLElement;
    const scrollSpy = vi.spyOn(heading, 'scrollIntoView').mockImplementation(() => {});

    cleanup = initializeSmoothScroll();
    const event = dispatchClickOn('#link');

    expect(event.defaultPrevented).toBe(true);
    expect(scrollSpy).toHaveBeenCalledOnce();
  });

  it('id がデコード済み形式の場合、フォールバックで解決する', () => {
    document.body.innerHTML = `
      <a id="link" href="#%E8%83%8C%E6%99%AF">背景</a>
      <h2 id="背景">背景</h2>
    `;
    const heading = document.getElementById('背景') as HTMLElement;
    const scrollSpy = vi.spyOn(heading, 'scrollIntoView').mockImplementation(() => {});

    cleanup = initializeSmoothScroll();
    const event = dispatchClickOn('#link');

    expect(event.defaultPrevented).toBe(true);
    expect(scrollSpy).toHaveBeenCalledOnce();
  });

  it('#top の場合は documentElement にスクロールする', () => {
    document.body.innerHTML = `<a id="link" href="#top">Top</a>`;
    const scrollSpy = vi.spyOn(document.documentElement, 'scrollIntoView').mockImplementation(() => {});

    cleanup = initializeSmoothScroll();
    const event = dispatchClickOn('#link');

    expect(event.defaultPrevented).toBe(true);
    expect(scrollSpy).toHaveBeenCalledOnce();
  });

  it('存在しない id の場合は preventDefault しない', () => {
    document.body.innerHTML = `<a id="link" href="#nonexistent">Missing</a>`;

    cleanup = initializeSmoothScroll();
    const event = dispatchClickOn('#link');

    expect(event.defaultPrevented).toBe(false);
  });

  it('cleanup 後はクリックを処理しない', () => {
    document.body.innerHTML = `
      <a id="link" href="#section">Section</a>
      <h2 id="section">Section</h2>
    `;
    const heading = document.getElementById('section') as HTMLElement;
    const scrollSpy = vi.spyOn(heading, 'scrollIntoView').mockImplementation(() => {});

    cleanup = initializeSmoothScroll();
    cleanup();

    const event = dispatchClickOn('#link');

    expect(event.defaultPrevented).toBe(false);
    expect(scrollSpy).not.toHaveBeenCalled();
  });
});
