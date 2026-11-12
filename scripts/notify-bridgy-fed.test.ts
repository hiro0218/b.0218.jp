/**
 * @vitest-environment node
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';

// notify-bridgy-fed.sh は gh と curl を PATH から呼ぶ。両方をスタブに差し替え、外部へ通信せずスクリプトを丸ごと実行する。
// デプロイ履歴と submodule ポインタは固定値で足し、compare API の files と公開ページの応答だけをテストごとに変える。
const SCRIPT_PATH = join(import.meta.dirname, 'notify-bridgy-fed.sh');

// gh のスタブが返す固定の JSON(ファイル名はスタブの case と対応する)
const STATIC_FIXTURES: Record<string, string> = {
  'deployments.json':
    '[{"id":2,"sha":"cursha","created_at":"2026-09-26T03:12:46Z"},{"id":1,"sha":"prevsha","created_at":"2026-09-24T02:52:27Z"}]',
  'statuses.json': '[{"state":"success"}]',
  'contents-prev.json': '{"sha":"prevsub"}',
  'contents-cur.json': '{"sha":"cursub","submodule_git_url":"https://github.com/hiro0218/article.git"}',
};

// gh api <endpoint> [--jq <expr>]: FIXTURES 配下の JSON を返す
const GH_STUB = String.raw`#!/usr/bin/env bash
set -euo pipefail
shift
endpoint=""
jq_expr=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --jq) jq_expr="$2"; shift 2 ;;
    -*) shift ;;
    *) endpoint="$1"; shift ;;
  esac
done
case "$endpoint" in
  repos/*/deployments\?environment=Production*) fixture="deployments.json" ;;
  repos/*/deployments/*/statuses) fixture="statuses.json" ;;
  repos/*/contents/_article\?ref=prevsha) fixture="contents-prev.json" ;;
  repos/*/contents/_article\?ref=cursha) fixture="contents-cur.json" ;;
  repos/*/compare/*) fixture="compare.json" ;;
  *) echo "unexpected gh endpoint: $endpoint" >&2; exit 99 ;;
esac
if [[ -n "$jq_expr" ]]; then jq -r "$jq_expr" "$FIXTURES/$fixture"; else cat "$FIXTURES/$fixture"; fi
`;

// curl: 呼び出しを CALLS_LOG に記録する。POST は常に 200、GET は pages.tsv(URL, ステータス, 本文のタブ区切り)を引き、無ければ 404
const CURL_STUB = String.raw`#!/usr/bin/env bash
echo "curl $*" >> "$CALLS_LOG"
out=""
url=""
post=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o) out="$2"; shift 2 ;;
    -X) post=1; shift 2 ;;
    -w|--max-time|--retry|--retry-delay|--data-urlencode) shift 2 ;;
    -*) shift ;;
    *) url="$1"; shift ;;
  esac
done
if [[ $post -eq 1 ]]; then
  : > "$out"
  printf 200
  exit 0
fi
line=$(awk -F'\t' -v u="$url" '$1 == u { print; exit }' "$FIXTURES/pages.tsv")
if [[ -z "$line" ]]; then
  : > "$out"
  printf 404
  exit 0
fi
printf '%s' "$line" | cut -f3- > "$out"
printf '%s' "$line" | cut -f2
`;

type ComparedFile = { filename: string; status: string; changes: number };
type Page = { code: number; body?: string };

/** 公開されていて noindex でもないページの応答 */
const PUBLIC_PAGE: Page = { code: 200, body: '<html><head><meta name="robots" content="index"></head></html>' };

