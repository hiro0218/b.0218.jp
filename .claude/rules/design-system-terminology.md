---
description: UI 命名・用語の正規規則。命名から責務・HTML/CSS 実体・再利用範囲・変更影響が読めるようにする。実装、Storybook、JSDoc、レビュー時の正式名称に適用する。
paths:
  - '**/components/**/*.{ts,tsx,css}'
  - '**/ui/**/*.{ts,tsx}'
---

# Design System 用語規則

## 目的

UI 命名から、責務・HTML/CSS の実体・再利用範囲・変更影響を読めるようにする。
この規則は、実装、Storybook、JSDoc、レビュー時の正式名称に適用する。

`CONTEXT.md` の Post / Tag / Source などのドメイン語彙は対象外である。ドメイン語彙は `CONTEXT.md` を優先する。

## 🔴 既存語の扱い (CRITICAL)

新規命名と変更対象の正式名称を優先して整える。既存の公開 API、CSS custom property、Storybook title、JSDoc、テスト名は、規則変更に巻き込んで影響範囲未確認のまま改名しない（暗黙の利用箇所が壊れるため）。

既存語は次の順で分類する。

| 分類                                 | 扱い                                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| 既存 API / token 名                  | 互換性を優先して維持する。変更する場合は利用箇所、Storybook、JSDoc、テストへの影響を確認する     |
| 新規または変更中の正式名称           | この規則の推奨語に合わせる                                                                       |
| 人間向けの説明文・見出し             | 既存 API 名を説明する場合でも、責務名を併記して誤読を避ける                                      |
| 色 token / semantic token の role 名 | `Text Heading` など、色ロールの接頭辞としての `Text` は許容する。UI 部品名の `Text` とは区別する |

## 🔴 公開範囲とスコープ修飾 (CRITICAL)

名称は再利用範囲に合わせる。汎用 UI primitive、Page / App 固有コンポーネント、内部子要素を同じ粒度の名前にしない（名前から再利用範囲と変更影響を読めるようにするため）。

| 再利用範囲                    | 命名方針                                                               | 例                                                                         |
| ----------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 汎用 UI primitive             | ドメインや配置先に依存しない責務名にする                               | `Center`, `Grid`, `Stack`, `NavigationLink`                                |
| Page / App 固有コンポーネント | 配置先や責務を scope prefix で示す                                     | `HeaderNavigation`, `PostContent`, `ArticleListSectionInner`               |
| 配置型 B の内部子要素         | 親ディレクトリで scope が決まる。scope prefix を付けず責務名のみにする | `ArticleCard/Header.tsx` の `Header`、`ArticleCard/Footer.tsx` の `Footer` |

既存 primitive で責務を満たせる場合は、新しい名前を増やさない。
新規名は、公開 API なら汎用名、特定ページや section の内部要素なら scope prefix 付きの名前にする。
再利用範囲が不明なレビューでは決め打ちせず、「汎用なら scope なしの責務名（例: `Navigation`）、特定 scope 専用なら scope prefix 付き（例: `HeaderNavigation`）」と両案を条件付きで提案する。

## 🔴 Web 標準語との衝突回避 (CRITICAL)

Web 標準で意味が定まっている語は再定義しない（HTML/CSS/ARIA の意味と命名が食い違うと、読み手の標準語前提が誤誘導になるため）。特に `block`、`button`、`menu`、`columns`、`row` は便利な総称として使わない。

- Next.js `Link` / `<a>` は、見た目がボタンでも `Button` と呼ばない。
- サイト導線は `Navigation` と呼ぶ。`Menu` はコマンド実行や選択操作に限る。
- `Columns` は CSS Multi-column Layout のみ。Grid や Flex の列を単に `Columns` と呼ばない。
- `Row` は配置結果として説明し、独立要素名にしない。
- `container` を CSS container query の意味で使う場合は、`container query` または `container query target` と明示する。

## 🔴 構造・余白・レイアウト用語 (CRITICAL)

