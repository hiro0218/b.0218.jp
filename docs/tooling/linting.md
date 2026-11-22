# Linting / oxlint・oxfmt 規則

lint は oxlint、整形は oxfmt で行う。設定は、リポジトリ直下の `.oxlintrc.json` と `.oxfmtrc.json` にある（どちらもコメントを書ける）。`overrides` の `files` は設定ファイルのあるディレクトリを基準に解決されるため、設定ファイルは直下に置く。別の場所の設定を `-c` で渡すと、`overrides` が当たらなくなる。

## 設定方針

`plugins` で使う規則群を選び、`categories` の `correctness`（明らかな誤りや無駄なコードを検出する規則の分類）を error にする。基本設定に無い規則の追加、重大度の変更、例外だけを `rules` と `overrides` に書く。`categories` で有効にしているため、`correctness` の規則は、設定に個別に書かなくても有効になる（`oxlint --print-config` は 200 規則を出す）。oxlint のアップデートで `correctness` に規則が加わったとき、設定を変えずに有効になるかは、新しい版で試していない（1.93.0 と 1.94.0 では、この設定で有効になる規則は同じである）。`options.reportUnusedDisableDirectives` を `warn` にしてあり、不要になった抑制コメントは警告になる。

| plugin       | 役割                                                          |
| ------------ | ------------------------------------------------------------- |
| `typescript` | TypeScript の型の書き方（`any` の禁止、型のみの import など） |
| `unicorn`    | JavaScript の誤りやすい書き方。`correctness` の規則だけを使う |
| `oxc`        | oxc 独自の規則（barrel ファイルの禁止）                       |
| `import`     | import・export の規則（default export の禁止）                |
| `react`      | React の規則（hooks の依存配列、`key`）                       |
| `jsx-a11y`   | JSX のアクセシビリティ                                        |
| `nextjs`     | Next.js の規則（`<img>` の使用など）                          |

### 整形

oxfmt の設定は `.oxfmtrc.json` にある。次の表に無い設定は oxfmt の既定（インデントは 2 スペース、セミコロンあり、`trailingComma: "all"`、`arrowParens: "always"`）である。`printWidth`・`singleQuote` を含め、Markdown・CSS・YAML を整形する Prettier（`package.json` の `prettier`）と同じ値になっている。

| 設定                         | 値                                                   | 補足                                                                                                             |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `printWidth`                 | `120`                                                | 1 行の最大幅                                                                                                     |
| `singleQuote`                | `true`                                               | 文字列を単一引用符で書く                                                                                         |
| `embeddedLanguageFormatting` | `"off"`                                              | CSS-in-JS の中の CSS は整形しない。整形すると、`position-try-fallbacks` のような複数値の宣言が複数行に展開される |
| `sortImports`                | `partitionByNewline: true`、`newlinesBetween: false` | import を並べ替える。下の説明を参照                                                                              |

