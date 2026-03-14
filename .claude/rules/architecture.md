---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# プロジェクトアーキテクチャ指針（要点）

## 🔴 Server First / SSG (CRITICAL)

- デフォルトは Server Component
- `'use client'` は Hooks / イベントハンドラー / ブラウザAPI 使用時のみ
- SSG 前提でビルド時データロードを優先
- ランタイム `fetch` は基本的に不要（ビルド時にエラー検出可能にする）

## 🔴 Layer Dependencies (CRITICAL)

→ 正規定義: [components.md](./components.md)

## 🔴 Content Source Read-Only (CRITICAL)

→ 正規定義: [content-pipeline.md](./content-pipeline.md)

## 🔴 React Compiler (CRITICAL)

→ 正規定義: [react-compiler-optimization.md](./react-compiler-optimization.md)

## 🟡 ルートグループ名 (IMPORTANT)

- `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使用する
