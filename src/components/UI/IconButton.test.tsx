import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { IconButton } from './IconButton';

afterEach(() => {
  vi.useRealTimers();
});

test('type を省略した場合、type="button" の button を描画する', () => {
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

test('onClick と ref を渡した場合、button にそのまま渡す', () => {
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

test('size="touch" の場合、data-size="touch" を付ける', () => {
  render(
    <IconButton aria-label="操作" size="touch">
      icon
    </IconButton>,
  );

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

test('tooltip を指定した場合、キーボードで焦点を当てると、待たずに tooltip の文言を出す', () => {
  render(
    <IconButton aria-label="共有" tooltip="X で共有する">
      icon
    </IconButton>,
  );

  // フォーカスの前にキー操作を送る。ポインタ操作のあとのフォーカスは、React Aria が tooltip の合図にしない
  fireEvent.keyDown(document.body, { key: 'Tab' });
  act(() => screen.getByLabelText('共有').focus());

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