import の並べ替えは、整形（oxfmt の `sortImports`）で行う。昇順で、大文字小文字を区別しない（oxfmt の既定）。`partitionByNewline: true` により、空行で区切った import は区切りごとに並べる。`newlinesBetween: false` により、並べ替えで import の間に空行を足さない。JSX 属性の並べ替えは、oxlint・oxfmt のどちらにも無く、強制しない（[強制していない規則](#強制していない規則)）。

## ファイル除外

lint と整形は、対象のディレクトリと除外のパターンが異なる。どちらも、`.gitignore` に書かれたパターン（`.next`、`dist`、`styled-system` など）は対象にしない。

### lint の対象と除外

`npm run lint` の oxlint は `src scripts tests` を対象にする。`.oxlintrc.json` の `ignorePatterns` で、次を除く。

| パターン          | 理由                                      |
| ----------------- | ----------------------------------------- |
| `_article`        | Git submodule（読み取り専用）             |
| `.github/scripts` | CI スクリプトは対象外                     |
| `build/**`        | ビルドスクリプト。整形は適用、lint は除外 |
| `public/**`       | 静的アセット                              |
| `**/*.config.js`  | 設定ファイルは lint 対象外                |

### 整形の対象と除外

`npm run lint` の oxfmt（`--check`）と `npm run lint:write` は、`src build scripts tests` を対象にする。`.oxfmtrc.json` の `ignorePatterns` で、次を除く。

| パターン          | 理由                               |
| ----------------- | ---------------------------------- |
| `**/*.css`        | CSS は Stylelint + Prettier で処理 |
| `.github/scripts` | CI スクリプトは対象外              |
| `_article`        | Git submodule（読み取り専用）      |

## npm scripts / AI 実行

- `npm run lint`: `oxlint src scripts tests && oxfmt --check src build scripts tests`。CI の `lint` ジョブ（`.github/workflows/pr-validation.yml`）が実行する。`oxfmt --check` は整形の差分を確かめるだけで、ファイルを書き換えない。
- `npm run lint:write`: `oxlint --fix --fix-suggestions src scripts tests && oxfmt src build scripts tests`。
- コミット時は、`nano-staged` が staged な `**/*.{ts,tsx,js,mjs}` に `oxlint --fix`、`oxfmt`、`tsc --noEmit --skipLibCheck` を順に実行する。`oxlint` と `oxfmt` に `--no-error-on-unmatched-pattern` を付けるのは、`ignorePatterns` で除外されるファイルだけを渡すと、oxlint は `No files found to lint.` で終了コード 1、oxfmt は `Expected at least one target file.` で終了コード 2 になるためである。
- 編集ファイルだけを確認する場合は、`./node_modules/.bin/oxlint <files...>` と `./node_modules/.bin/oxfmt --check <files...>` を直接実行する（`npx` はこの作業環境で失敗することがある。詳細は [CLAUDE.md](../../CLAUDE.md) の npx 既知問題を参照）。
- AI セッション中の自動修正では [oxlint-check Skill](../../.claude/skills/oxlint-check/SKILL.md) を優先し、`--fix` までにとどめる。`--fix-suggestions` は、プログラムの挙動を変えうる修正も適用するため使わない。
- 設定ファイルを編集した場合は、設定ファイルだけの変更でも読み込めることを確かめる。`.oxlintrc.json` は `./node_modules/.bin/oxlint src`、`.oxfmtrc.json` は `./node_modules/.bin/oxfmt --check src` を実行する。oxlint は、読み込みに失敗すると `Failed to parse oxlint configuration file.` を出して終了コード 1 になる（規則名の誤りも同じ）。oxfmt は、構文の誤りで `Failed to load configuration file.`、値の型の誤りで `Failed to parse configuration.` を出して終了コード 1 になる。存在しない設定名は、エラーにならずに無視されるため、`node_modules/oxfmt/configuration_schema.json` の設定名と見比べる。
- VS Code は、保存時に `source.fixAll.oxc` を実行する（`.vscode/settings.json`）。Oxc 拡張でこの設定が実際に動くかは未確認である。

## 意図的な例外

### 無効化・緩和（`correctness` からの変更）

`categories` の `correctness` に含まれる規則のうち、重大度か options を変えたものである。

| ルール                                | 設定                                | 理由                                        |
| ------------------------------------- | ----------------------------------- | ------------------------------------------- |
| `nextjs/no-img-element`               | off                                 | ZoomImage・Logo 等で意図的に `<img>` を使用 |
| `jsx-a11y/no-noninteractive-tabindex` | warn                                | カスタムウィジェットでの意図的な使用あり    |
| `react/exhaustive-deps`               | warn                                | pathname トリガー等の意図的な依存省略を許容 |
| `no-unused-vars`                      | error（`ignoreRestSiblings: true`） | 分割代入の残余は許容                        |

次の規則は、現在のコードに該当箇所があるため、off にしている。有効にしたい場合は、該当箇所の修正とセットで行う。

| ルール                                            | 検出する内容                                    | 有効にしたときの件数 |
| ------------------------------------------------- | ----------------------------------------------- | -------------------- |
| `jsx-a11y/prefer-tag-over-role`                   | `role` 属性ではなく、対応する HTML のタグを使う | 10                   |
| `jsx-a11y/no-noninteractive-element-interactions` | 操作できない要素にイベントハンドラーを付けない  | 1                    |
| `jsx-a11y/control-has-associated-label`           | 操作する要素にテキストのラベルを付ける          | 1                    |
| `react/set-state-in-effect`                       | effect の中で `setState` を同期的に呼ばない     | 1                    |
| `unicorn/no-useless-spread`                       | 不要なスプレッドで新しい配列を作らない          | 1                    |
| `nextjs/no-assign-module-variable`                | `module` 変数へ代入しない                       | 1                    |

件数は、2026-11-22 時点のコードで、表の規則だけを有効にして oxlint で数えた。対象は `src/` と `next.config.mjs` である。`nextjs/no-assign-module-variable` の 1 件だけが `next.config.mjs` の `const module = ...` で、ほかは `src/` にある。`next.config.mjs` は `npm run lint` の対象ではないが、コミット時の oxlint は対象にする。

### 厳格化・追加（`correctness` 以外を有効にしたもの）

| ルール                               | 設定  | 理由                                                                                                                                                                                                                  |
| ------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript/no-explicit-any`         | error | TypeScript `any` 禁止を機械的に強制                                                                                                                                                                                   |
| `typescript/consistent-type-imports` | warn  | 型のみの import を `import type` にそろえる。段階的な移行のため error にしない。`disallowTypeAnnotations: false` で、テストの `importOriginal<typeof import('...')>()` の型注釈を許す                                 |
| `react/no-array-index-key`           | error | `key` に配列の添字を使わない（データに固有の値を使う）                                                                                                                                                                |
| `oxc/no-barrel-file`                 | error | パフォーマンス。re-export を集めた barrel ファイルを作らない。`threshold: 0` で、再 export する module が 1 つでもあれば検出する。検出するのは `export *` 形式だけである（[強制していない規則](#強制していない規則)） |
| `import/no-default-export`           | error | `src/components/` の default export を禁止する。stories（`*.stories.{ts,tsx}`）は、Storybook が default export を要するため対象外                                                                                     |

### Playwright

oxlint の組み込みプラグインに Playwright 用のものは無い。`tests/**/*.{ts,tsx}` に限り、ESLint 用の `eslint-plugin-playwright` を oxlint の `jsPlugins` で読み、次の 10 規則を使う。`jsPlugins` は alpha で、semver の対象外である。`eslint` は `eslint-plugin-playwright` の peer 依存を満たすためだけに入れてあり、lint には使わない。

| ルール                                | 設定  | 理由                                                                  |
| ------------------------------------- | ----- | --------------------------------------------------------------------- |
| `playwright/no-networkidle`           | error | [testing.md](../conventions/testing.md) の deterministic な待機に整合 |
| `playwright/no-wait-for-timeout`      | error | タイムアウトベースのアサーション禁止                                  |
| `playwright/no-wait-for-navigation`   | error | deprecated API でレースが起きやすい                                   |
| `playwright/no-force-option`          | error | `{ force: true }` は根本的な問題を隠す                                |
| `playwright/missing-playwright-await` | error | async API の await 漏れは致命的バグ                                   |
| `playwright/no-page-pause`            | error | `page.pause()` の commit 残留を防ぐ                                   |
| `playwright/no-wait-for-selector`     | warn  | locator API 推奨。既存コード移行のため warn                           |
| `playwright/no-element-handle`        | warn  | locator API 推奨                                                      |
| `playwright/no-eval`                  | warn  | locator API 推奨                                                      |
| `playwright/no-useless-await`         | warn  | 不要な await の検出                                                   |

`warn` は新規コードでの許可ではなく、既存コード移行の猶予である。新規・変更コードでは warn でも rule の意図に沿う修正を優先し、既存ファイルを触る場合は変更箇所と近傍を無理のない範囲で寄せる。

## レイヤー依存 / import

層ごとの import の向きと、oxlint・dependency-cruiser のどちらが検出するかは、[layers.md](../architecture/layers.md#-レイヤー依存関係-critical) の表にまとめている。

`src/` では `**/index` の import（barrel 経由の import）を禁止し、`oxc/no-barrel-file` で `export * from` 形式の barrel ファイルも作らせない。全レイヤーで `~/styled-system/*` の直接 import も禁止し、`@/ui/styled` 経由に統一する。

禁止は、`overrides` の `no-restricted-imports` に層ごとに書く。同じ規則の options は、後ろの override が前の override の options を置き換え、併合しない。そのため、各 override に barrel（`**/index`）の `patterns` を重ねて書く。`message` は、oxlint の既定の出力では `help:` の行に出る（`--format=unix` には出ない）。

`src/app/**/page.tsx` と `src/app/**/_lib/*Page.tsx` では、`@/ui/styled` の `css`・`styled` の import も禁止する（[app-router.md](../architecture/app-router.md#-pagetsx-にスタイルを定義しない-critical)）。名前空間 import（`import * as x from '@/ui/styled'`）も検出する。この override は、`src/**/*.{ts,tsx}` の override より後ろに置く。前に置くと、後ろの override が options を置き換えて、`css`・`styled` の禁止が効かなくなる。

`src/app/**/*.{ts,tsx}` の override にある `@/lib/distLoader/*` の禁止は、後ろの `src/**/*.{ts,tsx}` の override が options を置き換えるため、`page.tsx` と `*Page.tsx` 以外の `src/app/` のファイルでは効かない。`src/lib/` の外で `lib/distLoader` を import するファイルは、2026-11-22 時点の `src/` に無い（`rg` で確かめた）。

## 抑制コメントの使用基準

以下のいずれかに該当する場合に許可する。理由コメントは必須である。

1. ルールの意図には合致するが、この箇所では別の制約により例外が妥当な場合。
2. SDK / 外部ライブラリの慣用パターンで逸脱が避けられない場合。

例外がプロジェクト全体に及ぶなら `warn` / `off`、特定箇所に閉じるなら抑制コメントを使う。
抑制コメントは局所的に診断を消す技術的負債である。コメントには rule id、外部制約、lint 準拠案が不適切な理由、維持すべき不変条件を含める。

### 書式

理由は `--` の後ろに書く（日本語も通る）。

| 範囲               | 書式                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| 次の 1 行          | `// oxlint-disable-next-line <規則名> -- <理由>`（`// eslint-disable-next-line` でも同じ） |
| 範囲               | `/* oxlint-disable <規則名> -- <理由> */` と `/* oxlint-enable <規則名> */` で挟む         |
| JSX の子要素の位置 | `{/* oxlint-disable-next-line <規則名> -- <理由> */}`                                      |

- 複数行のブロックコメントの中の指示子は読まれない。1 行で書く。
- 規則名は、設定と同じ名前で書く。プラグインの規則は `jsx-a11y/anchor-has-content` のようにプラグイン名つき、基本の規則は `no-restricted-imports` のように名前だけである。診断に表示される `typescript(no-explicit-any)` のような括弧の表記は、抑制コメントでは通らない。
- 不要になった抑制コメントは、`reportUnusedDisableDirectives` により警告になる。
- 実例は、`src/components/UI/IconLink.tsx`（次の 1 行）と `src/components/UI/CodeBlock.tsx`（JSX の子要素の位置）にある。

## 強制していない規則

次の規則は、lint でも整形でも強制していない。再び強制する場合は、「同等の規則」を手がかりにする。

| 規則の目的                                                                | 強制しない理由                                                                                                                                                                                                                                                                                                                                                                                                                                              | 同等の規則                                                     |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 識別子の命名規則（PascalCase・camelCase）の強制                           | oxlint に同等の規則が無い。現在のコードには、camelCase でない名前を意図して使う箇所がある。UPPER_CASE の定数とキー（`src/constants.ts` の `LAYOUT`、`build/similarity/index.test.ts` の `PATH_DIST`）、外部 API のスネークケース（`build/popular/ga.ts` の `client_email`）、環境変数名（`build/ogp/worker-pool.ts` の `WORKER_SCRIPT`）、テストの React コンポーネントのモックのキー（`src/components/Page/_shared/HTMLParser.test.tsx` の `Alert`）である | typescript-eslint の `naming-convention`。oxlint には無い      |
| 正規表現リテラルを関数の外（モジュールの先頭）に置く                      | oxlint に同等の規則が無い。関数の中の正規表現リテラルは、現在のコードに 13 か所ある                                                                                                                                                                                                                                                                                                                                                                         | oxlint に無い。他の道具の同等の規則は調べていない              |
| `delete` 演算子の禁止                                                     | oxlint に同等の規則が無い。現在の `delete` は、動的なキーの `delete obj[key]` の 4 か所だけである。oxlint の `typescript/no-dynamic-delete` は動的なキーの `delete` が対象で、この 4 か所をすべて検出するため使っていない                                                                                                                                                                                                                                   | oxlint に無い（`typescript/no-dynamic-delete` は対象が異なる） |
| JSX の `cond && <X />` で、`cond` が数値のとき `0` が描画される誤りの検出 | oxlint に同等の規則が無い。左辺が数値の `&&` は、現在のコードに無い。左辺が `string` の 2 か所（`src/components/Page/_shared/PostSection.tsx`・`TagSection.tsx` の `href`）は、空文字でも画面に文字が出ない                                                                                                                                                                                                                                                 | eslint-plugin-react の `jsx-no-leaked-render`。oxlint には無い |
| 配列型の書き方（`T[]`）の統一                                             | `typescript/array-type` は oxlint にあるが、現在のコードの 7 か所（`array`）または 9 か所（`array-simple`）を検出するため有効にしていない                                                                                                                                                                                                                                                                                                                   | oxlint の `typescript/array-type`                              |
| 型だけを export する宣言に `export type` を求める                         | 型情報を使う規則で、型情報用の追加依存（`oxlint-tsgolint`）が要る。`--type-aware` を付けないと何も検出しない                                                                                                                                                                                                                                                                                                                                                | oxlint の `typescript/consistent-type-exports`                 |
| JSX 属性の並べ替え                                                        | oxlint・oxfmt のどちらにも無い                                                                                                                                                                                                                                                                                                                                                                                                                              | eslint-plugin-react の `jsx-sort-props`。oxlint には無い       |
| `export { a } from './a'` 形式の re-export を集めた barrel ファイルの禁止 | `oxc/no-barrel-file` は `export * from` と `export * as ns from` だけを検出し、`export { a } from './a'` は検出しない。現在の `src/` に barrel ファイルは無い（`index.ts(x)` も `export ... from` も 0 件）                                                                                                                                                                                                                                                 | oxlint の `oxc/no-barrel-file`（`export *` 形式だけ）          |

件数と有無は、2026-11-22 時点のコードで数えた。

- 関数の中の正規表現リテラル（13 か所）と `delete`（4 か所）は、git が追跡する `src`・`build`・`scripts`・`tests`・`next.config.mjs` のファイルを、TypeScript の AST で数えた。関数の中とは、関数宣言・関数式・アロー関数・メソッドの本体の中である。
- 左辺の型は、`tsconfig.json` の対象のファイルで、JSX の式コンテナにある `左辺 && <JSX />`（14 か所）を、TypeScript の型検査で調べた。
- `typescript/array-type` の件数は、`src scripts tests` を対象に、規則を有効にして oxlint で数えた。
- barrel ファイルは、`src` の `index.ts`・`index.tsx` を `find` で、`export ... from` を `rg` で数えた。

## 参照

- レイヤー依存: [layers.md](../architecture/layers.md#-レイヤー依存関係-critical)
- TypeScript 規約: [typescript.md](../conventions/typescript.md)
- スタイリング: [styling.md](../conventions/styling.md)
- 設定ファイル: [config-files.md](./config-files.md)
- E2E/VRT: [testing.md](../conventions/testing.md)
- oxlint: [oxlint の使い方](https://oxc.rs/docs/guide/usage/linter)、[JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)
- oxfmt: [oxfmt の使い方](https://oxc.rs/docs/guide/usage/formatter)