const runNotify = ({ files, pages = {} }: { files: ComparedFile[]; pages?: Record<string, Page> }) => {
  const dir = mkdtempSync(join(tmpdir(), 'notify-bridgy-fed-'));

  try {
    const binDir = join(dir, 'bin');
    const callsLog = join(dir, 'calls.log');
    mkdirSync(binDir);
    writeFileSync(join(binDir, 'gh'), GH_STUB, { mode: 0o755 });
    writeFileSync(join(binDir, 'curl'), CURL_STUB, { mode: 0o755 });
    writeFileSync(callsLog, '');
    for (const [name, body] of Object.entries(STATIC_FIXTURES)) {
      writeFileSync(join(dir, name), body);
    }
    writeFileSync(join(dir, 'compare.json'), JSON.stringify({ files }));
    writeFileSync(
      join(dir, 'pages.tsv'),
      Object.entries(pages)
        .map(([url, { code, body = '' }]) => `${url}\t${code}\t${body}\n`)
        .join(''),
    );

    const result = spawnSync('bash', [SCRIPT_PATH], {
      encoding: 'utf8',
      // 開発者や CI の環境変数(DRY_RUN など)が混ざらないよう、必要な変数だけを渡す
      env: Object.fromEntries<string>([
        ['PATH', `${binDir}:${process.env.PATH ?? ''}`],
        ['FIXTURES', dir],
        ['CALLS_LOG', callsLog],
        ['GITHUB_REPOSITORY', 'test/repo'],
        ['ANCHOR_SHA', 'cursha'],
        ['ANCHOR_CREATED_AT', '2026-09-26T03:12:46Z'],
        ['ANCHOR_DEPLOYMENT_ID', '2'],
      ]) as NodeJS.ProcessEnv,
    });

    return {
      exitCode: result.status,
      output: `${result.stdout}${result.stderr}`,
      calls: readFileSync(callsLog, 'utf8').split('\n').filter(Boolean),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

const SOURCE_PATTERN = /--data-urlencode source=(\S+)/;
const isPost = (call: string) => call.includes('-X POST');
/** webmention の送信先として渡された source の URL */
const sentSources = (calls: string[]) => calls.filter(isPost).map((call) => SOURCE_PATTERN.exec(call)?.[1]);
/** 公開状態の確認のために取得したページの URL */
const fetchedUrls = (calls: string[]) => calls.filter((call) => !isPost(call)).map((call) => call.split(' ').pop());

/** 同じ status の記事が compare API の files にまとめて現れる状況(過去記事の一括修正など) */
const bulkFiles = (count: number, status: string): ComparedFile[] =>
  Array.from({ length: count }, (_, index) => ({ filename: `_posts/2012${index}.md`, status, changes: 3 }));

test('ディレクトリ内の記事の場合、ディレクトリを除いたスラッグの URL へ送信する', () => {
  const url = 'https://b.0218.jp/20180419001727.html';

  const { exitCode, calls } = runNotify({
    files: [{ filename: '_posts/名探偵コナン/20180419001727.md', status: 'added', changes: 12 }],
    pages: { [url]: PUBLIC_PAGE },
  });

  expect(exitCode).toBe(0);
  expect(fetchedUrls(calls)).toEqual([url]);
  expect(sentSources(calls)).toEqual([url]);
});

test('更新記事が上限を超えた場合、新規記事だけ送信して警告を出す', () => {
  const url = 'https://b.0218.jp/20260926.html';

  const { exitCode, output, calls } = runNotify({
    files: [...bulkFiles(21, 'modified'), { filename: '_posts/20260926.md', status: 'added', changes: 30 }],
    pages: { [url]: PUBLIC_PAGE },
  });

  expect(exitCode).toBe(0);
  expect(output).toContain('::warning::更新記事数(21)');
  expect(sentSources(calls)).toEqual([url]);
});

test('新規記事が上限を超えた場合、何も送信せず異常終了する', () => {
  const { exitCode, output, calls } = runNotify({ files: bulkFiles(11, 'added') });

  expect(exitCode).toBe(1);
  expect(output).toContain('::error::新規記事数(11)');
  expect(calls).toEqual([]);
});

test('内容の変わらない rename の場合、送信対象にしない', () => {
  const { exitCode, output, calls } = runNotify({
    files: [{ filename: '_posts/名探偵コナン/20180419001727.md', status: 'renamed', changes: 0 }],
  });

  expect(exitCode).toBe(0);
  expect(output).toContain('対象記事なし');
  expect(calls).toEqual([]);
});

test('上限以内の更新記事の場合、従来どおりすべて送信する', () => {
  const files = bulkFiles(3, 'modified');
  const pages = Object.fromEntries(
    files.map(({ filename }) => [
      `https://b.0218.jp/${filename.replace('_posts/', '').replace('.md', '')}.html`,
      PUBLIC_PAGE,
    ]),
  );

  const { exitCode, calls } = runNotify({ files, pages });

  expect(exitCode).toBe(0);
  expect(sentSources(calls)).toHaveLength(3);
});

test('公開ページが 404 の記事の場合、送信せず異常終了する', () => {
  const { exitCode, output, calls } = runNotify({
    files: [{ filename: '_posts/202609172233.md', status: 'added', changes: 5 }],
  });

  expect(exitCode).toBe(1);
  expect(output).toContain('status=404');
  expect(sentSources(calls)).toEqual([]);
});
