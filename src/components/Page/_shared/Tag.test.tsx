import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';

import { PostTag } from './Tag';

afterEach(cleanup);

it('リンクのタグの場合、rel="tag" とタグページへの href を付ける', () => {
  render(<PostTag size="chip" tags={[{ slug: 'react', isNavigable: true }]} />);

  const link = screen.getByRole('link', { name: 'react' });
  expect(link.getAttribute('rel')).toBe('tag');
  expect(link.getAttribute('href')).toBe('/tags/react');
});

it('labelClassName を渡さない場合、リンクはタグ名を span で包まない', () => {
  render(<PostTag size="chip" tags={[{ slug: 'react', isNavigable: true }]} />);

  expect(screen.getByRole('link', { name: 'react' }).querySelector('span')).toBeNull();
});

it('labelClassName を渡した場合、リンクはタグ名を包む span にクラスを付ける', () => {
  render(<PostTag labelClassName="p-category" size="chip" tags={[{ slug: 'react', isNavigable: true }]} />);

  const link = screen.getByRole('link', { name: 'react' });
  expect(link.classList.contains('p-category')).toBe(false);
  expect(link.querySelector('span.p-category')?.textContent).toBe('react');
});

it('labelClassName を渡した場合、リンクでないタグは span 自身にクラスを付ける', () => {
  const { container } = render(<PostTag labelClassName="p-category" size="chip" tags={[{ slug: 'go' }]} />);

  const tag = container.querySelector('span.p-category');
  expect(tag?.textContent).toBe('go');
  expect(tag?.getAttribute('aria-hidden')).toBe('true');
});

it('size が chip と pill で違う場合、タグに付くクラスが変わる', () => {
  const chip = render(<PostTag size="chip" tags={[{ slug: 'go' }]} />).container.querySelector('span')?.className;
  cleanup();
  const pill = render(<PostTag size="pill" tags={[{ slug: 'go' }]} />).container.querySelector('span')?.className;

  expect(chip).toBeTruthy();
  expect(pill).toBeTruthy();
  expect(chip).not.toBe(pill);
});
