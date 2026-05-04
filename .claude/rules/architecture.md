---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# プロジェクトアーキテクチャ指針（要点）

## 🔴 Server First / SSG (CRITICAL)

- デフォルトは Server Component
- `'use client'` は client-only hooks（`useState`, `useEffect`, `useRef` など）/ イベントハンドラー / ブラウザAPI 使用時のみ
- SSG 前提でビルド時データロードを優先
- ランタイム `fetch` は基本的に不要（ビルド時にエラー検出可能にする）

## 🟡 ルートグループ名 (IMPORTANT)

- `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使用する

## 参照

- レイヤー依存: [components.md](./components.md#-レイヤー依存関係-critical)
- Content source read-only: [content-pipeline.md](./content-pipeline.md)
- React Compiler: [react-compiler-optimization.md](./react-compiler-optimization.md)
