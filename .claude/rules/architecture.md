---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# プロジェクトアーキテクチャ指針（要点）

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 🔴 Server First / SSG (CRITICAL)

- デフォルトは Server Component
- `'use client'` は Hooks / イベントハンドラー / ブラウザAPI 使用時のみ
- SSG 前提でビルド時データロードを優先
- ランタイム `fetch` は基本的に不要（ビルド時にエラー検出可能にする）

## 🔴 Layer Dependencies (CRITICAL)

- レイヤー依存は Biome で検証される

**詳細**: [components.md](./components.md#レイヤー依存関係-critical)

## 🔴 Content Source Read-Only (CRITICAL)

- `_article/_posts/*.md` は Git submodule のため直接編集禁止

**詳細**: [content-pipeline.md](./content-pipeline.md)

## 🟡 React Compiler (IMPORTANT)

- 最適化提案前に `next.config.mjs` の `reactCompiler` を確認

**詳細**: [react-compiler-optimization.md](./react-compiler-optimization.md)
