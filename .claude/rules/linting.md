---
paths:
  - 'biome.json'
  - '**/*.{ts,tsx,js,mjs}'
---

# Biome Linting 規則

## 方針

`recommended: true` + 例外のみ override。Biome アップデートで recommended に追加されるルールは自動的に有効になる。

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

| ルール                   | 設定  | 理由                                                                                                                                                 |
| ------------------------ | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noExplicitAny`          | error | TypeScript 規約 `any` 禁止を機械的に強制                                                                                                             |
| `noUnusedVariables`      | error | `ignoreRestSiblings: true` で分割代入の残余は許容                                                                                                    |
| `noDelete`               | error | パフォーマンス。非 recommended だが明示的に追加                                                                                                      |
| `useTopLevelRegex`       | error | パフォーマンス。非 recommended だが明示的に追加                                                                                                      |
| `useConsistentArrayType` | warn  | 非 recommended。`T[]` 短縮記法を推奨。**注意**: グローバル code-style.md は `Array<T>` を推奨しており矛盾する。プロジェクトでは Biome の lint に従う |
| `useNamingConvention`    | error | 非 recommended。`strictCase: false` で PascalCase/camelCase を強制、完全一致は不要                                                                   |

### Nursery

| ルール           | 設定 | 理由                                                                             |
| ---------------- | ---- | -------------------------------------------------------------------------------- |
| `noLeakedRender` | warn | `{count && <Comp />}` の誤りを検出。現在の全箇所は安全な型だが将来の検出用に監視 |

## ファイル除外

### `files.includes`（全ツール共通）

| パターン              | 理由                               |
| --------------------- | ---------------------------------- |
| `!**/*.css`           | CSS は Stylelint + Prettier で処理 |
| `!.github/scripts/**` | CI スクリプトは対象外              |
| `!_article/**`        | Git submodule（読み取り専用）      |

`.gitignore` に記載されたパターン（`.next`, `dist`, `styled-system` 等）は VCS 統合で自動除外される。

### `linter.includes`（リンターのみ）

| パターン     | 理由                                              |
| ------------ | ------------------------------------------------- |
| `!build/**`  | ビルドスクリプト。formatter は適用、linter は除外 |
| `!public/**` | 静的アセット                                      |

| `!**/*.config.js` | 設定ファイルは lint 対象外 |

## Assist

- `organizeImports: on`: import 文を自動ソート
- `useSortedAttributes: on`: JSX 属性をアルファベット順にソート

## VCS 統合

- `useIgnoreFile: true`: `.gitignore` を尊重し `files.includes` での二重管理を排除
- `defaultBranch: "master"`: `--changed` / `--staged` オプションが利用可能

## レイヤー依存の強制

`noRestrictedImports` の overrides で UI/Functional/Page/App 層の依存方向を機械的に強制。
全レイヤーで `~/styled-system/*` の直接 import も禁止（`@/ui/styled` 経由に統一）。
詳細は [components.md](./components.md) と [styling.md](./styling.md) を参照。

## biome-ignore の使用基準

SDK/外部ライブラリの慣用パターン（例: AdSense SDK 初期化）にのみ許可。理由コメント必須。

## 参照

- レイヤー依存: [components.md](./components.md)
- TypeScript 規約: [typescript.md](./typescript.md)
- スタイリング: [styling.md](./styling.md)
- 設定ファイル: [config-files.md](./config-files.md)
