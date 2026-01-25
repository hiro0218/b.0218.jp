---
description: 'コード生成時の技術スタック準拠とコンポーネント分類ルール'
agent: 'agent'
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コード生成の指示

コード生成は本ルールに厳密に従うこと。

## 技術スタック準拠

### Next.js 16.x App Router

- **ページコンポーネント**: `export default function Page() {}` または `export default async function Page() {}`
- **レイアウト**: `layout.tsx` でルートグループ固有の設定
- **メタデータ**: `generateMetadata` 関数または `export const metadata` を使用
- **静的生成**: `generateStaticParams` で動的ルートの静的化
- **ルートグループ**: `(ArchivePage)`, `(PostPage)`, `(SinglePage)` 構造

### TypeScript

- **厳格な型定義**: `any` を避け、適切な型を明示
- **Result型（推奨）**: エラーハンドリングでは関数型アプローチ（Result型）を優先的に使用
  - 全関数に必須ではないが、失敗する可能性がある処理では積極的に活用
  - try-catchよりもResult型での明示的なエラー処理を推奨
- **パスマッピング**: `@/*` (src配下), `~/*` (ルート) を使用

### PandaCSS

- **プロジェクト統一import**: `import { css, styled } from '@/ui/styled'`
- **テンプレートリテラル構文（推奨）**: `css\`...\``with`@media` queries
  - このプロジェクトでは常にtemplate literal構文を使用
  - `css({ base: 'value', md: 'value' })` のようなobject syntaxは使用しない
- **ゼロマージン**: コンポーネントは外部スペーシングを設定しない（レイアウト専用コンポーネントは例外：`margin: auto` による中央寄せなど）
- **CSS変数使用（必須）**: `var(--colors-blue-500)` のようにCSS変数を使用
- **Hover states（必須）**: `:hover` を直接書く。`@media (any-hover: hover)` で手動ラップしない（PostCSS pluginが自動処理）

## プロジェクト固有の重要ルール

### Content Source Read-Only（必須）

**CRITICAL**: `_article/_posts/*.md` は**直接編集禁止**（Git submodule）。
更新は `npm run prebuild` のみ。処理ロジック（`build/article/*.ts`）の修正は可。

## React/Next.js 実装原則

### Server First Principle（重要）

**CRITICAL**: デフォルトはServer Component。`'use client'` は必要時のみ。

**Client Component が必要なケース**:

- React Hooks / イベントハンドラー / ブラウザAPI / リアルタイム更新

SSGのため、不要なClient化は避ける。

## コンポーネント分類ルール

### Layer Dependencies（重要）

コンポーネントのレイヤー間依存関係は厳密に定義されています（Biomeで自動チェック）：

```
App/ (top)
  ↓ depends on
Page/
  ↓ depends on
UI/ ← → Functional/ (independent)
```

**ルール**:

- `UI/` と `Functional/` は**独立レイヤー**（相互import禁止）
- `Page/` は `UI/` と `Functional/` に依存可能
- `App/` は全下位レイヤーに依存可能
- **下位レイヤーは上位レイヤーに依存不可**

### 配置先の判断

```tsx
// Page固有のコンポーネント → src/components/Page/
export const PostDetail = () => {
  /* 記事詳細表示 */
};

// 再利用可能なUIコンポーネント → src/components/UI/
export const Button = ({ children, onClick }: ButtonProps) => {
  /* ボタン */
};

// ロジックのみのコンポーネント → src/components/Functional/
export const GoogleAnalytics = () => {
  /* GA設定 */
};

// アプリケーションシェル → src/components/App/
export const Header = () => {
  /* ヘッダー */
};
```

## 命名規則

### 必須パターン

- **コンポーネント/型**: `PascalCase` (例: `PostDetail`, `ButtonProps`)
- **関数/変数**: `camelCase` (例: `calculateSimilarity`, `postData`)
- **定数**: `SCREAMING_SNAKE_CASE` (例: `MAX_POSTS_PER_PAGE`)
- **ファイル名（コンポーネント）**: `PascalCase.tsx` (例: `Button.tsx`, `PostDetail.tsx`)
- **ファイル名（ユーティリティ）**: `camelCase.ts` (例: `formatDate.ts`, `parseMarkdown.ts`)
- **テストファイル**: `元ファイル名.test.ts(x)`

