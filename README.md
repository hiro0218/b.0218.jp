# b.0218.jp

This repository contains the source code for `b.0218.jp`, a Japanese-focused blog built with Next.js, React 19, and TypeScript. Article data is stored in a separate repository and loaded through a submodule.

## Technologies used

### Core

- [Next.js](https://nextjs.org/) 16.x (App Router)
- [React](https://react.dev/) 19.x
- [TypeScript](https://www.typescriptlang.org/)
- [Panda CSS](https://panda-css.com/) - CSS-in-JS styling system

### Development

- [Biome](https://biomejs.dev/) - Fast linter and formatter
- [Vitest](https://vitest.dev/) - Unit testing framework
- [Playwright](https://playwright.dev/) - Screenshot generation for OG images

### Features

- **ML-Powered Recommendations**: Article similarity analysis using Japanese morphological analysis (kuromoji)
- **Analytics Integration**: Google Analytics with popular articles tracking
- **OG Image Generation**: Automated Open Graph image generation using Playwright
- **Static Generation**: Pre-built article data for optimal performance

Article data is managed in a separate repository and loaded via submodule.

## Architecture

このプロジェクトは、ML処理や外部API連携などの重い処理をビルド時(`prebuild`)に完結させ、ランタイムを静的なファイル配信のみに保つ設計になっている。主要なフローを以下のシーケンス図で示す。

### 1. Prebuild pipeline: from submodule to `dist/`

`npm run build` 実行時、npm の pre-script の仕組みで `prebuild` (`scripts/prebuild.sh`) が自動的に先行実行される。Git submodule の記事データ取得から、記事変換、類似度・検索・人気記事・タグ分類の並列処理、OGP 画像生成まで、外部システム(GitHub、リンク先サイト、Google Analytics、はてなブックマーク)とのやり取りはすべてこの段階に集約される。

```mermaid
sequenceDiagram
    actor Dev as Developer / CI
    participant Git as Git submodule
    participant Article as build:article
    participant Web as 外部サイト(リンクプレビュー)
    participant Dist as dist/
    participant Parallel as similarity/search/popular/category
    participant GA as GA Data API / はてなAPI
    participant Ogp as build:ogp

    Dev->>Git: git submodule update --remote
    Dev->>Article: npm run build:article
    Article->>Article: _article/_posts/*.md を解析
    Article->>Web: 本文中URLのOGPメタを取得
    Web-->>Article: OGPメタ
    Article->>Dist: posts/*.json, posts-list.json, tags.json を出力
    Dev->>Parallel: 並列実行(相互依存なし)
    Parallel->>Dist: posts/*.json, posts-list.json, tags.json を読み込み
    Parallel->>GA: PV / ブックマーク数を取得
    GA-->>Parallel: 集計データ
    Parallel->>Dist: posts-similarity.json, search.json, posts-popular.json, tag-categories.json を出力
    Dev->>Ogp: npm run build:ogp (SKIP_OGP=true で省略可)
    Ogp->>Dist: 記事一覧を読み込み
    Ogp-->>Dev: public/images/ogp/*.jpg を生成
```

### 2. SSG build and request handling

ビルド時に生成された `dist/` 配下の JSON を元に静的 HTML を生成するため、リクエスト時のサーバー処理は存在しない。唯一のランタイムデータロードは、検索ダイアログを開いた際の `search.json` の動的インポートのみである。

```mermaid
sequenceDiagram
    actor Dev as Developer / CI
    participant Next as next build (SSG)
    participant Page as PostPage
    participant Data as getPostPageData
    participant Dist as dist/*.json
    participant CDN as CDN (Vercel)
    actor Browser

    Dev->>Next: next build
    Next->>Dist: posts-list.json を読み込み(shape検証)
    Next->>Page: generateStaticParams で全記事ルートを列挙
    loop 記事ごと
        Page->>Data: getPostPageData(slug)
        Data->>Dist: posts/{slug}.json, posts-similarity.json, tags-similarity.json, posts-popular.json, tags.json
        Dist-->>Data: 本文・関連記事・関連タグ・人気度
        Data-->>Page: 合成済みページデータ
        Page-->>Next: 静的HTML(OGP画像URL込み)
    end
    Next->>CDN: 静的HTMLをデプロイ
    Browser->>CDN: ページをリクエスト
    CDN-->>Browser: 静的HTML(サーバー処理なし)
    Browser->>Browser: 検索操作時に search.json を dynamic import
```

### 3. ML-powered article similarity

関連記事のレコメンデーションは、タグ間類似度(NPMI)と本文類似度(kuromoji による形態素解析 + TF-IDF)を組み合わせて算出する。形態素解析は `worker_threads` に分散され、失敗時は同期処理にフォールバックする。

```mermaid
sequenceDiagram
    participant Main as build:similarity
    participant Dist as dist/
    participant Tag as タグ類似度(NPMI)
    participant Worker as worker_threads (kuromoji)
    participant Score as スコアリング(TF-IDF)

    Main->>Dist: posts/*.json, tags.json を読み込み
    Main->>Tag: タグ共起行列からNPMIを計算
    Tag-->>Main: tags-similarity.json
    Main->>Worker: 記事本文を分割して送信(16件未満は同期処理)
    Worker->>Worker: kuromoji(IPADIC)で形態素解析・品詞フィルタ
    Worker-->>Main: トークン列(失敗時はMainが同期フォールバック)
    Main->>Score: BM25 IDF + sublinear TFでベクトル化
    Score->>Score: 共通タグを持つ記事に絞り込み(最大50件)
    Score->>Score: タグ類似度0.6 + 本文コサイン類似度0.4 + 新鮮度ボーナスを合成
    Score-->>Main: 記事ごとの上位6件
    Main->>Dist: posts-similarity.json を出力
```

### 4. OG image generation

OGP 画像は `@vercel/og` のようなサーバーレス向け API ではなく、ローカルに起動した Hono サーバーと Playwright(Chromium)によるスクリーンショット撮影で生成する。cluster worker とページプールで並列化されている。

```mermaid
sequenceDiagram
    participant Main as build:ogp
    participant Mgr as OGPServerManager
    participant Hono as Honoサーバー(子プロセス port3000)
    participant Pool as WorkerPool
    participant Worker as cluster worker
    participant Pw as Playwright Chromium
    participant Fs as public/images/ogp/

    Main->>Mgr: サーバー起動を要求
    Mgr->>Hono: spawn(hono/jsxでテンプレート配信)
    Mgr->>Hono: ready確認(fetchポーリング)
    Main->>Pool: dist/posts-list.json の記事リストを分割
    Pool->>Worker: fork + IPC送信(CPU数、最大4)
    Worker->>Pw: Chromium起動、8ページのプールを確立
    Pw->>Hono: 各ページをHonoサーバーへ接続
    loop 記事ごと
        Worker->>Pw: タイトル・テーマ色をDOMへ注入、フォントロード待機
        Pw->>Fs: 1200x630 JPEGスクリーンショットを保存
    end
    Worker-->>Main: 完了/失敗をIPC通知
    Main->>Hono: サーバー停止を指示
    Main->>Pw: ブラウザ終了を指示
```

## Preparing for development

Before you begin development, make sure to prepare the .env file with the following contents:

```ini
# Required for consistent timestamps
TZ=Asia/Tokyo

# Google Analytics (required for popular articles feature)
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GA_PROPERTY_ID="123456789"
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

You need to run `prebuild` to process markdown files, generate article data, and create OG images:

```bash
npm run prebuild
```

**Note**: If you have run `npm run build` beforehand, you do not need to run `npm run prebuild`.

## Development

### Start development server

The development server runs with Next.js experimental HTTPS feature (`--experimental-https`) on port 8080:

```bash
npm run dev
```

Access at: **`https://localhost:8080`** (HTTPS only, self-signed certificate by Next.js)

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage
```

### Linting

```bash
# Check code with Biome
npm run lint

# Auto-fix with Biome
npm run lint:write

# Lint CSS
npm run lint:css

# Lint markup (HTML/JSX)
npm run lint:markup
```

### Production build

To execute the Next.js build for production:

```bash
npm run prebuild  # Required: process articles and generate assets
npm run build     # Build the application
```

### Bundle analysis

To analyze the production bundle size:

```bash
npm run build:analyzer
```

---

## Repository Stats

![Alt](https://repobeats.axiom.co/api/embed/b00d97f83f44e270e58b711cbf5ead377bee099c.svg 'Repobeats analytics image')
