import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

let failDialogLoad = false;

// factory を async にしない。戻り値に呼び出し可能な then があると、Promise の then とみなされて TS1058 になる。
// then は型に出さない。import() は実行時の getter だけを見る。
vi.mock('./ZoomImage/Dialog', (importOriginal) =>
  importOriginal<typeof import('./ZoomImage/Dialog')>().then((actual) => {
    const namespace = { ...actual };
    Object.defineProperty(namespace, 'then', {
      configurable: true,
      enumerable: true,
      get() {
        if (!failDialogLoad) return undefined;

        return (_resolve: unknown, reject: (reason: Error) => void) => {
          reject(new Error('chunk load failed'));
        };
      },
    });
    return namespace;
  }),
);

import { ZoomImage } from './ZoomImage';

// 内部の hook・Dialog・TriggerButton を単体で描画しない。
// 公開入口の ZoomImage だけ描画すれば、内部の分割や名前を変えても、振る舞い(DOM・ARIA・view-transition-name)が同じなら落ちない。

const ALT = '風景写真';
const LARGE = { width: 640, height: 480 };

const originalShowModal = HTMLDialogElement.prototype.showModal;
const originalClose = HTMLDialogElement.prototype.close;

// hydration のテストで作った root を、各テストの末尾では片付けない。失敗したテストの root が次のテストへ残るため、afterEach で片付ける
let unmountHydrated: (() => Promise<void>) | undefined;

beforeEach(() => {
  failDialogLoad = false;
  document.startViewTransition = undefined;
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() {
      this.removeAttribute('open');
    },
  });
});

afterEach(async () => {
  await unmountHydrated?.();
  unmountHydrated = undefined;
  document.startViewTransition = undefined;
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: originalShowModal });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: originalClose });
  vi.restoreAllMocks();
  cleanup();
});

function loadImage(image: HTMLElement, size: { width: number; height: number }) {
  Object.defineProperties(image, {
    naturalHeight: { configurable: true, value: size.height },
    naturalWidth: { configurable: true, value: size.width },
  });
  fireEvent.load(image);
}

async function renderZoomable() {
  render(<ZoomImage alt={ALT} src="/test.jpg" />);
  loadImage(screen.getByAltText(ALT), LARGE);

  return screen.findByRole('button', { name: ALT });
}

async function openDialog() {
  const trigger = await renderZoomable();
  fireEvent.click(trigger);

  return { trigger, dialog: await screen.findByRole('dialog', { name: ALT }) };
}

// 待ちを省かない。足りないと、「まだ描画されない」の確認が、描画が起きていても通ってしまう
async function settleDialogImport() {
  await act(async () => {
    await vi.dynamicImportSettled();
  });
}

type TransitionNames = { source: string; dialog: string };

function readTransitionNames(): TransitionNames {
  const [source] = screen.getAllByAltText(ALT);
  const dialogImage = document.querySelector<HTMLImageElement>('dialog img');

  return {
    dialog: dialogImage?.style.viewTransitionName ?? '',
    source: (source as HTMLImageElement).style.viewTransitionName ?? '',
  };
}

// 更新の callback を同期に呼ばない。実ブラウザの callback は非同期で呼ばれるので、呼び出しとの間に重なる操作を再現できなくなる
function mockViewTransition() {
  const calls: Array<{
    before: TransitionNames;
    after: TransitionNames | undefined;
    finish: () => Promise<void>;
    skip: () => Promise<void>;
  }> = [];

  document.startViewTransition = vi.fn((update: () => void) => {
    const finished = Promise.withResolvers<void>();
    const call = {
      after: undefined as TransitionNames | undefined,
      before: readTransitionNames(),
      finish: () =>
        act(async () => {
          finished.resolve();
          await finished.promise;
        }),
      skip: () =>
        act(async () => {
          finished.reject(new Error('transition skipped'));
          await finished.promise.catch(() => undefined);
        }),
    };
    calls.push(call);
    queueMicrotask(() => {
      update();
      call.after = readTransitionNames();
    });

    return {
      finished: finished.promise,
      ready: Promise.resolve(undefined),
      skipTransition: vi.fn(),
      updateCallbackDone: Promise.resolve(undefined),
    } as unknown as ViewTransition;
  });

  return calls;
}

