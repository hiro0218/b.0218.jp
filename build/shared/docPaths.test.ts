// @vitest-environment node
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// DOC_PATHS_ROOT は、過去のコミットを展開した木に検査を当てて、検出力を確かめるときだけ使う
const ROOT = process.env.DOC_PATHS_ROOT ?? path.resolve(__dirname, '../..');

// submodule は、clone 直後には空なので検査しない。.gitignore の対象(dist・styled-system・VRT の基準画像など)も、clone 直後には無いので検査しない
const GENERATED = /^_article/;
const isIgnored = (file: string) => spawnSync('git', ['check-ignore', '-q', file], { cwd: ROOT }).status === 0;
const REPO_PATH = /`((?:src|build|docs|scripts|tests|\.github|\.claude)\/[^`\s]*)`/g;
const MD_LINK = /\]\(([^)\s]+)\)/g;

function listDocs(): Array<string> {
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '*.md'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return files.split('\n').filter((file) => file && !GENERATED.test(file) && existsSync(path.join(ROOT, file)));
}

/** 実在しないリポジトリ内のパスを `文書: パス` の形で返す */
function findMissingPaths(): Array<string> {
  const missing: Array<string> = [];

  for (const doc of listDocs()) {
    const text = readFileSync(path.join(ROOT, doc), 'utf8');
    const candidates: Array<string> = [];

    // CLAUDE.md と AGENTS.md は実体へのシンボリックリンクなので、実体の中のリンクはリポジトリの根から読まれる
    const baseDir = doc === '.github/copilot-instructions.md' ? '' : path.dirname(doc);

    for (const [, link] of text.matchAll(MD_LINK)) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      candidates.push(path.relative(ROOT, path.resolve(ROOT, baseDir, link.split('#')[0])));
    }
    for (const match of text.matchAll(REPO_PATH)) {
      // 消えたファイルの履歴を引く `git log -- <パス>` の例は、実在しなくてよい
      if (text.slice(0, match.index).endsWith('git log -- ')) continue;
      candidates.push(match[1].replace(/:\d+(-\d+)?$/, ''));
    }

    for (const candidate of candidates) {
      if (!candidate || GENERATED.test(candidate) || /[<>]|\.\.\./.test(candidate)) continue;
      // ワイルドカードを含むときは、ワイルドカードを含まない先頭のディレクトリが実在すれば足りる
      const literal = candidate
        .split('/')
        .filter((_, i, segments) => !segments.slice(0, i + 1).some((segment) => /[*{]/.test(segment)))
        .join('/');
      if (!existsSync(path.join(ROOT, literal)) && !isIgnored(literal)) missing.push(`${doc}: ${candidate}`);
    }
  }

  return [...new Set(missing)];
}

test('文書が指すリポジトリ内のパスは、すべて実在する(移動・削除したら文書も直す)', () => {
  expect(findMissingPaths()).toEqual([]);
});
