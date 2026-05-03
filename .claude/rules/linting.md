---
paths:
  - 'biome.json'
  - 'package.json'
  - '**/*.{ts,tsx,js,jsx,mjs}'
---

# Linting / Biome 規則

## 設定方針

`recommended: true` + 例外のみ override する。Biome アップデートで recommended に追加されるルールは自動的に有効になる。

| ドメイン     | 設定          | 補足                                                                   |
| ------------ | ------------- | ---------------------------------------------------------------------- |
| `next`       | `recommended` | Next.js プロジェクトのため有効                                         |
| `playwright` | `recommended` | E2E/VRT で Playwright を使用。nursery ルールは別途明示宣言が必要である |

## ファイル除外

### `files.includes`（全ツール共通）

| パターン           | 理由                               |
| ------------------ | ---------------------------------- |
| `!**/*.css`        | CSS は Stylelint + Prettier で処理 |
| `!.github/scripts` | CI スクリプトは対象外              |
| `!_article`        | Git submodule（読み取り専用）      |

`.gitignore` に記載されたパターン（`.next`, `dist`, `styled-system` など）は VCS 統合で自動除外される。

### `linter.includes`（リンターのみ）

| パターン          | 理由                                              |
| ----------------- | ------------------------------------------------- |
| `!build/**`       | ビルドスクリプト。formatter は適用、linter は除外 |
| `!public/**`      | 静的アセット                                      |
| `!**/*.config.js` | 設定ファイルは lint 対象外                        |

## npm scripts / AI 実行

- `npm run lint`: `biome check src build tools tests`
- `npm run lint:write`: `biome check --write --unsafe src build tools tests`
- 編集ファイルだけを確認する場合は `npx biome check <files...>` を直接実行する。
- AI セッション中の自動修正では [biome-check Skill](../skills/biome-check/SKILL.md) を優先し、`--unsafe` は使わない。
- `biome.json` を編集した場合は、非コードファイルだけの変更でも `npx biome check biome.json` で設定ファイル自体を検証する。

## 意図的な例外

### 無効化・緩和（recommended からの変更）

| ルール                      | 設定 | 理由                                                                                        |
| --------------------------- | ---- | ------------------------------------------------------------------------------------------- |
| `noDangerouslySetInnerHtml` | off  | ブログが HTML をレンダリングする（JSON-LD、検索ハイライト、Alert）。`WithChildren` 版は有効 |
| `noSvgWithoutTitle`         | off  | 装飾アイコンは `aria-hidden` で対応済み                                                     |
| `useBlockStatements`        | off  | 単一式の if/arrow は波括弧なしを許容                                                        |
| `noNoninteractiveTabindex`  | warn | カスタムウィジェットでの意図的な使用あり                                                    |
| `useExhaustiveDependencies` | warn | pathname トリガー等の意図的な依存省略を許容                                                 |
| `useImportType`             | warn | 段階的な移行のため                                                                          |
| `noImgElement`              | warn | ZoomImage・Logo 等で意図的に `<img>` を使用                                                 |

### 厳格化・追加（recommended 以上）

| ルール                   | 設定  | 理由                                                                               |
| ------------------------ | ----- | ---------------------------------------------------------------------------------- |
| `noExplicitAny`          | error | TypeScript `any` 禁止を機械的に強制                                                |
| `noUnusedVariables`      | error | `ignoreRestSiblings: true` で分割代入の残余は許容                                  |
| `noDelete`               | error | パフォーマンス。非 recommended だが明示的に追加                                    |
| `useTopLevelRegex`       | error | パフォーマンス。非 recommended だが明示的に追加                                    |
| `useConsistentArrayType` | warn  | 非 recommended。プロジェクトでは `T[]` 短縮記法を推奨                              |
| `useNamingConvention`    | error | 非 recommended。`strictCase: false` で PascalCase/camelCase を強制、完全一致は不要 |

### Nursery / Playwright

| ルール                          | 設定  | 理由                                                     |
| ------------------------------- | ----- | -------------------------------------------------------- |
| `noLeakedRender`                | warn  | `{count && <Comp />}` の誤りを将来検出する監視           |
| `noPlaywrightNetworkidle`       | error | [testing.md](./testing.md) の deterministic な待機に整合 |
| `noPlaywrightWaitForTimeout`    | error | タイムアウトベースのアサーション禁止                     |
| `noPlaywrightWaitForNavigation` | error | deprecated API でレースが起きやすい                      |
| `noPlaywrightForceOption`       | error | `{ force: true }` は根本的な問題を隠す                   |
| `noPlaywrightMissingAwait`      | error | async API の await 漏れは致命的バグ                      |
| `noPlaywrightPagePause`         | error | `page.pause()` の commit 残留を防ぐ                      |
| `noPlaywrightWaitForSelector`   | warn  | locator API 推奨。既存コード移行のため warn              |
| `noPlaywrightElementHandle`     | warn  | locator API 推奨                                         |
| `noPlaywrightEval`              | warn  | locator API 推奨                                         |
| `noPlaywrightUselessAwait`      | warn  | 不要な await の検出                                      |

## レイヤー依存 / import

`noRestrictedImports` の overrides で UI/Functional/Page/App 層の依存方向を機械的に強制する。全レイヤーで `~/styled-system/*` の直接 import も禁止し、`@/ui/styled` 経由に統一する。

## biome-ignore の使用基準

以下のいずれかに該当する場合に許可する。理由コメントは必須である。

1. ルールの意図には合致するが、この箇所では別の制約により例外が妥当な場合。
2. SDK / 外部ライブラリの慣用パターンで逸脱が避けられない場合。

例外がプロジェクト全体に及ぶなら `warn` / `off`、特定箇所に閉じるなら `biome-ignore` を使う。

## 参照

- レイヤー依存: [components.md](./components.md#-レイヤー依存関係-critical)
- TypeScript 規約: [typescript.md](./typescript.md)
- スタイリング: [styling.md](./styling.md)
- 設定ファイル: [config-files.md](./config-files.md)
- E2E/VRT: [testing.md](./testing.md)
