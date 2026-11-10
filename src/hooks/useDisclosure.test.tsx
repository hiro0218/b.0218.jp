import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';

import { useDisclosure } from './useDisclosure';

afterEach(cleanup);

function Disclosure() {
  const { isExpanded, rootRef, triggerRef, handleKeyDown, toggle } = useDisclosure();

  return (
    <>
      <div ref={rootRef}>
        <button aria-expanded={isExpanded} onClick={toggle} onKeyDown={handleKeyDown} ref={triggerRef} type="button">
          開く
        </button>
        <button type="button">領域の中</button>
      </div>
      <button type="button">領域の外</button>
    </>
  );
}

// pointerup では終えない。PointerEvent がある環境の react-aria は、領域の外の操作を pointerdown とその後の click の組で判定する
function press(element: Element) {
  fireEvent.pointerDown(element);
  fireEvent.click(element);
}

test('開いている間に領域の外を操作した場合、閉じる', () => {
  render(<Disclosure />);
  const trigger = screen.getByRole('button', { name: '開く' });
  fireEvent.click(trigger);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  press(screen.getByRole('button', { name: '領域の外' }));

  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

test('開いている間に Esc 以外のキーを押した場合、閉じない', () => {
  render(<Disclosure />);
  const trigger = screen.getByRole('button', { name: '開く' });
  fireEvent.click(trigger);

  fireEvent.keyDown(trigger, { key: 'a' });

  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

test('開いている間に領域の中を操作した場合、閉じない', () => {
  render(<Disclosure />);
  const trigger = screen.getByRole('button', { name: '開く' });
  fireEvent.click(trigger);

  press(screen.getByRole('button', { name: '領域の中' }));

  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});