it('読み込み前の場合、alt・src と追加の props を引き継いだ img だけを描画し、トリガーは出さない', () => {
  render(<ZoomImage alt={ALT} className="photo" height={200} src="/test.jpg" style={{ width: '100px' }} width={300} />);

  const image = screen.getByAltText(ALT) as HTMLImageElement;
  expect(image.getAttribute('src')).toBe('/test.jpg');
  expect(image.classList.contains('photo')).toBe(true);
  expect(image.getAttribute('width')).toBe('300');
  expect(image.getAttribute('height')).toBe('200');
  expect(image.style.width).toBe('100px');
  expect(screen.queryByRole('button')).toBeNull();
});

it('style に objectFit がある場合、読み込み後もトリガーを出さず、img だけを描画する', () => {
  render(<ZoomImage alt={ALT} src="/test.jpg" style={{ objectFit: 'cover' }} />);

  loadImage(screen.getByAltText(ALT), LARGE);

  expect((screen.getByAltText(ALT) as HTMLImageElement).style.objectFit).toBe('cover');
  expect(screen.queryByRole('button')).toBeNull();
});

it('読み込みが済んだ場合、ズーム元の img と同じ親の中に、画像の名前を持つトリガーを出す', async () => {
  render(<ZoomImage alt={ALT} src="/test.jpg" />);
  const image = screen.getByAltText(ALT);
  expect(screen.queryByRole('button')).toBeNull();

  loadImage(image, LARGE);

  const trigger = await screen.findByRole('button', { name: ALT });
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  // トリガーを img と別の親に置かない。CSS は、トリガーを img と同じ位置決めの親へ重ねる前提で書かれている
  expect(trigger.parentElement).toBe(image.parentElement);
});

it('画像の実寸が幅も高さも 100px 未満の場合、トリガーを出さない', () => {
  render(<ZoomImage alt={ALT} src="/test.jpg" />);

  loadImage(screen.getByAltText(ALT), { width: 99, height: 99 });

  expect(screen.queryByRole('button')).toBeNull();
});

it.each([
  ['幅', { width: 100, height: 99 }],
  ['高さ', { width: 99, height: 100 }],
])('画像の実寸が%sだけ 100px 以上の場合、トリガーを出す', (_side, size) => {
  render(<ZoomImage alt={ALT} src="/test.jpg" />);

  loadImage(screen.getByAltText(ALT), size);

  expect(screen.getByRole('button', { name: ALT })).toBeDefined();
});

it('alt が無い場合、トリガーと dialog にそれぞれ既定の名前を付ける', async () => {
  const { container } = render(<ZoomImage src="/test.jpg" />);
  loadImage(container.querySelector('img') as HTMLElement, LARGE);

  fireEvent.click(screen.getByRole('button', { name: '画像をズーム' }));

  expect(await screen.findByRole('dialog', { name: '画像のズーム表示' })).toBeDefined();
});

