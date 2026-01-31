# AIアシスタント指示

> **Note**: このファイルは `AGENTS.md` と `CLAUDE.md` のシンボリックリンクの元となり、AIアシスタント間の一貫性を確保する。

## 言語設定

- すべての説明、コメント、ドキュメントは日本語で記述すること
- 技術用語とコードは英語のままで問題ない
- コメントやドキュメントへの記載する日本語は常に「だ・である」調で記述すること

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
- `~/*` → プロジェクトルート（**このドキュメント内の表記専用。コード内では使用不可**）

**重要**: `~/` 表記は本ドキュメント内でのファイルパス参照にのみ使用する。実際のコード内では `@/` を使うこと。

### コンテンツパイプライン

コンテンツ処理フロー:

1. **Source**: `_article/_posts/*.md`（**Git submodule / 読み取り専用 - 直接編集禁止**）
2. **Processing**: `npm run prebuild` → 記事JSON、類似度JSON、OGP画像
3. **Consumption**: Next.js SSG がビルド時に JSON を読み込む

**🔴 CRITICAL**: `_article/_posts/*.md` を直接編集してはいけない。コンテンツ更新は元リポジトリで行い、`npm run prebuild` で反映する。

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

React Compiler（`reactCompiler: true`）はコンポーネントレンダリングを自動最適化する。

詳細: [🔴 重要ルール - React Compiler Check](#プロジェクト固有)

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

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
