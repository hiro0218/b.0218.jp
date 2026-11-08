import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { IconButton } from './IconButton';

afterEach(() => {
  vi.useRealTimers();
});

test('as を省略した場合、type="button" の button を描画する', () => {
  render(<IconButton aria-label="検索を開く">icon</IconButton>);

  expect(screen.getByRole('button', { name: '検索を開く' }).getAttribute('type')).toBe('button');
});

test('type を指定した場合、その type を button に付ける', () => {
  render(
    <IconButton aria-label="送信" type="submit">
      icon
    </IconButton>,
  );

  expect(screen.getByRole('button', { name: '送信' }).getAttribute('type')).toBe('submit');
});

test('button の場合、onClick と ref を button に渡す', () => {
  const onClick = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  render(
    <IconButton aria-label="検索を開く" onClick={onClick} ref={ref}>
      icon
    </IconButton>,
  );

  fireEvent.click(screen.getByRole('button', { name: '検索を開く' }));

  expect(onClick).toHaveBeenCalledOnce();
  expect(ref.current).toBe(screen.getByRole('button', { name: '検索を開く' }));
});

test('as="link" の場合、href を持つリンクを描画し、as を属性に出さない', () => {
  render(
    <IconButton aria-label="記事一覧へ" as="link" href="/posts">
      icon
    </IconButton>,
  );

  const link = screen.getByRole('link', { name: '記事一覧へ' });
  expect(link.getAttribute('href')).toBe('/posts');
  expect(link.hasAttribute('as')).toBe(false);
});

test('as="externalLink" の場合、新しいタブで開くための rel と target を付け、ref を渡す', () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <IconButton aria-label="X で共有" as="externalLink" href="https://x.com/intent/tweet" ref={ref}>
      icon
    </IconButton>,
  );

  const link = screen.getByRole('link', { name: 'X で共有' });
  expect(link.getAttribute('href')).toBe('https://x.com/intent/tweet');
  expect(link.getAttribute('rel')).toBe('noreferrer');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.hasAttribute('as')).toBe(false);
  expect(ref.current).toBe(link);
});

test.each([
  [
    'button',
    <IconButton aria-label="操作" key="button" size="touch">
      icon
    </IconButton>,
  ],
  [
    'link',
    <IconButton aria-label="操作" as="link" href="/a" key="link" size="touch">
      icon
    </IconButton>,
  ],
  [
    'externalLink',
    <IconButton aria-label="操作" as="externalLink" href="https://example.com" key="externalLink" size="touch">
      icon
    </IconButton>,
  ],
])('%s で size="touch" の場合、data-size="touch" を付ける', (_name, element) => {
  render(element);

  expect(screen.getByLabelText('操作').getAttribute('data-size')).toBe('touch');
});

test('size を省略した場合、data-size を付けない', () => {
  render(<IconButton aria-label="操作">icon</IconButton>);

  expect(screen.getByLabelText('操作').hasAttribute('data-size')).toBe(false);
});

test('className を渡した場合、hover の効果を持つ共通の class に追加する', () => {
  render(
    <IconButton aria-label="操作" className="custom">
      icon
    </IconButton>,
  );

  const classes = screen.getByLabelText('操作').classList;
  expect(classes.contains('custom')).toBe(true);
  expect(classes.contains('link-style--hover-effect')).toBe(true);
});

test('data-active を渡した場合、要素にそのまま出す', () => {
  render(
    <IconButton aria-label="操作" data-active>
      icon
    </IconButton>,
  );

  expect(screen.getByLabelText('操作').getAttribute('data-active')).toBe('true');
});

test('tooltip を指定した場合、ポインタを乗せて待つと tooltip の文言を出す', () => {
  vi.useFakeTimers();
  render(
    <IconButton aria-label="共有" tooltip="X で共有する">
      icon
    </IconButton>,
  );

  // pointerEnter だけを送らない。React Aria は、ポインタ操作のあとの hover だけを tooltip の合図にする
  fireEvent.pointerMove(document.body);
  fireEvent.pointerEnter(screen.getByRole('button', { name: '共有' }));
  act(() => {
    vi.runOnlyPendingTimers();
  });

  expect(screen.getByRole('tooltip').textContent).toBe('X で共有する');
});

test('tooltip を指定しない場合、ポインタを乗せても tooltip を出さない', () => {
  vi.useFakeTimers();
  render(<IconButton aria-label="共有">icon</IconButton>);

  fireEvent.pointerMove(document.body);
  fireEvent.pointerEnter(screen.getByRole('button', { name: '共有' }));
  act(() => {
    vi.runOnlyPendingTimers();
  });

  expect(screen.queryByRole('tooltip')).toBeNull();
});
