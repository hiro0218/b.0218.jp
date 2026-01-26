---
description: 'コード生成時の技術スタック準拠とコンポーネント分類ルール'
agent: 'agent'
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コード生成の指示

コード生成は本ルールに厳密に従うこと。

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

## 技術スタック準拠

### Next.js 16.x App Router

- **ページコンポーネント**: `export default function Page() {}` または `export default async function Page() {}`
- **レイアウト**: `layout.tsx` でルートグループ固有の設定
- **メタデータ**: `generateMetadata` 関数または `export const metadata` を使用
- **静的生成**: `generateStaticParams` で動的ルートの静的化
- **ルートグループ**: `(ArchivePage)`, `(PostPage)`, `(SinglePage)` 構造

### TypeScript

**詳細**: [typescript.md](./typescript.md)

- **厳格な型定義**: `any` を避け、適切な型を明示
- **Result型（推奨）**: エラーハンドリングでは関数型アプローチ（Result型）を優先的に使用
  - 全関数に必須ではないが、失敗する可能性がある処理では積極的に活用
  - try-catchよりもResult型での明示的なエラー処理を推奨
- **パスマッピング**: `@/*` (src配下), `~/*` (ルート) を使用

### PandaCSS

スタイリングの詳細は `styling.md` に集約しています。

**詳細**: [styling.md](./styling.md)

## プロジェクト固有の重要ルール

アーキテクチャ横断のルールは `architecture.md` に集約しています。

**詳細**: [architecture.md](./architecture.md)

## コンポーネント分類ルール

### Layer Dependencies（重要）

コンポーネントは厳密なレイヤー構造に従う（Biomeで自動チェック）：`App/` → `Page/` → `UI/` ↔ `Functional/`

**詳細**: [components.md - Layer Dependencies](./components.md#layer-dependencies-critical)

## 命名規則

**詳細**: [typescript.md - 命名規則](./typescript.md#命名規則-important)

## コード構造（要点）

- `export function` を基本に統一（既存は混在）
- Server First / Zero Margin などの原則は `architecture.md` と `components.md` を参照

## コード記述順序

TSXファイル内の推奨順序。強制ではないが新規コードでは従うこと。

### ファイル全体の構造

1. **'use client' ディレクティブ**（Client Componentの場合のみ）
2. **Import文**（**詳細**: [typescript.md - Import順序](./typescript.md#-import順序-important)）
3. **型定義・インターフェース**（コンポーネント外部）
4. **定数**（コンポーネント外部、SCREAMING_SNAKE_CASE）
5. **メインコンポーネント**
6. **サブコンポーネント**（必要な場合）
7. **styled component**（Panda CSSのstyled関数）
8. **ヘルパー関数**（コンポーネント外部）

### コンポーネント内部の順序

1. **Hooks** (useState → useRef → useContext → カスタムhooks)
2. **計算された値**
3. **Effect hooks**
4. **イベントハンドラー関数**
5. **ヘルパー関数** (コンポーネント内部)
6. **Early return** (条件付きレンダリング)
7. **メインrender**

### スタイリング（css/styled）の配置ルール

- `css/styled/cx` はImportの「スタイル/定数」位置
- styled component はメインコンポーネントの後に配置
- `styled`: 再利用/複雑/命名したいスタイル
- `css`: 局所/シンプルなスタイル
- `cx`: クラス結合/条件付与

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

**詳細**: [react-compiler-optimization.md](./react-compiler-optimization.md)

- 最適化提案前に `~/next.config.mjs` の `reactCompiler` を確認
- 目的・効果が明確な場合のみ適用

### 3. アクセシビリティ

- セマンティックHTML + 必要なARIA
- フォーカス/キーボード操作に配慮

### 4. SEO対応

- `generateMetadata` / `metadata` を適切に設定

## 品質基準

### 必須チェック項目

- 公開APIはJSDoc（typescript.md参照）
- テスト可能な構造
- レスポンシブ対応 / アクセシビリティ配慮

### 自動チェックコマンド

- `tsc --noEmit --skipLibCheck` (型チェック)
- `npm run lint` (Biome: コードスタイル、未使用変数、Layer Dependencies)
- `npm test` (テスト実行)
