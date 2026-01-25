---
description: 'プロジェクト横断のアーキテクチャ原則（SSG / Server First / Layer）'
applyTo: '**/*.{ts,tsx,js,jsx}'
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# プロジェクトアーキテクチャ指針

## Priority Markers

> See [CLAUDE.md - Priority Levels](../CLAUDE.md#priority-levels) for marker definitions.

## 🔴 Server First Principle (CRITICAL)

- デフォルトは Server Component。
- `'use client'` は必要な場合のみ（Hooks / イベントハンドラー / ブラウザAPI / リアルタイム更新）。

**詳細**: [components.md - Server First Principle](./components.md#-server-first-principle-important)

## 🔴 SSG: ビルド時データロード優先 (CRITICAL)

このプロジェクトは SSG のため、**ビルド時エラーを優先**します。ランタイム `fetch` は基本的に不要です。

```typescript
// ✅ RECOMMENDED: ビルド時データロード
const posts = getPosts(); // 存在しない場合はビルドエラー

// ❌ AVOID: ランタイム fetch
try {
  const posts = await fetch('/api/posts');
} catch (error) {
  // SSGではランタイムfetchは基本的に不要
}
```

**WHY**: ビルド時にエラーが出ればデプロイ前に検出できます。ランタイムエラーは本番ユーザーに影響します。

**詳細**: [CLAUDE.md - SSG Optimization Patterns](../CLAUDE.md#ssg-optimization-patterns)

## 🔴 Layer Dependencies (CRITICAL)

アーキテクチャのレイヤー依存は Biome で検証されます。

**詳細**: [components.md - Layer Dependencies](./components.md#layer-dependencies-critical)

## 🔴 Content Source Read-Only (CRITICAL)

`_article/_posts/*.md` は Git submodule のため直接編集禁止です。

**詳細**: [content-pipeline.md - Content Pipeline Rules](./content-pipeline.md)

## 🟡 React Compiler (IMPORTANT)

最適化提案前に `~/next.config.mjs` の `reactCompiler` を確認してください。

**詳細**: [react-compiler-optimization.md](./react-compiler-optimization.md)
