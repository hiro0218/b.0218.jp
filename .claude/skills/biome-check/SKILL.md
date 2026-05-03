---
name: biome-check
description: Run Biome lint/format check on modified TypeScript and JavaScript files and fix violations. Use after editing *.ts, *.tsx, *.js, *.jsx, *.mjs files and before reporting task completion or recommending git commit. Triggered by "/biome-check", "biome check", "lint check", or proactively as part of post-edit verification.
---

# Biome Check

プロジェクト規約 (`biome.json` + `.claude/rules/linting.md`) に従って lint / format 違反を検出・修正する。

## When to use

- コード編集を伴うタスクの完了報告前
- `git commit` を提案する前
- ユーザーが `/biome-check` を実行したとき

## Skip when

- 編集が非コードファイル (`.md`, `.json`, `.yml`, `.toml`, `.css`) のみ。ただし `biome.json` を編集した場合は `npx biome check biome.json` を実行する
- 既に直前で同じファイル群を check 済み

## Steps

### 1. 対象ファイル特定

優先順位:

1. 当該タスクで編集 / 作成したファイル
2. `git status --short` の `M` / `A` / `??` から `*.{ts,tsx,js,jsx,mjs}` を抽出
3. `_article/**`, `dist/**`, `styled-system/**`, `node_modules/**`, `.next/**` は除外 (biome.json の `files.includes` で既に除外)

### 2. Read-only check

```bash
npx biome check <files...>
```

編集対象ファイルを明示して `biome` を直接呼ぶ。`npm run lint` は `src build tools tests` を対象にするが、対象ファイルを限定できない。

### 3. 違反対応

**自動修正を即時適用しない**。ルールを理解してから対応する:

- 違反の rule id (例: `lint/performance/useTopLevelRegex`) を確認
- `.claude/rules/linting.md` でプロジェクト固有の意図を確認 (recommended からの override や厳格化の理由)
- 必要に応じて `biome.json` の該当 rule 設定を読む
- 修正方針:
  - **意図的な逸脱**でない限り、コード側を修正する (rule を抑制しない)
  - 安全な auto-fix のみ適用したい場合は `npx biome check --write <files>`
    - `--write` は safe fix のみ自動適用される。構造変更を伴う fix (例: `useTopLevelRegex` の定数化、`useExportType` の `import type` への書き換え) は **手動修正が必要**
  - `--unsafe` は使わない (semantics が変わる可能性)
  - rule 抑制 (`biome-ignore`) を検討する場合は `.claude/rules/linting.md` の該当節を参照する。原則は「局所的な正当化」または「SDK 慣用パターン」のみ

### 4. 再 check

`npx biome check <files...>` を再実行し 0 errors を確認。warnings は方針に応じて対応 (プロジェクトでは warn は記録のみで blocking しない例が多い)。

### 5. 報告

- 成功時: 1 行で完了 (例: "biome check 0 violations")
- 修正不能 / 意図的な保留: 理由を明示 (rule id, トレードオフ)

## プロジェクト固有の注意

`.claude/rules/linting.md` で error 化されているルール (recommended 以上に厳格化):

| rule                  | 意図                                            |
| --------------------- | ----------------------------------------------- |
| `noExplicitAny`       | TypeScript any 禁止の機械的強制                 |
| `noUnusedVariables`   | rest siblings は許容                            |
| `noDelete`            | パフォーマンス                                  |
| `useTopLevelRegex`    | 関数内 regex literal 禁止、トップレベル定数化   |
| `useNamingConvention` | PascalCase / camelCase 強制 (strictCase: false) |

`useTopLevelRegex` は spec ファイルでも適用される。テスト内で `expect(x).toMatch(/.../)` のような inline regex はトップレベル定数に切り出す。

## 周辺ツールとの関係

| 仕組み                                  | 検出タイミング          | スコープ                         |
| --------------------------------------- | ----------------------- | -------------------------------- |
| 本 Skill                                | コード編集後、commit 前 | 編集対象ファイル全て             |
| `nano-staged` (pre-commit)              | `git commit` 直前       | staged な `**/*.{ts,tsx,js,mjs}` |
| `npm run lint` (CI / pr-validation.yml) | PR open / sync          | `src build tools tests`          |

本 Skill は CI / pre-commit のすり抜け (特に `tests/` 配下) を AI セッション中に防ぐのが目的。