| 用途                                            | 推奨語                   | 避ける語                      |
| ----------------------------------------------- | ------------------------ | ----------------------------- |
| 意味的または構造的なページ区画                  | `Section`                | 汎用 `Group`                  |
| 内容幅制御・中央寄せ・gutter 付与の基礎配置境界 | `Container`              | `Wrapper`                     |
| 特定 section の内側要素                         | `SectionInner`           | `Wrapper`                     |
| 外側配置や周辺関係の調整                        | `Outer`                  | `Wrapper`                     |
| ビューポート端から内容を守る inline 方向余白    | `Gutter`                 | `Gap`                         |
| 子要素間の距離                                  | `Gap`                    | `Gutter`                      |
| CSS container query の対象                      | `Container Query Target` | 単独の `container` / `target` |

`Container` はこのプロジェクトの基礎 layout 境界名である。新規の内容幅制御、中央寄せ、gutter 付与、layout 境界のコンポーネントは、別 layout 機構（CSS multi-column 専用、masonry など）でない限り `Container` を基本にする。

`Gap` は子要素間隔、`Gutter` は viewport 端から内容を守る inline 方向余白である。カード間隔や列間隔を `Gutter` と呼ばない（役割が逆だと CSS 設計時に意図が読めないため）。

`Section` はページ区画の概念で、常に `<section>` と 1 対 1 対応するとは限らない（`<div>` で構成するヘッダー直下の区画も Section に含む）。特定の `Section` の内部要素として分割する必要がある場合は `SectionInner` を使える。

`Wrapper` は責務が曖昧で禁止する（「何かを包む」だけでは内部レイアウト・gutter・幅制御のどれが責務か読めないため）。既存の `Wrapper` 名を変更する場合は、利用箇所、Storybook、JSDoc、テストへの影響を確認したうえで `Container` または scope 付き責務名へ置き換える。

## 🟡 用語分類軸 (IMPORTANT)

`Component`、`Template`、`Dynamic Element`、`Theme` を同じ分類軸で扱わない。

- `Component`: 単一ソースと props / slots / variants などの入力契約を持つ再利用単位
- `Template`: ページ単位または同等の上位描画定義
- `Dynamic Element`: 状態遷移やユーザー操作を中心に説明する UI
- `Theme`: Panda CSS token / semantic token / CSS variable など外観契約

React コンポーネントであることだけを理由に、すべてを `Component` と説明しない。

## 🟡 テキスト用語 (IMPORTANT)

`Text` は正式名称として広すぎる。公開 API、Storybook、JSDoc では具体化する。

| 用途                         | 推奨語                                                          |
| ---------------------------- | --------------------------------------------------------------- |
| 単一段落                     | `Paragraph`                                                     |
| インライン文字列             | `Label`（フォーム / ボタン）、`Caption`（補足）、`Name`（識別） |
| 複数要素や装飾を含む長文領域 | `Rich Text`                                                     |
| 記事本文 HTML                | `Post Content` / `Article Content`                              |

単一段落、ラベル、長文編集領域、記事本文 HTML を `Text` にまとめない。

## 判定フロー

新しい UI 名称を追加する前に、上の各 CRITICAL セクションを順に判定する。違反があれば別案へ。

1. **Web 標準語と衝突しないか** — 本ファイル「Web 標準語との衝突回避」セクション
2. **責務 / 実体を表しているか** — 視覚特性 (`Round`, `Big` 等) ではなく責務・HTML/CSS 実体・スコープを反映する（命名の共通原則）
3. **既存名を巻き込み改名していないか** — 本ファイル「既存語の扱い」セクション
4. **`Container` / scope 付き責務名で代替できるか** — 本ファイル「構造・余白・レイアウト用語」セクション
5. **再利用範囲に合った粒度か** — 本ファイル「公開範囲とスコープ修飾」セクション
6. **レイヤー境界と矛盾しないか** — `UI/` / `Page/` / `App/` / `Functional/` の責務と一致するか（[components.md](./components.md) の「レイヤー定義」参照）

## 参照

- コンポーネント規則: [components.md](./components.md)
- スタイリング規則: [styling.md](./styling.md)
