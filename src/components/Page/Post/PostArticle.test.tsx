import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { PostArticle } from './PostArticle';

// CSS.supports を jsdom に頼らない。jsdom には無いため、各テストで差し替える
function stubViewTimelineSupport(isSupported: boolean) {
  vi.stubGlobal('CSS', { supports: vi.fn(() => isSupported) });
}

function stubArticleRects(rects: Record<string, { top: number; height: number }>) {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return (rects[this.textContent ?? ''] ?? { top: 0, height: 0 }) as DOMRect;
  });
}

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0);
    return 0;
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('className と中身を article に描画し、進捗バーは読み上げの対象にしない', () => {
  stubViewTimelineSupport(true);

  const { container } = render(
    <PostArticle className="h-entry">
      <p>本文</p>
    </PostArticle>,
  );

  const article = container.querySelector('article');
  expect(article?.classList.contains('h-entry')).toBe(true);
  expect(article?.querySelector('p')?.textContent).toBe('本文');
  expect(article?.querySelector('[aria-hidden="true"]')).not.toBeNull();
});

it('view-timeline に対応するブラウザの場合、スクロールを購読せず CSS に任せる', () => {
  stubViewTimelineSupport(true);
  const addEventListener = vi.spyOn(window, 'addEventListener');

  const { container } = render(<PostArticle>本文</PostArticle>);

  expect(addEventListener).not.toHaveBeenCalledWith('scroll', expect.anything(), expect.anything());
  expect(container.querySelector<HTMLElement>('[aria-hidden="true"]')?.style.transform).toBe('');
});

it('view-timeline に非対応のブラウザの場合、記事を読み進めた割合をバーの scaleX に反映する', () => {
  stubViewTimelineSupport(false);
  vi.stubGlobal('innerHeight', 500);
  const rects = { main: { top: -250, height: 1500 } };
  stubArticleRects(rects);

  const { container } = render(<PostArticle>main</PostArticle>);
  const bar = container.querySelector<HTMLElement>('[aria-hidden="true"]');

  expect(bar?.style.transform).toBe('scaleX(0.25)');

  rects.main = { top: -5000, height: 1500 };
  act(() => {
    fireEvent.scroll(window);
  });

  expect(bar?.style.transform).toBe('scaleX(1)');
});

it('記事が画面に収まる高さの場合、バーは進まない', () => {
  stubViewTimelineSupport(false);
  vi.stubGlobal('innerHeight', 500);
  stubArticleRects({ main: { top: 100, height: 400 } });

  const { container } = render(<PostArticle>main</PostArticle>);

  expect(container.querySelector<HTMLElement>('[aria-hidden="true"]')?.style.transform).toBe('scaleX(0)');
});

it('記事が複数ある場合、それぞれのバーは自分の記事を読み進めた割合を示す', () => {
  stubViewTimelineSupport(false);
  vi.stubGlobal('innerHeight', 500);
  stubArticleRects({ first: { top: 0, height: 1500 }, second: { top: -500, height: 1500 } });

  const { container } = render(
    <>
      <PostArticle>first</PostArticle>
      <PostArticle>second</PostArticle>
    </>,
  );

  const bars = container.querySelectorAll<HTMLElement>('[aria-hidden="true"]');
  expect(Array.from(bars).map((bar) => bar.style.transform)).toEqual(['scaleX(0)', 'scaleX(0.5)']);
});

it('アンマウントした場合、scroll と resize の購読を解除する', () => {
  stubViewTimelineSupport(false);
  const removeEventListener = vi.spyOn(window, 'removeEventListener');

  const { unmount } = render(<PostArticle>本文</PostArticle>);
  unmount();

  expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
});
