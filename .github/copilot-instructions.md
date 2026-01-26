# AIアシスタント指示

> **Note**: このファイルは `AGENTS.md` と `CLAUDE.md` のシンボリックリンクの元となり、AIアシスタント間の一貫性を確保する。

## 言語設定

**IMPORTANT: 明示的に指示がない限り、常に日本語で応答すること。**

- すべての説明、コメント、ドキュメントは日本語で記述すること
- 技術用語とコードは英語のままで問題ない
- 日本語は常に「だ・である」調で記述すること

## プロジェクト概要

- TypeScript、React 19.x、Panda CSS を使用する Next.js 16.x のブログ
- ML を活用した日本語コンテンツに特化
- **SSG (Static Site Generation)**: データはビルド時に読み込み、Client Component は最小限

### 必須要件

```bash
# 開発/ビルドの前に必ず実行
npm run prebuild  # サブモジュール更新、コンテンツ処理、アセット生成
npm run dev       # HTTPSの8080番ポートで開発サーバー起動
```

**Dev Server**: `https://localhost:8080` を使用（HTTPSのみ）。HTTPは失敗する。

**Content Source**: `_article/_posts/*.md` は Git submodule である。**直接編集しないこと。**

## 🔴 重要ルール（必ず遵守）

これらは **CRITICAL** である。違反するとランタイムエラー、ビルド失敗、重大な不具合に繋がる。詳細ガイドは `.claude/rules/` にある（自動で読み込み済み）。

### 優先度レベル

- 🔴 **CRITICAL**: Must Follow (violations cause severe errors)
- 🟡 **IMPORTANT**: Should Follow (maintenance/quality may degrade)
- ⚪ **RECOMMENDED**: Best Practices (consistency improvement)

### コンポーネントアーキテクチャ

1. **ゼロマージン原則**: UIコンポーネントは外部マージンを設定しない。余白は親が `gap` や `Stack` で管理する。
2. **レイヤー依存**: UI ↔ Functional（独立）、Page → UI/Functional、App → 全レイヤー
3. **Server First**: デフォルトは Server Component。`'use client'` は対話が必要な場合のみ。

### スタイリング（Panda CSS）

4. **Hover States**: `:hover` を直接書く。`@media (any-hover: hover)` を手動で書かない（PostCSS が処理）。
5. **CSS Variables**: 色・余白・フォントはCSS変数（`var(--colors-*)`, `var(--spacing-*)`）を使う。

### プロジェクト固有

6. **React Compiler Check**: 最適化提案前に `~/next.config.mjs` の `reactCompiler` を確認する。
7. **Content Source Read-Only**: `_article/_posts/*.md` を直接編集しない。コンテンツ更新は `npm run prebuild` 経由。

## 重要な設定ファイル

AIエージェントは、変更提案の前に以下のファイルを確認すること。

| File              | Path                   | When to Check                                           |
| ----------------- | ---------------------- | ------------------------------------------------------- |
| Next.js Config    | `~/next.config.mjs`    | Before optimization suggestions (React Compiler status) |
| Biome Config      | `~/biome.json`         | Before architectural changes (layer dependencies)       |
| Panda CSS Config  | `~/panda.config.mts`   | Before styling changes (design tokens)                  |
| TypeScript Config | `~/tsconfig.json`      | Before type-related changes (strict mode, paths)        |
| PostCSS Config    | `~/postcss.config.cjs` | Before CSS changes (hover media queries)                |
| Package JSON      | `~/package.json`       | Before adding dependencies or scripts                   |

**Critical Checkpoints**:

- React Compiler optimizations: 先に `~/next.config.mjs` を読む
- Component layer violations: 先に `~/biome.json` を読む
- Styling conventions: 先に `~/panda.config.mts` を読む
- CSS processing (hover queries): 先に `~/postcss.config.cjs` を読む

## アーキテクチャ

### ディレクトリ構成

