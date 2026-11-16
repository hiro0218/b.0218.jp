# App Router の構成指針

Next.js の App Router について、レンダリング、client 境界、`page.tsx`、ルートグループ、状態管理の規則を定める。

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

## 🔴 page.tsx にスタイルを定義しない (CRITICAL)

`src/app/**/page.tsx` と、その本体の `src/app/**/_lib/*Page.tsx` に、`styled`・`css` の定義を置かない。この 2 種類のファイルは、データの取得と Page 層の部品の組み立てだけにする。スタイルは `src/components/Page/` の対応する場所に定義して import する。

| 定義を使うページ | 置く場所                | 例                                                       |
| ---------------- | ----------------------- | -------------------------------------------------------- |
| 1 つのページだけ | `Page/<ページ>/` の部品 | `Page/Archive/ArchiveIntro.tsx`、`Page/Post/Actions.tsx` |
| 複数のページ     | `Page/_shared/`         | `Page/_shared/pageSections.ts`                           |

- ページの対応: ホームは `Page/Home/`、アーカイブとタグ一覧は `Page/Archive/`、記事は `Page/Post/`、固定ページは `Page/Single/`。
- 強制: [biome.json](../../biome.json) の `noRestrictedImports` が、これらのファイルによる `@/ui/styled` の `css`・`styled` の import を error にする。`cx` は許す。
- 対象外: `layout.tsx`・`not-found.tsx`・`route.ts` など、`page.tsx` 以外のファイル。

## 🟡 ルートグループ名 (IMPORTANT)

- `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使用する

## 状態管理

- クライアント側でシリアライズ可能な状態（フィルタ、ページネーション等）は URL パラメータで管理する。SSG ページの動的セグメントは `generateStaticParams` で列挙する。
- サーバー状態をクライアントストアに複製しない。

## 参照

- レイヤー依存: [layers.md](./layers.md#-レイヤー依存関係-critical)
- Content source read-only: [content-pipeline.md](./content-pipeline.md)
- React Compiler: [performance.md](../conventions/performance.md)
