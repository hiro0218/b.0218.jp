import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import { Tooltip } from './Tooltip';

const TEXT = '補足の説明';
// Tooltip.tsx の SHOW_DELAY_MS と同じ値に保つ。import して共有しない。テストが実装の値に追従し、遅延を変える退行を検出できなくなるため
const SHOW_DELAY_MS = 500;

// 開いたまま・表示待ちのまま取り外さない。react-stately のモジュール変数（globalWarmedUp）が true のまま残り、次のテストのホバーが待たずに開くため。
// 待ちの timer で開く → Esc で閉じる → 閉じたあとの待ちを終わらせる、を act を分けて行う。同じ act の中では、開いたときだけ登録される Esc の listener が間に合わない
afterEach(() => {
  act(() => {
    vi.runOnlyPendingTimers();
  });
  act(() => {
    fireEvent.keyDown(document.body, { key: 'Escape' });
  });
  act(() => {
    vi.runOnlyPendingTimers();
  });
  cleanup();
  vi.useRealTimers();
});

function renderTooltip(position?: 'top' | 'bottom') {
  vi.useFakeTimers();
  render(
    <Tooltip position={position} text={TEXT}>
      <button type="button">対象</button>
    </Tooltip>,
  );

  return screen.getByRole('button', { name: '対象' });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

// pointerenter だけを送らない。直前にポインタの動きが無いと、react-aria はホバーを無視する
function hover(trigger: HTMLElement) {
  fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
  fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
}

function openByHover(trigger: HTMLElement) {
  hover(trigger);
  advance(SHOW_DELAY_MS);
}

test('操作が無い場合、ツールチップを描画せず、aria-describedby も付けない', () => {
  renderTooltip();

  expect(screen.queryByRole('tooltip')).toBeNull();
  expect(document.querySelector('[aria-describedby]')).toBeNull();
});

test('ポインタが乗って表示の遅延が過ぎた場合、ツールチップを出し、トリガーの aria-describedby で結ぶ', () => {
  const trigger = renderTooltip();

  hover(trigger);
  advance(SHOW_DELAY_MS - 1);
  expect(screen.queryByRole('tooltip')).toBeNull();

  advance(1);
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip.textContent).toBe(TEXT);
  expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
});

test('キーボードでフォーカスした場合、遅延なしでツールチップを出す', () => {
  const trigger = renderTooltip();

  // フォーカスの前にキー操作を送る。ポインタ操作のあとのフォーカスは、react-aria がキーボードのフォーカスとみなさず、ツールチップを出さない
  fireEvent.keyDown(document.body, { key: 'Tab' });
  act(() => trigger.focus());

  expect(screen.getByRole('tooltip').textContent).toBe(TEXT);
});

// Esc をトリガーに送らない。WCAG 1.4.13 の「閉じられる」は、フォーカスがトリガーに無い（ポインタで出した）表示にも求められるため
test('ポインタで出したツールチップは、Esc を押した場合に閉じる', () => {
  const trigger = renderTooltip();
  openByHover(trigger);
  expect(screen.getByRole('tooltip')).toBeDefined();

  fireEvent.keyDown(document.body, { key: 'Escape' });

  expect(screen.queryByRole('tooltip')).toBeNull();
});

test('ポインタが外れて時間が過ぎた場合、ツールチップを閉じる', () => {
  const trigger = renderTooltip();
  openByHover(trigger);
  expect(screen.getByRole('tooltip')).toBeDefined();

  fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
  advance(1000);

  expect(screen.queryByRole('tooltip')).toBeNull();
});

test('トリガーを押した場合、待たずにツールチップを閉じる', () => {
  const trigger = renderTooltip();
  openByHover(trigger);
  expect(screen.getByRole('tooltip')).toBeDefined();

  fireEvent.pointerDown(trigger, { pointerType: 'mouse' });

  expect(screen.queryByRole('tooltip')).toBeNull();
});

test('子の要素が持つ onPointerDown は、ツールチップの props を足したあとも呼ばれる', () => {
  vi.useFakeTimers();
  const onPointerDown = vi.fn();
  render(
    <Tooltip text={TEXT}>
      <button onPointerDown={onPointerDown} type="button">
        対象
      </button>
    </Tooltip>,
  );

  fireEvent.pointerDown(screen.getByRole('button', { name: '対象' }), { pointerType: 'mouse' });

  expect(onPointerDown).toHaveBeenCalledOnce();
});

test.each([
  [undefined, 'bottom'],
  ['top', 'top'],
  ['bottom', 'bottom'],
] as const)('position が %s の場合、data-position を %s にする', (position, expected) => {
  const trigger = renderTooltip(position);

  openByHover(trigger);

  expect(screen.getByRole('tooltip').getAttribute('data-position')).toBe(expected);
});
