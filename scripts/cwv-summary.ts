// Lighthouse が出力した LHR(JSON)を、ページごとの中央値の表にして PR コメント用の Markdown にする。
// scripts/cwv-measure.sh が出力したディレクトリを読む。使い方:
//   node --require esbuild-register scripts/cwv-summary.ts <LHR の JSON があるディレクトリ>
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** summarize が読む LHR のフィールドだけを写した型 */
export type Lhr = {
  fetchTime: string;
  requestedUrl: string;
  lighthouseVersion: string;
  configSettings: {
    formFactor: string;
    throttlingMethod: string;
    blockedUrlPatterns?: string[] | null;
  };
  audits: Record<string, { numericValue?: number }>;
};

// good 以下は good、poor を超えると poor、その間は needs improvement と判定する。
// この境界はモバイル(Lighthouse の既定)の値で、summarize は formFactor が mobile 以外のレポートを受け付けない。
// good は .claude/rules/styling.md の Web パフォーマンスの目標値と同じ。poor は次の出典の区分に合わせた値である。
//   LCP / CLS: https://web.dev/articles/defining-core-web-vitals-thresholds
//   TBT: https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time
// INP はページを読み込むだけの計測では得られないため扱わない(TBT で代用する)。
const METRICS = [
  {
    id: 'largest-contentful-paint',
    label: 'LCP',
    good: 2500,
    poor: 4000,
    format: (value: number) => `${(value / 1000).toFixed(2)} s`,
  },
  {
    id: 'cumulative-layout-shift',
    label: 'CLS',
    good: 0.1,
    poor: 0.25,
    format: (value: number) => value.toFixed(3),
  },
  {
    id: 'total-blocking-time',
    label: 'TBT',
    good: 200,
    poor: 600,
    format: (value: number) => `${Math.round(value)} ms`,
  },
];

// 測ったページは、リダイレクトされても依頼した URL(固定リスト)の行として表に出す。
function pagePath(lhr: Lhr): string {
  return new URL(lhr.requestedUrl).pathname;
}

function readMetric(lhr: Lhr, id: string): number {
  const value = lhr.audits[id]?.numericValue;
  if (typeof value !== 'number') throw new Error(`${pagePath(lhr)} の ${id} を読み取れません`);
  return value;
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function rate(value: number, { good, poor }: { good: number; poor: number }): string {
  if (value <= good) return 'good';
  return value <= poor ? 'needs improvement' : 'poor';
}

/** LHR をページごとに集計し、LCP / CLS / TBT の中央値を Markdown の表にして返す。 */
export function summarize(reports: Lhr[]): string {
  if (reports.length === 0) throw new Error('Lighthouse のレポートがありません');

  // 判定の境界はモバイル用のため、別の formFactor では誤った判定を出す前に止める。
  const { lighthouseVersion, configSettings } = reports[0];
  if (configSettings.formFactor !== 'mobile')
    throw new Error(
      `判定の境界はモバイル用のため、formFactor が ${configSettings.formFactor} のレポートは集計できません`,
    );

  // 表のページ順を測定順に揃えるため、fetchTime の昇順に並べてからページごとにまとめる。
  const sorted = reports.toSorted((a, b) => a.fetchTime.localeCompare(b.fetchTime));
  const runsByPage = Map.groupBy(sorted, pagePath);

  // 1 回の測定は外れ値になりうる(広告を止めても /archive は 2.7 秒と 3.5 秒に割れる)ため、中央値を表示する。
  const rows = [...runsByPage].map(([page, runs]) => {
    const cells = METRICS.map((metric) => {
      const value = median(runs.map((lhr) => readMetric(lhr, metric.id)));
      return `${metric.format(value)} (${rate(value, metric)})`;
    });
    return `| \`${page}\` | ${cells.join(' | ')} |`;
  });

  // 注記は LHR に記録された測定条件から作る。条件を変えても、表示が実際の測定と食い違わないようにするため。
  const [firstPageRuns] = runsByPage.values();
  const blockedNote = configSettings.blockedUrlPatterns?.length
    ? '外部の広告・計測スクリプトの通信をブロックして測った'
    : '';
  const boundaries = METRICS.map(
    (metric) => `${metric.label} ${metric.format(metric.good)} / ${metric.format(metric.poor)}`,
  );

  return [
    `| ページ | ${METRICS.map((metric) => metric.label).join(' | ')} |`,
    `| --- | ${METRICS.map(() => '---').join(' | ')} |`,
    ...rows,
    '',
    `<sub>Lighthouse ${lighthouseVersion} (${configSettings.formFactor}, ${configSettings.throttlingMethod})で ${firstPageRuns.length} 回測った中央値。${blockedNote}ラボ値で、実ユーザーの値とは異なる。</sub>`,
    '',
    `<sub>判定の境界(good / poor): ${boundaries.join('、')}。</sub>`,
    '',
  ].join('\n');
}

// CLI として実行されたときだけ、ディレクトリ内の JSON を LHR として読み、結果を標準出力へ出す。
// テストから import されたときは実行しない。
if (require.main === module) {
  const dir = process.argv[2];
  if (!dir)
    throw new Error('使い方: node --require esbuild-register scripts/cwv-summary.ts <LHR の JSON があるディレクトリ>');

  const reports = readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => JSON.parse(readFileSync(join(dir, name), 'utf8')) as Lhr);
  process.stdout.write(summarize(reports));
}
