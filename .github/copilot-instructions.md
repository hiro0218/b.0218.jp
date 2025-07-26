# GitHub Copilot 指示書

## プロジェクトアーキテクチャ概要

これは Next.js 15.x App Router で構築された高性能な日本語ブログサイトで、高度なコンテンツ処理と ML 駆動の記事類似度分析機能を備えています。

### コアシステム設計

**多段階ビルドパイプライン**: プロジェクトでは開発前に必ず実行すべき複雑なプリビルドプロセス（`npm run prebuild`）が必要です：

1. すべてのブログコンテンツを含む git サブモジュール（`_article/`）を更新
2. Markdown → JSON 処理（`build:article`）- フロントマターを含む `_article/_posts/*.md` を構造化 JSON に変換
3. TF-IDF + 日本語形態素解析を使用した記事類似度計算（`build:similarity`）- 日本語テキスト処理に kuromoji を使用
4. Google Analytics から人気データを生成（`build:popular`）
5. マルチワーカーアーキテクチャを使用した Playwright による OGP 画像作成（`build:ogp`）- HTML テンプレートサーバーを使ったクラスターベースのワーカープール

**コンテンツアーキテクチャ**: git サブモジュール（`_article/_posts/*.md`）に保存された記事 → ルートディレクトリの複数の JSON 出力に処理 → 静的生成で使用。主要データファイル：`posts.json`、`posts-list.json`、`tags-similarity.json`、`posts-similarity.json`。

### App Router 構造とレイアウトシステム

`src/app/` は特定のレイアウトパターンを使用したルートグループで Next.js 15.x App Router に従っています：

- `(ArchivePage)/`: アーカイブリスト（`archive/`）、人気記事（`popular/`）、タグページ（`tags/`）とページネーション - `Container` サイズ「small」（768px）を使用
- `(PostPage)/[slug]/`: `.html` サフィックスサポート付きの個別ブログ記事 - `Container` サイズ「default」（1024px）を使用
- `(SinglePage)/`: 静的ページ（about、privacy）- `Container` サイズ「default」を使用

**レイアウト設計**: `src/components/Functional/Container.tsx` で定義された統一コンテナシステム（small: 768px, default: 1024px, large: 1280px）を使用。各ルートグループには独自の `layout.tsx` があり、適切なコンテナサイズと `Stack` レイアウト（`space={4}`）を設定。

### 重要な開発ワークフロー

**必ずプリビルドを最初に実行**：

```bash
npm run prebuild  # dev/build 前に必須 - サブモジュールコンテンツを処理
npm run dev       # ポート 8080 で HTTPS + Node インスペクター（--inspect フラグ）
```

**開発依存関係**：

- コンテンツ用 git サブモジュールが必要（`_article/`）
- Playwright インストールが必要（`playwright install --only-shell`）
- ビルドスクリプトでの TypeScript 実行に esbuild-register を使用
- すべてのビルドスクリプトは一貫したタイムスタンプのため `TZ=Asia/Tokyo` で実行

**コンポーネントアーキテクチャ**：

- `src/components/Page/`: ページ固有のコンポーネント（Post、Archive、Single、Share）
- `src/components/UI/`: 再利用可能な UI コンポーネント - ゼロマージン原則（外部スペーシングなし）
- `src/components/Functional/`: ユーティリティコンポーネント（Container、GoogleAdSense など）
- `src/components/App/`: アプリケーションシェルコンポーネント（Header、Footer、Layout コンテナ）

**スタイリング原則**: コンポーネントは自身のマージンを設定しません - 親コンテナがすべてのレイアウトスペーシングを制御します。`import { css, styled } from '@/ui/styled/static'` でPanda CSS テンプレートリテラルを使用。

### スタイリングシステム

**PandaCSS 設定**: カスタム Panda CSS セットアップを使用：

- `styled-system/`: 生成された CSS ユーティリティ
- `src/ui/styled/`: カスタム変数、アニメーション、グローバルスタイル
- テンプレートリテラル構文専用（`syntax: 'template-literal'`）
- デフォルトトークンなし（`presets: []`、`eject: true`）でカスタムグローバル変数を使用
- CSS リセットなし（`preflight: false`）、shokika.css を使用

**重要なスタイリングパターン**:

```tsx
// 統一されたimport
import { css, styled } from '@/ui/styled/static';

// テンプレートリテラル使用
const StyledDiv = styled.div`
  background-color: var(--color-gray-3A);
  padding: var(--space-2);
`;

// CSS変数の使用（カスタムグローバル変数システム）
const buttonStyle = css`
  color: var(--color-gray-12);
  font-size: var(--font-size-md);
  border-radius: var(--border-radius-4);
`;
```

### ビルドプロセスの詳細

**類似度エンジン**（`build/similarity/`）: 以下を使用した高度な ML パイプライン：

- 日本語形態素解析（kuromoji）
- カスタムストップワードを使用した TF-IDF ベクトル化
- タグ関係性のための NPMI（正規化点相互情報量）
- 新しさボーナス付きのコンテンツ + タグ類似度スコアリング
- パフォーマンス向上のための LRU キャッシング

**OGP 生成**（`build/ogp/`）: マルチワーカー Playwright セットアップ：

- 並列画像生成のためのクラスターベースワーカープール
- ページ再利用とコネクションプーリング
- HTML テンプレートサーバー + スクリーンショット自動化

### TypeScript 設定

**パスマッピング**: `@/*` を `src/*` に、`~/*` をプロジェクトルートに使用
**モジュールシステム**: バンドラー解決で `"module": "Preserve"`
**テスト**: jsdom 環境での Vitest（`globals: true`）
**型定義**: `src/types/source.d.ts` 内のコア型 - `PostProps`、`PageProps`、類似度データ構造

### 主要な慣例

**ルート生成**: JSON データからの静的パラメータ（`generateStaticParams`）
**メタデータ**: OGP 画像、構造化データ（JSON-LD）で SEO 最適化
**エラーハンドリング**: 関数型エラーハンドリングのための Result 型（`build/similarity/result.ts`）
**日本語コンテンツ**: 日本語形態素解析のための特別なテキスト処理
**データフロー**: サブモジュール → ビルドスクリプト → JSON ファイル → 静的生成（JSON ファイルを直接変更しない）

### パフォーマンス最適化

- バンドル分析（`npm run build:analyzer`）
- ルートグループによるコード分割
- ISR ライクなデータ更新を伴う静的生成
- 最適化された画像処理とキャッシング
- ESLint の代わりに高速な Biome を使用（`npm run lint`）
- Stylelint for CSS-in-JS（`npm run lint:css`）とMarkuplint（`npm run lint:markup`）

### 開発環境固有事項

**必要なツール**: `playwright install --only-shell`、ビルドスクリプト用の esbuild-register
**ポート設定**: 開発サーバーはポート 8080 で実験的 HTTPS サポートと共に動作
**環境変数**: 一貫したタイムスタンプ処理のため `TZ=Asia/Tokyo` が必要
**Git ワークフロー**: プリビルドによるサブモジュール自動更新、コンテンツファイルを手動編集しない

このコードベースで作業する際は、日本語コンテンツのコンテキスト、多段階ビルド要件、パフォーマンス重視の類似度計算を必ず考慮してください。
