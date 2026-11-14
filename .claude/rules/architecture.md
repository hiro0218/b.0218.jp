---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# プロジェクトアーキテクチャ指針（要点）

## 🔴 Server First / SSG (CRITICAL)

- デフォルトは Server Component
- `'use client'` は client-only hooks（`useState`, `useEffect`, `useRef` など）/ イベントハンドラー / ブラウザAPI 使用時のみ
- SSG 前提でビルド時データロードを優先
- ランタイム `fetch` は、ビルド時に取得するとビルド成果が動的になるデータに限る（`src/components/Page/Post/Likes.tsx` の Webmention のいいね）。ほかのデータはビルド時に読み込み、取得の失敗をビルドで検出する

## 🔴 page.tsx の責務 (CRITICAL)

- `page.tsx` は、データの取得と Page 層の部品の組み立てだけにする。`styled`・`css` の定義は `src/components/Page/` に置く

## 🟡 ルートグループ名 (IMPORTANT)

- `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使用する

## 参照

- レイヤー依存: [components.md](./components.md#-レイヤー依存関係-critical)
- page.tsx のスタイル: [components.md](./components.md#-pagetsx-にスタイルを定義しない-critical)
- Content source read-only: [content-pipeline.md](./content-pipeline.md)
- React Compiler: [react-compiler-optimization.md](./react-compiler-optimization.md)