### プロジェクト固有

- **App Routerページコンポーネント**: `Page` 固定（`export default function Page()` または `export default async function Page()`）
- **Pageコンポーネント（src/components/Page/）**: `PageName` 形式（例: `PostDetail`, `ArchiveList`）
- **型定義**: `Props` サフィックス (例: `PostProps`, `PageProps`)
- **ユーティリティ関数**: 動詞で開始 (例: `formatDate`, `parseMarkdown`)

## コード構造（要点）

- Server Componentがデフォルト（`'use client'` は必要時のみ）
- UIはゼロマージン、親で余白管理
- `export function` を基本に統一（既存は混在）

## コード記述順序

TSXファイル内の推奨順序。強制ではないが新規コードでは従うこと。

### ファイル全体の構造

1. **'use client' ディレクティブ**（Client Componentの場合のみ）
2. **Import文**（`typescript.md`の順序に従う）
   - 外部ライブラリ
   - 内部ユーティリティ
   - コンポーネント
   - 型定義
   - スタイル/定数（`css`, `styled` はここ）
3. **型定義・インターフェース**（コンポーネント外部）
4. **定数**（コンポーネント外部、SCREAMING_SNAKE_CASE）
5. **メインコンポーネント**
6. **サブコンポーネント**（必要な場合）
7. **styled component**（Panda CSSのstyled関数）
8. **ヘルパー関数**（コンポーネント外部）

### コンポーネント内部の順序

1. **Hooks**
   - useState
   - useRef
   - useContext
   - カスタムhooks（useIsClient, useId, useSearchなど）
2. **計算された値**
3. **Effect hooks**
4. **イベントハンドラー関数**
   - handleClick, handleSubmitなど
5. **ヘルパー関数**（コンポーネント内部）
   - formatValue, validateInputなど
6. **Early return**（条件付きレンダリング）
   - if (!data) return null;
7. **メインrender**
   - return文

### スタイリング（css/styled）の配置ルール

- `css/styled/cx` はImportの「スタイル/定数」位置
- styled component はメインコンポーネントの後に配置
- `styled`: 再利用/複雑/命名したいスタイル
- `css`: 局所/シンプルなスタイル
- `cx`: クラス結合/条件付与

### Hover States（重要）

**CRITICAL**: `:hover` を直接書く。`@media (any-hover: hover)` で手動ラップしない。

### 例外と柔軟性

以下の場合は順序を調整可能：

- **パフォーマンス最適化**が必要な場合
- **特定のライブラリの要求**がある場合
- **可読性が明らかに向上**する場合
- **Reactのルール**（hooksは条件分岐の前に全て呼び出す）を優先

### 既存コードへの適用

- **新規コード**: この順序に従うことを推奨
- **既存コード**: 大規模な変更時にのみ整理を検討
- **リファクタリング**: 段階的に適用（一度に全ファイルを変更しない）

## 必須実装パターン

### 1. エラーハンドリング

- Result型で成功/失敗を明示
- 例外は型安全に扱い、握りつぶさない

### 2. パフォーマンス最適化

- 最適化提案前に `~/next.config.mjs` の `reactCompiler` を確認
- 目的・効果が明確な場合のみ適用

### 3. アクセシビリティ

- セマンティックHTML + 必要なARIA
- フォーカス/キーボード操作に配慮

### 4. SEO対応

- `generateMetadata` / `metadata` を適切に設定

## 品質基準

### 必須チェック項目

- TypeScriptエラーなし / Lint警告なし / 未使用なし
- 公開APIはJSDoc / テスト可能な構造
- レスポンシブ対応 / アクセシビリティ配慮

### 自動チェックコマンド

- `tsc --noEmit --skipLibCheck`
- `npm run lint`
- `npm test`
