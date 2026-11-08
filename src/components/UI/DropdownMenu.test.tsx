import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

import { DropdownMenu } from './DropdownMenu';

function renderMenuBesideDialog() {
  render(
    <>
      <DropdownMenu title="menu" triggerLabel="Feedback">
        <a href="#one">one</a>
      </DropdownMenu>
      <dialog open>
        <button type="button">検索を閉じる</button>
      </dialog>
    </>,
  );

  return screen.getByRole('button', { name: 'Feedback' });
}

test('展開中にメニューの中で Esc を押した場合、閉じてトリガーへフォーカスを戻す', () => {
  const trigger = renderMenuBesideDialog();
  fireEvent.click(trigger);
  const link = screen.getByRole('link', { name: 'one' });
  link.focus();

  fireEvent.keyDown(link, { key: 'Escape' });

  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
});

test('展開中に別の dialog（検索など）の中で Esc を押した場合、メニューは閉じない', () => {
  const trigger = renderMenuBesideDialog();
  fireEvent.click(trigger);

  fireEvent.keyDown(screen.getByRole('button', { name: '検索を閉じる' }), { key: 'Escape' });

  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

// クリックの前にトリガーへフォーカスを置かない。fireEvent.click はフォーカスを動かさないので、クリックでボタンにフォーカスが当たらない Safari と同じ状態になる
test('クリックでフォーカスが移らない場合も、開いた直後に Esc を押すと閉じ、トリガーにフォーカスがある', () => {
  const trigger = renderMenuBesideDialog();
  fireEvent.click(trigger);

  fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
});
