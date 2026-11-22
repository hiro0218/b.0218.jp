---
name: oxlint-check
description: Run oxlint and oxfmt checks on modified TypeScript and JavaScript files and fix violations. Use after editing *.ts, *.tsx, *.js, *.jsx, *.mjs files and before reporting task completion or recommending git commit. Triggered by "/oxlint-check", "oxlint check", "lint check", or proactively as part of post-edit verification.
---

# Oxlint Check

プロジェクト規約 (`.oxlintrc.json` + `.oxfmtrc.json` + `docs/tooling/linting.md`) に従って lint / format 違反を検出・修正する。

## When to use

- コード編集を伴うタスクの完了報告前
- `git commit` を提案する前
- ユーザーが `/oxlint-check` を実行したとき

## Skip when

- 編集が非コードファイル (`.md`, `.json`, `.yml`, `.toml`, `.css`) のみ。ただし `.oxlintrc.json` を編集した場合は `./node_modules/.bin/oxlint src`、`.oxfmtrc.json` を編集した場合は `./node_modules/.bin/oxfmt --check src` を実行して、設定を読み込めることを確かめる
- 既に直前で同じファイル群を check 済み

## Steps

### 1. 対象ファイル特定

優先順位:

1. 当該タスクで編集 / 作成したファイル
2. `git status --short` の `M` / `A` / `??` から `*.{ts,tsx,js,jsx,mjs}` を抽出
3. `_article/**`, `dist/**`, `styled-system/**`, `node_modules/**`, `.next/**` は除外する。`_article` は `.oxlintrc.json` と `.oxfmtrc.json` の `ignorePatterns`、`dist` / `styled-system` / `node_modules` / `.next` は `.gitignore` で除外される

### 2. Read-only check

```bash
./node_modules/.bin/oxlint <files...>
./node_modules/.bin/oxfmt --check <files...>
```

編集対象ファイルを明示して直接呼ぶ。`npm run lint` は oxlint が `src scripts tests`、oxfmt が `src build scripts tests` を対象にするが、対象ファイルを限定できない。

`build/` や `**/*.config.js` など、oxlint の `ignorePatterns` で除外されるファイルだけを渡すと、oxlint は `No files found to lint.` で終了コード 1 になる。そのファイルには oxfmt だけを実行する。

### 3. 違反対応

**自動修正を即時適用しない**。ルールを理解してから対応する:

- 違反の rule id (例: 診断の `typescript(no-explicit-any)`。設定と抑制コメントでは `typescript/no-explicit-any` と書く) を確認
- `docs/tooling/linting.md` でプロジェクト固有の意図を確認 (`correctness` からの変更や厳格化の理由)
- 必要に応じて `.oxlintrc.json` の該当 rule 設定を読む
- 修正方針:
  - **意図的な逸脱**でない限り、コード側を修正する (rule を抑制しない)
  - lint の安全な auto-fix のみ適用したい場合は `./node_modules/.bin/oxlint --fix <files>`
    - `--fix` は安全な修正だけを適用する。未使用の import の削除のような提案は適用されないので、手動で直す
  - `--fix-suggestions` は使わない (未使用の import の削除など、挙動が変わる可能性のある修正も適用する)
  - 整形の違反は `./node_modules/.bin/oxfmt <files>` で直す (import の並べ替えを含む)
  - rule 抑制 (`oxlint-disable-next-line`) を検討する場合は `docs/tooling/linting.md` の「抑制コメントの使用基準」を参照する。原則は「局所的な正当化」または「SDK 慣用パターン」のみ

### 4. 再 check

`./node_modules/.bin/oxlint <files...>` と `./node_modules/.bin/oxfmt --check <files...>` を再実行し、oxlint の 0 errors と、oxfmt の整形済みを確認。warnings は `docs/tooling/linting.md` の方針に従う (新規・変更コードは rule の意図に沿って直し、既存コードは変更箇所と近傍を寄せる)。

### 5. 報告

- 成功時: 1 行で完了 (例: "oxlint 0 violations, oxfmt clean")
- 修正不能 / 意図的な保留: 理由を明示 (rule id, トレードオフ)

## プロジェクト固有の注意

厳格化ルールの一覧と理由は `docs/tooling/linting.md` を参照する。
命名規則や関数内の正規表現リテラルなど、強制していない規則は、同じ文書の「強制していない規則」にある。これらは oxlint・oxfmt の違反として報告されない。

## 周辺ツールとの関係

| 仕組み                                  | 検出タイミング          | スコープ                                                          |
| --------------------------------------- | ----------------------- | ----------------------------------------------------------------- |
| 本 Skill                                | コード編集後、commit 前 | 編集対象ファイル全て                                              |
| `nano-staged` (pre-commit)              | `git commit` 直前       | staged な `**/*.{ts,tsx,js,mjs}`                                  |
| `npm run lint` (CI / pr-validation.yml) | PR open / sync          | oxlint は `src scripts tests`、oxfmt は `src build scripts tests` |

本 Skill は CI / pre-commit のすり抜け (特に `tests/` 配下) を AI セッション中に防ぐのが目的。
