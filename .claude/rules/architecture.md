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

## 🟡 client 境界と遅延読み込み (IMPORTANT)

- 部品は静的に import する。遅延読み込みは、操作してから必要になり、初期 JS の増分が実測で大きいものだけにする。例: `UI/ZoomImage/Controller.tsx` の Dialog は、記事ページの初期 JS の約 15 KB を占めたため、hover と focus を合図に読み込む
- 遅延の理由が消えたら静的 import に戻す。増分は `npm run build:analyzer` で、記事ページの初期 JS を比べて測る
- レンダー中に `window`・`document` などのブラウザ API を読まない。ブラウザの機能検出は `useSyncExternalStore` で行う（`src/hooks/useClipboardCopy.ts` の `isSupported`）
- `document.body` へ portal する部品は、操作のあとにだけ描画する

## 🔴 page.tsx の責務 (CRITICAL)

- `page.tsx` は、データの取得と Page 層の部品の組み立てだけにする。`styled`・`css` の定義は `src/components/Page/` に置く

## 🟡 ルートグループ名 (IMPORTANT)

- `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使用する

## 参照

- レイヤー依存: [components.md](./components.md#-レイヤー依存関係-critical)
- page.tsx のスタイル: [components.md](./components.md#-pagetsx-にスタイルを定義しない-critical)
- Content source read-only: [content-pipeline.md](./content-pipeline.md)
- React Compiler: [react-compiler-optimization.md](./react-compiler-optimization.md)