it.each([
  ['ポインタが乗った', fireEvent.pointerEnter],
  ['フォーカスされた', fireEvent.focus],
])('トリガーに%s場合、押される前に dialog を描画しておく', async (_signal, send) => {
  const trigger = await renderZoomable();
  await settleDialogImport();
  expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();

  send(trigger);

  // hidden: true を省かない。閉じた dialog は accessibility tree に含まれず、省くと見つからない
  const dialog = await screen.findByRole('dialog', { hidden: true });
  expect(dialog.hasAttribute('open')).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('dialog の読み込み前に押した場合も、描画後に dialog を open / close できる', async () => {
  const trigger = await renderZoomable();

  fireEvent.click(trigger);

  const dialog = await screen.findByRole('dialog', { name: ALT });
  expect(dialog.hasAttribute('open')).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));

  expect(dialog.hasAttribute('open')).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('ポインタが乗って dialog が描画された後に押した場合、直ちに dialog を open する', async () => {
  const trigger = await renderZoomable();
  fireEvent.pointerEnter(trigger);
  const dialog = await screen.findByRole('dialog', { hidden: true });
  expect(dialog.hasAttribute('open')).toBe(false);

  fireEvent.click(trigger);

  expect(dialog.hasAttribute('open')).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

it('dialog の読み込み前に素早く 2 回押した場合も、dialog は 1 回だけ開く', async () => {
  const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
  const trigger = await renderZoomable();

  fireEvent.click(trigger);
  fireEvent.click(trigger);
  await screen.findByRole('dialog', { name: ALT });

  expect(showModal).toHaveBeenCalledOnce();
});

it('dialog の読み込み中に取り外された場合、エラーを記録せず、何も開かない', async () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
  const trigger = await renderZoomable();

  fireEvent.click(trigger);
  cleanup();
  await settleDialogImport();

  expect(consoleError).not.toHaveBeenCalled();
  expect(showModal).not.toHaveBeenCalled();
});

it('dialog の取得に失敗した場合、開かず失敗を記録する', async () => {
  failDialogLoad = true;
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const trigger = await renderZoomable();

  fireEvent.click(trigger);
  await settleDialogImport();

  expect(consoleError).toHaveBeenCalledWith('Failed to load ZoomImage dialog:', expect.any(Error));
  expect(screen.queryByRole('dialog', { hidden: true })).toBeNull();
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('dialog の画像は、ズーム元と同じ src と、読み込み済み画像の実寸の width / height を持つ', async () => {
  render(<ZoomImage alt={ALT} height={120} src="/original.jpg" width={160} />);
  const source = screen.getByAltText(ALT);
  loadImage(source, LARGE);

  fireEvent.click(await screen.findByRole('button', { name: ALT }));

  const dialogImage = within(await screen.findByRole('dialog', { name: ALT })).getByAltText(ALT);
  expect(dialogImage.getAttribute('src')).toBe('/original.jpg');
  expect(dialogImage.getAttribute('width')).toBe('640');
  expect(dialogImage.getAttribute('height')).toBe('480');
  expect(source.getAttribute('width')).toBe('160');
});

it.each([
  [
    '閉じるボタンを押した',
    (dialog: HTMLElement) => fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' })),
  ],
  ['dialog 内の画像を押した', (dialog: HTMLElement) => fireEvent.click(within(dialog).getByAltText(ALT))],
  ['背景(dialog 自身)を押した', (dialog: HTMLElement) => fireEvent.click(dialog)],
  ['dialog 自身で Enter を押した', (dialog: HTMLElement) => fireEvent.keyDown(dialog, { key: 'Enter' })],
  ['dialog 自身で Space を押した', (dialog: HTMLElement) => fireEvent.keyDown(dialog, { key: ' ' })],
  [
    'Escape で cancel イベントが起きた',
    (dialog: HTMLElement) => fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true })),
  ],
])('dialog を開いて、%s場合、dialog を閉じ、トリガーを閉じた状態に戻す', async (_operation, operate) => {
  const { trigger, dialog } = await openDialog();

  operate(dialog);

  expect(dialog.hasAttribute('open')).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it.each([
  [
    'Escape で cancel イベントが起きた',
    (dialog: HTMLElement) => fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true })),
  ],
  ['dialog 自身で Enter を押した', (dialog: HTMLElement) => fireEvent.keyDown(dialog, { key: 'Enter' })],
  ['dialog 自身で Space を押した', (dialog: HTMLElement) => fireEvent.keyDown(dialog, { key: ' ' })],
])('dialog を開いて、%s場合、ブラウザ既定の動作は止める', async (_operation, operate) => {
  const { dialog } = await openDialog();

  const notPrevented = operate(dialog);

  expect(notPrevented).toBe(false);
});

it('dialog 自身で Tab を押した場合、閉じない', async () => {
  const { trigger, dialog } = await openDialog();

  fireEvent.keyDown(dialog, { key: 'Tab' });

  expect(dialog.hasAttribute('open')).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

it('cancel を経ずに dialog だけが閉じていた場合、閉じ直さず、トリガーの開閉の状態だけを合わせる', async () => {
  const { trigger, dialog } = await openDialog();
  const close = vi.spyOn(HTMLDialogElement.prototype, 'close');
  dialog.removeAttribute('open');

  fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));

  expect(close).not.toHaveBeenCalled();
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('View Transition に対応している場合、開くときはズーム元から dialog の画像へ名前を渡し、終わったら名前を残さない', async () => {
  const calls = mockViewTransition();

  const { trigger, dialog } = await openDialog();

  expect(calls).toHaveLength(1);
  expect(calls[0].before).toEqual({ dialog: '', source: 'zoom-image' });
  expect(calls[0].after).toEqual({ dialog: 'zoom-image', source: '' });
  expect(dialog.hasAttribute('open')).toBe(true);
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  await calls[0].finish();

  expect(readTransitionNames()).toEqual({ dialog: '', source: '' });
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
});

it('View Transition に対応している場合、閉じるときは dialog の画像からズーム元へ名前を渡し、終わったら名前を残さない', async () => {
  const calls = mockViewTransition();
  const { trigger, dialog } = await openDialog();
  await calls[0].finish();

  fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));
  await calls[1].finish();

  expect(calls).toHaveLength(2);
  expect(calls[1].before).toEqual({ dialog: 'zoom-image', source: '' });
  expect(calls[1].after).toEqual({ dialog: '', source: 'zoom-image' });
  expect(dialog.hasAttribute('open')).toBe(false);
  expect(readTransitionNames()).toEqual({ dialog: '', source: '' });
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

it('View Transition の更新の callback より前に素早く 2 回押した場合も、遷移は 1 回だけ始める', async () => {
  const calls = mockViewTransition();
  const trigger = await renderZoomable();

  fireEvent.click(trigger);
  fireEvent.click(trigger);
  await screen.findByRole('dialog', { name: ALT });

  expect(calls).toHaveLength(1);
});

it('View Transition の最中に閉じる操作が重なった場合、新しい遷移を始めない', async () => {
  const calls = mockViewTransition();
  const { dialog } = await openDialog();
  const closeButton = within(dialog).getByRole('button', { name: '閉じる' });

  fireEvent.click(closeButton);
  expect(calls).toHaveLength(1);
  expect(dialog.hasAttribute('open')).toBe(true);

  await calls[0].finish();
  fireEvent.click(closeButton);
  fireEvent.click(closeButton);
  expect(calls).toHaveLength(2);
});

it('View Transition が中断された場合も、名前を残さず、開閉の状態を実際の dialog に合わせる', async () => {
  const calls = mockViewTransition();
  const { trigger, dialog } = await openDialog();

  await calls[0].skip();

  expect(readTransitionNames()).toEqual({ dialog: '', source: '' });
  expect(trigger.getAttribute('aria-expanded')).toBe('true');

  fireEvent.click(within(dialog).getByRole('button', { name: '閉じる' }));
  await calls[1].skip();

  expect(readTransitionNames()).toEqual({ dialog: '', source: '' });
  expect(dialog.hasAttribute('open')).toBe(false);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
});

async function hydrateServerRenderedImage(imageSize: { width: number; height: number } | null) {
  const ui = <ZoomImage alt={ALT} src="/test.jpg" />;
  const container = document.body.appendChild(document.createElement('div'));
  container.innerHTML = renderToString(ui);

  const image = container.querySelector('img') as HTMLImageElement;
  if (imageSize) {
    Object.defineProperties(image, {
      complete: { configurable: true, value: true },
      naturalHeight: { configurable: true, value: imageSize.height },
      naturalWidth: { configurable: true, value: imageSize.width },
    });
  }

  const recoverableErrors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, ui, { onRecoverableError: (error) => recoverableErrors.push(error) });
  });

  unmountHydrated = async () => {
    await act(async () => root?.unmount());
    container.remove();
  };

  return { container, image, recoverableErrors };
}

it('hydration より前に画像の読み込みが終わっていた場合、load を待たずにズームのトリガーを出す', async () => {
  const hydrated = await hydrateServerRenderedImage(LARGE);

  expect(hydrated.recoverableErrors).toEqual([]);
  expect(within(hydrated.container).getByRole('button', { name: ALT })).toBeDefined();
  expect(hydrated.container.querySelector('img')).toBe(hydrated.image);
});

it('hydration の時点で画像が読み込み中の場合、load が来るまでトリガーを出さず、load 後に出す', async () => {
  const hydrated = await hydrateServerRenderedImage(null);

  expect(within(hydrated.container).queryByRole('button')).toBeNull();

  Object.defineProperties(hydrated.image, {
    naturalHeight: { configurable: true, value: LARGE.height },
    naturalWidth: { configurable: true, value: LARGE.width },
  });
  await act(async () => {
    fireEvent.load(hydrated.image);
  });

  expect(hydrated.recoverableErrors).toEqual([]);
  expect(within(hydrated.container).getByRole('button', { name: ALT })).toBeDefined();
});
