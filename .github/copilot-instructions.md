# AIアシスタント指示

> **Note**: このファイルは `AGENTS.md` と `CLAUDE.md` のシンボリックリンクの元となり、AIアシスタント間の一貫性を確保する。

## プロジェクト

TypeScript + React 19 + Panda CSS を使用する Next.js 16 ブログ。SSG、日本語コンテンツ、ML活用。

**言語**: すべての説明・コメント・ドキュメントは日本語（だ・である調）。技術用語とコードは英語。

## 必須コマンド

```bash
npm run prebuild  # build/dev 起動前に必須（dist/*.json への静的importに依存。submodule更新、コンテンツ処理）
npm run dev       # https://localhost:8080 (HTTPSのみ)
```

**重要**: 手動の `npm run dev` は HTTP では動作しない。HTTPS のみ。Playwright の `webServer` は各 `playwright.*.config.ts` の `baseURL` に従う。

## 🔴 クリティカルルール

| ルール           | 概要                                                    | 正規定義                                                                                  |
| ---------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ゼロマージン     | UIコンポーネントは外部マージンを設定しない              | [layout.md](docs/components/layout.md#-zero-margin-principle-critical)                    |
| レイヤー依存     | UI / Functional は独立、Page → UI/Functional            | [layers.md](docs/architecture/layers.md#-レイヤー依存関係-critical)                       |
| page のスタイル  | `page.tsx` に styled・css を定義しない。Page 層に置く   | [app-router.md](docs/architecture/app-router.md#-pagetsx-にスタイルを定義しない-critical) |
| Server First     | デフォルトは Server Component                           | [app-router.md](docs/architecture/app-router.md#-server-first--ssg-critical)              |
| React Compiler   | 最適化前に `next.config.mjs` を確認                     | [performance.md](docs/conventions/performance.md#-重要ルール-critical)                    |
| Content 編集禁止 | `_article/_posts/*.md` は Git submodule（直接編集禁止） | [content-pipeline.md](docs/architecture/content-pipeline.md)                              |

詳細ルールは [`docs/`](docs/README.md) の、内容に合う文書に置く。Claude Code は、作業するディレクトリの `.claude/rules/docs.md` が取り込む文書を、そのディレクトリのファイルに触れたときに読み込む。ディレクトリに属さない文書は、`.claude/rules/always.md` が常に読み込む。そのほかの文書は、`.claude/rules/` の案内（`paths` と文書へのリンク）に従って、`Read` で読む。

---

_Copilot、Claude Code、その他のAIアシスタント向け。簡潔で実用的に。_

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## npx の既知問題(この作業環境)

- `npx biome check` / `npx vitest` が「could not determine executable to run」で失敗することがある(argv からバイナリ名が欠落し、サブコマンドをパッケージ名として private registry へ解決しに行く。原因未確定・rtk 介在の疑い)。プロジェクトローカルの CLI は `./node_modules/.bin/<tool>` を直接実行する
- 失敗した npx 実行がエラー要約風の出力(例: `Lint: 2 errors`)を混ぜてきた場合、その件数は信用せず direct binary の再実行結果だけで判定する
