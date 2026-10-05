import { expect, test } from 'vitest';
import { type Lhr, summarize } from './cwv-summary';

type Metrics = { lcp: number; cls: number; tbt: number };

// 3 指標がすべて good になる値。しきい値の境界を試す指標だけを上書きして使う。
const GOOD: Metrics = { lcp: 2000, cls: 0.01, tbt: 50 };

// 集計が読むフィールドだけを持つ LHR を作る。fetchTime は並び順のテストだけが明示し、他は既定値でよい。
const makeLhr = (path: string, metrics: Metrics, fetchTime = '2026-10-05T00:00:00Z'): Lhr => ({
  fetchTime,
  requestedUrl: `http://127.0.0.1:3101${path}`,
  lighthouseVersion: '13.5.0',
  configSettings: { formFactor: 'mobile', throttlingMethod: 'simulate', blockedUrlPatterns: ['*ads.example*'] },
  audits: {
    'largest-contentful-paint': { numericValue: metrics.lcp },
    'cumulative-layout-shift': { numericValue: metrics.cls },
    'total-blocking-time': { numericValue: metrics.tbt },
  },
});

test('3 回測ったページの場合、各指標の中央値を表示する', () => {
  const reports = [
    makeLhr('/', { lcp: 2000, cls: 0.01, tbt: 10 }),
    makeLhr('/', { lcp: 8000, cls: 0, tbt: 500 }),
    makeLhr('/', { lcp: 2200, cls: 0.02, tbt: 20 }),
  ];

  expect(summarize(reports)).toContain('| `/` | 🟢 2.20 s | 🟢 0.010 | 🟢 20 ms |');
});

test.each([
  ['LCP が 2500ms の場合、good と判定する', { lcp: 2500 }, '🟢 2.50 s'],
  ['LCP が 2501ms の場合、needs improvement と判定する', { lcp: 2501 }, '🟡 2.50 s'],
  ['LCP が 4000ms の場合、needs improvement と判定する', { lcp: 4000 }, '🟡 4.00 s'],
  ['LCP が 4001ms の場合、poor と判定する', { lcp: 4001 }, '🔴 4.00 s'],
  ['CLS が 0.1 の場合、good と判定する', { cls: 0.1 }, '🟢 0.100'],
  ['CLS が 0.101 の場合、needs improvement と判定する', { cls: 0.101 }, '🟡 0.101'],
  ['CLS が 0.25 の場合、needs improvement と判定する', { cls: 0.25 }, '🟡 0.250'],
  ['CLS が 0.251 の場合、poor と判定する', { cls: 0.251 }, '🔴 0.251'],
  ['TBT が 200ms の場合、good と判定する', { tbt: 200 }, '🟢 200 ms'],
  ['TBT が 201ms の場合、needs improvement と判定する', { tbt: 201 }, '🟡 201 ms'],
  ['TBT が 600ms の場合、needs improvement と判定する', { tbt: 600 }, '🟡 600 ms'],
  ['TBT が 601ms の場合、poor と判定する', { tbt: 601 }, '🔴 601 ms'],
])('%s', (_name, override, expected) => {
  const report = makeLhr('/', { ...GOOD, ...override });

  expect(summarize([report])).toContain(expected);
});

test('ページは測定した順(fetchTime の昇順)に並べる', () => {
  // 入力の並びは測定順と逆にしておく
  const reports = [makeLhr('/archive', GOOD, '2026-10-05T00:00:02Z'), makeLhr('/', GOOD, '2026-10-05T00:00:01Z')];

  const table = summarize(reports);

  expect(table.indexOf('| `/` |')).toBeLessThan(table.indexOf('| `/archive` |'));
});

test('測定条件を注記に含める', () => {
  const reports = [makeLhr('/', GOOD), makeLhr('/', GOOD), makeLhr('/', GOOD)];

  const note = summarize(reports);

  expect(note).toContain('Lighthouse 13.5.0 (mobile, simulate)');
  expect(note).toContain('3 回測った中央値');
  expect(note).toContain('ブロックして測った');
});

test('判定を絵文字で表示する場合、絵文字の意味を凡例として注記に含める', () => {
  expect(summarize([makeLhr('/', GOOD)])).toContain('🟢 good / 🟡 needs improvement / 🔴 poor');
});

test('注記を作る場合、判定の境界を絵文字と不等号つきで含める', () => {
  expect(summarize([makeLhr('/', GOOD)])).toContain(
    'LCP 🟢 ≤ 2.50 s / 🔴 > 4.00 s、CLS 🟢 ≤ 0.100 / 🔴 > 0.250、TBT 🟢 ≤ 200 ms / 🔴 > 600 ms',
  );
});

test('ブロックしたパターンが無い場合、ブロックした旨を注記に含めない', () => {
  const report = makeLhr('/', GOOD);
  report.configSettings.blockedUrlPatterns = [];

  expect(summarize([report])).not.toContain('ブロックして測った');
});

test('レポートが無い場合、エラーを投げる', () => {
  expect(() => summarize([])).toThrow('レポートがありません');
});

test('指標が欠けたレポートの場合、ページと指標名を含むエラーを投げる', () => {
  const report = { ...makeLhr('/archive', GOOD), audits: {} };

  expect(() => summarize([report])).toThrow('/archive の largest-contentful-paint');
});

test('formFactor が mobile 以外のレポートの場合、判定の境界が合わないためエラーを投げる', () => {
  const report = makeLhr('/', GOOD);
  report.configSettings.formFactor = 'desktop';

  expect(() => summarize([report])).toThrow('desktop');
});