```
~/                              # プロジェクトルート
├── src/                        # ソースコード（import alias: @/）
│   ├── app/                    # Next.js App Router（routes）
│   ├── components/             # Reactコンポーネント
│   │   ├── App/                # Appシェル（Header, Footer, Layout）
│   │   ├── Page/               # ページ固有コンポーネント
│   │   │   └── _shared/        # 共通セクション
│   │   ├── UI/                 # 再利用UI（ゼロマージン）
│   │   └── Functional/         # 非表示のユーティリティコンポーネント
│   ├── ui/                     # Panda CSSスタイル（styled, tokens）
│   └── types/                  # TypeScript型定義
├── _article/                   # Git submodule（読み取り専用）
│   └── _posts/                 # Markdown記事
├── public/                     # 静的アセット
├── scripts/                    # build / prebuildスクリプト
└── [config files]              # 「重要な設定ファイル」を参照
```

**Path Reference Rules**:

- Config files: `~/filename` 形式（例: `~/next.config.mjs`）
- Source files: import は `@/path` を使う（例: `import { css } from '@/ui/styled'`）
- Submodule: `_article/_posts/*.md`（直接編集禁止）

### コンポーネントアーキテクチャ

コンポーネントは厳密なレイヤーと設計原則に従う。詳細は [🔴 重要ルール](#-重要ルール必ず遵守) と [components.md](.claude/rules/components.md) を参照すること。

- **Layer Responsibilities**: App（シェル）、Page（ロジック）、UI（視覚）、Functional（ユーティリティ）

## 開発

### Panda CSS によるスタイリング

プロジェクト固有の import と CSS 変数を使用する。

- **Import**: `import { css, styled } from '@/ui/styled'`
- **Hover States**: `:hover` を直接書く（PostCSSが自動でラップ）
- **CSS Variables**: 色・余白・角丸は `var(--colors-*)`, `var(--spacing-*)` などを使用

### パスエイリアス

- `@/*` → `src/*`（TypeScriptのimportエイリアス）
- `~/*` → プロジェクトルート（このドキュメントのみ）

**Note**: 本ドキュメントでの `~/` はユーザーのホームではなく、プロジェクトルートを指す。

### コンテンツパイプライン

コンテンツ処理フロー:

1. **Source**: `_article/_posts/*.md`（Git submodule / 読み取り専用）
2. **Processing**: `npm run prebuild` → 記事JSON、類似度JSON、OGP画像
3. **Consumption**: Next.js SSG がビルド時に JSON を読み込む

**Critical**: `_article/_posts/*.md` を直接編集してはいけない。

### テスト

- Framework: Vitest + React Testing Library
- Coverage: `npm run coverage`
- Focus: 実装ではなく挙動を検証
- 可能な限り 1 テスト 1 アサーション
- エッジケースとエラー条件をカバー

## ファイル別ルール

これらはパスに応じて自動適用される。詳細は `.claude/rules/` にある（自動読み込み済み）。

| File Pattern                   | Auto-Applied Rules                                     |
| ------------------------------ | ------------------------------------------------------ |
| `src/components/**/*`          | Layer dependencies, zero-margin, server-first          |
| `**/*.tsx` (styling)           | Panda CSS imports, CSS variables, hover states         |
| `**/*.{ts,tsx}` (types)        | Type safety, no `any`, type-only imports               |
| `_article/**/*`, `build/**/*`  | Read-only submodule, content pipeline flow             |
| `~/next.config.mjs`, `use*.ts` | React Compiler scope, custom hook memoization          |
| `**/*.test.ts{,x}`             | Vitest + React Testing Library, one assertion per test |
| `**/*.tsx` (Client)            | Require `'use client'` directive, verify necessity     |
| `**/*.tsx` (Server)            | Default mode, no `'use client'` unless interactive     |
| `~/biome.json`                 | Verify before suggesting layer dependency changes      |
| `~/panda.config.mts`           | Verify before styling convention changes               |
| `~/postcss.config.cjs`         | Verify before CSS processing changes (hover queries)   |

## コーディングルール

すべてのルールは `.claude/rules/` にあり、Claude Code が自動で読み込む。

**Task-Specific Guidelines**:

- Code generation, code review, commit messages, PR descriptions, test generation

**Coding Standards**:

- Components（layer dependencies, zero-margin principle）
- Styling（Panda CSS, CSS variables, hover states）
- TypeScript（type safety, import conventions）

**Project-Specific**:

- React Compiler optimization
- Content pipeline（submodule, prebuild process）

## 標準

### コーディング標準

- **TypeScript**: Strict mode, public API は明示型、type-only imports
- **React**: App Router、Server Component がデフォルト
- **Import Order**: external libs → internal utilities → components → types → styles/constants
- **File Naming**: コンポーネントは PascalCase、ユーティリティは camelCase、定数は UPPER_SNAKE
- **Comments**: 公開APIのみ JSDoc、冗長なコメントは不要
- **Security**: 入力検証、XSS/Injection 対策
- **Accessibility**: セマンティックHTML、必要に応じてARIA

### パフォーマンスと最適化

**Static Generation**:

- ルートベースのコード分割
- Next.js Image 最適化
- Bundle analysis: `npm run build:analyzer`

**React Compiler**:

⚠️ **CRITICAL: 最適化提案前に `~/next.config.mjs` を読むこと**

React Compiler（`reactCompiler: true`）はコンポーネントレンダリングを自動最適化する。

### 改善提案

**アーキテクチャ変更の前に**:

- **Evidence-based**: 可能な限り現状実装を確認
- **Context-aware**: SSG 特性（ビルド時データ・最小クライアント）を考慮
- **Appropriate scope**: 問題規模に適した範囲で変更
- **Avoid over-engineering**: 動的バックエンド/SPA向けのパターンは避ける（例: Repository pattern）
- **Check existing solutions**: 既存ユーティリティやパターンの重複は避ける

### 技術導入ガイドライン

**対象**: React Compiler、ビルドツール（Next.js / Webpack / esbuild）、フォーマッタ（Biome）、型チェック（TypeScript）、CSS-in-JS（Panda CSS）、テストフレームワーク（Vitest）、その他新技術や最適化。

**新技術の導入や既存最適化の撤去時**:

1. **前提の範囲を確認する**:
   - 公式ドキュメントで正確な能力を理解する
   - 「新しい=常に良い」とは考えない
   - 制約や非対応のケースを特定する

2. **挙動変更を検証する**:

   **本番で壊れた例**:
   - React Compiler: カスタムフックから `useMemo` を削除（結果: キャッシュが毎回再生成）
   - Next.js Tree-shaking: 強い DCE を有効化（結果: 必要な副作用コードが削除）
   - TypeScript strict mode: テストなしで有効化（結果: 潜在エラーが表面化）

3. **一般化を疑う**:
   - 「このツールはXを自動でやる」→ どの文脈？例外は？
   - 「Yは不要になった」→ 例外は？
   - 「ドキュメントにZと書いてある」→ それは普遍的？

   **実例**:
   - 「React Compilerは全てをメモ化する」→ 実際はコンポーネントレンダリングのみ（カスタムフックは対象外）
   - 「TypeScript strict modeは全エラーを防ぐ」→ 実行時バリデーションは必要
   - 「Panda CSSはランタイムゼロ」→ 事実だが原子クラスの読み込みは必要

4. **避けるべきアンチパターン**:
   - ❌ 「新機能があるので従来は不要」
   - ❌ 「コンパイルできたら多分OK」
   - ❌ 「フレームワークが賢いので考えなくていい」

## Git ワークフロー

### Pull Requests

Include:

- Title: Japanese, under 50 chars
- Overview: Purpose and background (1-2 sentences)
- Changes: Bulleted list of modifications
- Testing: What was verified

## クイックリファレンス

| Task              | Command                               |
| ----------------- | ------------------------------------- |
| Start development | `npm run prebuild && npm run dev`     |
| Dev server URL    | `https://localhost:8080` (HTTPS only) |
| Run tests         | `npm test`                            |
| Type check file   | `tsc --noEmit --skipLibCheck <file>`  |
| Lint file         | `npx @biomejs/biome check <file>`     |
| Lint all          | `npm run lint`                        |
| Build production  | `npm run prebuild && npm run build`   |
| Build (fast)      | `npx next build --webpack`            |
| Bundle analysis   | `npm run build:analyzer`              |

## 重要メモ

1. 日本語コンテンツは形態素解析を使用
2. ビルド依存: Playwright（`playwright install --only-shell`）
3. 環境: `TZ=Asia/Tokyo` をタイムスタンプに使用
4. Pre-commit: Husky + nano-staged

---

_Copilot、Claude Code、その他のAIアシスタント向け。簡潔で実用的に。_
