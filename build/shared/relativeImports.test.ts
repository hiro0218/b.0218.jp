// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// RELATIVE_IMPORTS_ROOT は、過去のコミットを展開した木に検査を当てて、検出力を確かめるときだけ使う
const ROOT = process.env.RELATIVE_IMPORTS_ROOT ?? path.resolve(__dirname, '../..');

// panda.config.mts が import で辿る範囲は、`@/` が解決されるか未確認のため相対 import のまま(docs/conventions/typescript.md)
const PANDA_CONFIG_FILES = /^src\/ui\/(styled\/theme\/|lib\/fonts\.ts)/;
const TEST_OR_STORY = /\.(test|stories)\.[jt]sx?$/;
const RELATIVE_SPECIFIER = /(?:from|import\()\s*'(\.{1,2}\/[^']*)'/g;

function listSources(): Array<string> {
  return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'src/*.ts', 'src/*.tsx'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(
      (file) =>
        file && !TEST_OR_STORY.test(file) && !PANDA_CONFIG_FILES.test(file) && existsSync(path.join(ROOT, file)),
    );
}

/**
 * 相対 import してよいのは、配置型 B の組(公開入口 `Name.tsx` と内部実装 `Name/`)の中だけ。
 * 入口から `Name/` の下へ、`Name/` の中どうし、`Name/` の中から入口へ
 */
function isInsideModule(file: string, target: string): boolean {
  const dir = path.dirname(file);
  const name = path.basename(file).replace(/\.[jt]sx?$/, '');
  const isEntry = target === path.join(dir, name) || target.startsWith(`${path.join(dir, name)}/`);

  const hasEntry = ['.ts', '.tsx'].some((ext) => existsSync(path.join(ROOT, `${dir}${ext}`)));
  const isInternal = hasEntry && (target.startsWith(`${dir}/`) || target === dir);

  return isEntry || isInternal;
}

test('本番の相対 import は、配置型 B の入口と内部実装の間だけにする(それ以外は @/ の絶対パス)', () => {
  const violations: Array<string> = [];

  for (const file of listSources()) {
    const text = readFileSync(path.join(ROOT, file), 'utf8');
    for (const [, specifier] of text.matchAll(RELATIVE_SPECIFIER)) {
      const target = path.posix.join(path.posix.dirname(file), specifier);
      if (!isInsideModule(file, target))
        violations.push(`${file}: '${specifier}' -> @/${target.replace(/^src\//, '')}`);
    }
  }

  expect(violations).toEqual([]);
});
