import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

// 共有の定数にせず、ファイルの文字列から読む。css のテンプレートに \${} を埋め込むと、その規則がクラスから落ちるため
const FILES = ['./timelineGrid.ts', './PostTimeline.tsx', '../Archive/Chart.tsx'];
const CONTAINER_CONDITION = /@container \(([^)]+)\)/g;

test('年別チャートと記事の行の場合、列を切り替えるコンテナの条件は 1 種類だけである', () => {
  const conditionsPerFile = FILES.map((file) =>
    [...readFileSync(new URL(file, import.meta.url), 'utf8').matchAll(CONTAINER_CONDITION)].map(
      ([, condition]) => condition,
    ),
  );

  // どのファイルからも見つかること。何も拾わないまま、空の集合で通るのを防ぐ
  expect(conditionsPerFile.every((conditions) => conditions.length > 0)).toBe(true);
  expect(new Set(conditionsPerFile.flat()).size).toBe(1);
});
