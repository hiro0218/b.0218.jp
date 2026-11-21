import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { IconLink } from './IconLink';

test('as="link" の場合、href を持つリンクを描画し、as を属性に出さない', () => {
  render(
    <IconLink aria-label="記事一覧へ" as="link" href="/posts">
      icon
    </IconLink>,
  );

  const link = screen.getByRole('link', { name: '記事一覧へ' });
  expect(link.getAttribute('href')).toBe('/posts');
  expect(link.hasAttribute('as')).toBe(false);
});

test('as="externalLink" の場合、新しいタブで開くための rel と target を付け、ref を渡す', () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <IconLink aria-label="X で共有" as="externalLink" href="https://x.com/intent/tweet" ref={ref}>
      icon
    </IconLink>,
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
    'link',
    <IconLink aria-label="操作" as="link" href="/a" key="link" size="touch">
      icon
    </IconLink>,
  ],
  [
    'externalLink',
    <IconLink aria-label="操作" as="externalLink" href="https://example.com" key="externalLink" size="touch">
      icon
    </IconLink>,
  ],
])('%s で size="touch" の場合、data-size="touch" を付ける', (_name, element) => {
  render(element);

  expect(screen.getByLabelText('操作').getAttribute('data-size')).toBe('touch');
});

test('size を省略した場合、data-size を付けない', () => {
  render(
    <IconLink aria-label="操作" as="link" href="/a">
      icon
    </IconLink>,
  );

  expect(screen.getByLabelText('操作').hasAttribute('data-size')).toBe(false);
});

test('className を渡した場合、hover の効果を持つ共通の class に追加する', () => {
  render(
    <IconLink aria-label="操作" as="link" className="custom" href="/a">
      icon
    </IconLink>,
  );

  const classes = screen.getByLabelText('操作').classList;
  expect(classes.contains('custom')).toBe(true);
  expect(classes.contains('link-style--hover-effect')).toBe(true);
});

test.each([
  [
    'link',
    <IconLink aria-label="共有" as="link" href="/a" key="link" tooltip="X で共有する">
      icon
    </IconLink>,
  ],
  [
    'externalLink',
    <IconLink aria-label="共有" as="externalLink" href="https://example.com" key="externalLink" tooltip="X で共有する">
      icon
    </IconLink>,
  ],
])('%s で tooltip を指定した場合、キーボードで焦点を当てると、待たずに tooltip の文言を出す', (_name, element) => {
  render(element);

  // フォーカスの前にキー操作を送る。ポインタ操作のあとのフォーカスは、React Aria が tooltip の合図にしない
  fireEvent.keyDown(document.body, { key: 'Tab' });
  act(() => screen.getByLabelText('共有').focus());

  expect(screen.getByRole('tooltip').textContent).toBe('X で共有する');
});
