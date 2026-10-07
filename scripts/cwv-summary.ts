// Lighthouse が出力した LHR(JSON)を、端末(SP・PC)ごと・ページごとの中央値の表にして、
// PR コメント用の Markdown にする。
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
// LCP・CLS は web.dev の Core Web Vitals の値で、SP(mobile)と PC(desktop)で共通である。
// TBT は CWV ではなく Lighthouse の採点区分で、PC だけ別の値を持つ(desktop)。
// good(SP の値)は .claude/rules/styling.md の Web パフォーマンスの目標値と同じ。poor は次の出典の区分に合わせた値である。
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
    desktop: { good: 150, poor: 350 },
    format: (value: number) => `${Math.round(value)} ms`,
  },
];

// 表に出す端末。この順に並べる。ここに無い formFactor は判定の境界が未定義のため受け付けない。
const FORM_FACTORS: Record<string, string> = { mobile: 'SP(モバイル)', desktop: 'PC(デスクトップ)' };

// 端末ごとの境界。desktop の指定が無い指標は、端末に依らず共通の値を使う。
function boundsOf(metric: (typeof METRICS)[number], formFactor: string): { good: number; poor: number } {
  return formFactor === 'desktop' && metric.desktop ? metric.desktop : metric;
}

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

// 判定ごとの絵文字。表のセルに出し、凡例も同じ定義から作る。
const RATING_EMOJI = { good: '🟢', 'needs improvement': '🟡', poor: '🔴' };

function rate(value: number, { good, poor }: { good: number; poor: number }): keyof typeof RATING_EMOJI {
  if (value <= good) return 'good';
  return value <= poor ? 'needs improvement' : 'poor';
}

// 端末 1 つ分の見出しと表を、行の配列で返す。reports は測定順に並んでいて、ページの順もそれに従う。
function renderSection(formFactor: string, reports: Lhr[]): string[] {
  // 1 回の測定は外れ値になりうる(広告を止めても /archive は 2.7 秒と 3.5 秒に割れる)ため、中央値を表示する。
  const rows = [...Map.groupBy(reports, pagePath)].map(([page, runs]) => {
    const cells = METRICS.map((metric) => {
      const value = median(runs.map((lhr) => readMetric(lhr, metric.id)));
      return `${RATING_EMOJI[rate(value, boundsOf(metric, formFactor))]} ${metric.format(value)}`;
    });
    return `| \`${page}\` | ${cells.join(' | ')} |`;
  });

  return [
    `### ${FORM_FACTORS[formFactor]}`,
    '',
    `| ページ | ${METRICS.map((metric) => metric.label).join(' | ')} |`,
    `| --- | ${METRICS.map(() => '---').join(' | ')} |`,
    ...rows,
    '',
  ];
}

// 境界は絵文字と不等号で書き、どの値から色が変わるか(以下か超か)を注記だけで読めるようにする。
function describeBounds(formFactor: string): string {
  const bounds = METRICS.map((metric) => {
    const { good, poor } = boundsOf(metric, formFactor);
    return `${metric.label} ${RATING_EMOJI.good} ≤ ${metric.format(good)} / ${RATING_EMOJI.poor} > ${metric.format(poor)}`;
  });
  return `${FORM_FACTORS[formFactor]}の境界: ${bounds.join('、')}`;
}

/** LHR を端末とページごとに集計し、LCP / CLS / TBT の中央値を Markdown の表にして返す。 */
export function summarize(reports: Lhr[]): string {
  if (reports.length === 0) throw new Error('Lighthouse のレポートがありません');

  // 判定の境界は端末ごとに決めているため、境界が未定義の formFactor は、誤った判定を出す前に止める。
  const unknown = reports.find((lhr) => !Object.hasOwn(FORM_FACTORS, lhr.configSettings.formFactor));
  if (unknown) throw new Error(`判定の境界が未定義の formFactor です: ${unknown.configSettings.formFactor}`);

  // 端末とページごとの測定回数は、注記に「N 回」と 1 つの数字で書く。揃っていなければ、事実と違う注記になるため止める。
  const cells = Map.groupBy(reports, (lhr) => `${lhr.configSettings.formFactor} ${pagePath(lhr)}`);
  const counts = new Set([...cells.values()].map((cell) => cell.length));
  if (counts.size !== 1) throw new Error(`端末・ページごとの測定回数が揃っていません: ${[...counts].join(', ')}`);
  const [runs] = counts;

  // 表のページ順を測定順に揃えるため、fetchTime の昇順に並べてから、端末ごとにまとめる。
  const sorted = reports.toSorted((a, b) => a.fetchTime.localeCompare(b.fetchTime));
  const byFormFactor = Map.groupBy(sorted, (lhr) => lhr.configSettings.formFactor);
  const measured = Object.keys(FORM_FACTORS).filter((formFactor) => byFormFactor.has(formFactor));

  // 注記は LHR に記録された測定条件から作る。条件を変えても、表示が実際の測定と食い違わないようにするため。
  const first = sorted[0];
  const blockedNote = first.configSettings.blockedUrlPatterns?.length
    ? '外部の広告・計測スクリプトの通信をブロックして測った'
    : '';
  const legend = Object.entries(RATING_EMOJI)
    .map(([name, emoji]) => `${emoji} ${name}`)
    .join(' / ');

  return [
    ...measured.flatMap((formFactor) => renderSection(formFactor, byFormFactor.get(formFactor))),
    `<sub>Lighthouse ${first.lighthouseVersion} (${first.configSettings.throttlingMethod})で ${runs} 回測った中央値。${blockedNote}ラボ値で、実ユーザーの値とは異なる。</sub>`,
    '',
    `<sub>判定: ${legend}。${measured.map(describeBounds).join('。')}。</sub>`,
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
