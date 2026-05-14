---
description: コンポーネントの規則。レイヤー、ファイル配置、import、Zero Margin、JSDoc、Storybook を扱う。
paths:
  - 'src/components/**/*.{ts,tsx,css}'
  - 'src/ui/**/*.{ts,tsx}'
---

# コンポーネント規則

本ファイルは `src/components/{UI,Functional,Page,App}/` 配下の React コンポーネントと、`src/ui/icons/` の icon コンポーネントに適用する。
用語の正規定義は [design-system-terminology.md](./design-system-terminology.md)、機械的に検出できる import / barrel / formatter / lint の詳細は [linting.md](./linting.md) を参照する。
ここでは lint だけでは判断しにくい責務境界、配置判断、例外、Storybook / JSDoc の意図を定義する。

## レイヤー定義

| 層            | 定義                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UI/`         | 表示・操作の基礎コンポーネント。props で入力を受け、data loading、URL 状態、グローバル副作用、ページ単位の composition を持たない。新規 UI はドメイン非依存を原則とする |
| `Functional/` | 視覚 DOM を持たない副作用・リソース注入コンポーネント。`null`、または `<script>` / `<link>` / `<meta>` / `<style>` / `<noscript>` などの非表示 DOM のみを返す           |
| `Page/`       | ページ種別ごとの composition 層。UI と Functional を組み合わせ、Post / Tag / Page などのドメイン表示を構成する                                                          |
| `App/`        | サイト全体の shell、global UI、URL / storage / search dialog などサイト横断状態、自己完結した Feature Module を置く最上位層                                             |

視覚 DOM を描画するコンポーネントは `UI/` / `Page/` / `App/` のいずれかに置く。視覚 DOM と非表示の副作用を混ぜず、表示コンポーネントの再利用性と副作用境界を保つためである。
既存 `UI/` にはドメイン語やサイト設定を含む公開 API が残っているが、影響範囲未確認のまま移動・改名しない。新規にドメイン責務を持つ表示を作る場合は、原則として `Page/` または `App/` に置く。

## Feature Module

Feature Module は、`App/` 内で独自 hooks / engine / types を持つ自己完結 module を指す。外部からは公開入口のみ import する。

### module 境界

「module 外」は、その module directory の外側にある runtime code を指す。module 内の test / Storybook が内部詳細を直接検証する場合は例外としてよい。

### 公開入口

公開入口は 1 ファイルに限定しない。外部から直接使う必要がある top-level component / provider / lifecycle API を公開入口とし、内部実装は module 外から直接 import しない。外部が lifecycle API を必要とする場合は、top-level facade を作る。純粋な re-export barrel で公開範囲を広げない。

## 🔴 レイヤー依存関係 (CRITICAL)

依存方向と import 禁止パターンは [biome.json](../../biome.json) の `noRestrictedImports` overrides と [.dependency-cruiser.js](../../.dependency-cruiser.js) で機械的に強制する。詳細は [linting.md](./linting.md) を参照する。

## 🟡 ファイル配置パターン (IMPORTANT)

### 配置型

| 配置型 | 用途                         | 例                                                            |
| ------ | ---------------------------- | ------------------------------------------------------------- |
| A      | 単一コンポーネント           | `UI/Heading.tsx`（+ `UI/Heading.stories.tsx`）                |
| B      | 親 = 公開入口、子 = 内部実装 | `UI/ArticleCard.tsx` + `UI/ArticleCard/{Header,Tags,...}.tsx` |
| C      | 並列 primitive 群            | `UI/Layout/{Stack,Container,Sidebar,...}.tsx`                 |

「公開入口」は外部から import される公開ファイル。配置型 B では親同名ファイル、配置型 A / C ではコンポーネントファイル自体を指す。

### 配置型 B の昇格条件

配置型 B は、公開入口を 1 点に保ったまま内部責務を分割したい場合に使う。内部子要素を 2 箇所以上の他 UI から再利用する、または内部子要素だけを直接テスト / Storybook で扱う価値が生まれた時点で、内部実装ではなく配置型 C または独立した UI コンポーネントへ昇格する。

`Page/` / `App/` でも同じ考え方を使う。単一の既存コンポーネントに閉じる要素は同名ディレクトリ内の内部実装に置き、複数箇所で使う、公開 API として読みたい、または単独で検証したい責務だけを独立ファイルにする。

### ディレクトリ構造

公開入口を同名ファイルとし、内部実装を同名ディレクトリに置く。テストは対象ファイルと同ディレクトリに置く。内部実装単体のテストは、独自ロジックや複雑な分岐を単独で検証する価値があるときだけ作る。

```txt
src/components/UI/
  ArticleCard.tsx              # 公開入口
  ArticleCard.test.tsx         # 公開入口のテスト
  ArticleCard.stories.tsx      # 公開入口の Storybook
  ArticleCard/
    Header.tsx                 # 内部実装
    Excerpt.tsx
    Tags.tsx
```

### Storybook 配置

Storybook は原則として公開入口に作る。内部実装単体の Storybook は、公開入口経由では再現しにくい状態（複雑な分岐、データ取得失敗、独立 interactive 状態など）を検証する必要があるときだけ追加する。

## Import / 命名

- 配置型 B の公開入口・内部実装間、内部実装どうしは相対 import（`./` / `../`）を使う。
- 内部実装の export 名に親プレフィックスを付けない。
  - 良: `ArticleCard/Header.tsx` の `export function Header(...)`
  - 悪: `ArticleCard/ArticleCardHeader.tsx`

## 🔴 Zero Margin Principle (CRITICAL)

UI コンポーネントのルート要素は外部マージンを持たない。
ここでの「ルート要素」は、export されるコンポーネント関数の `return` 直下の単一 JSX 要素を指す。Fragment（`<>...</>`）や配列を返す場合は、その内部のトップレベル要素すべてをルート扱いする。

| 対象                                 | 扱い | 理由                                                                                   |
| ------------------------------------ | ---- | -------------------------------------------------------------------------------------- |
| ルート要素の外部余白用 `margin`      | 禁止 | 配置先のレイアウトに干渉し、再利用時に親の上書きが必要になる                           |
| ルート要素の `margin: 0` リセット    | 許可 | 素タグ（`h1`, `p` など）の内在マージンを正規化するため                                 |
| `Container` の中央寄せ `margin:auto` | 許可 | `Container` 自体の責務が内容幅制御・中央寄せであるため                                 |
| ルート要素の `padding`               | 許可 | コンポーネント自体の内側余白（カード、バッジ、ボタン、入力欄など）はコンポーネント責務 |
| 内部子要素（ルート以外）の `margin`  | 許可 | コンポーネント内部のレイアウトは内部の責任                                             |

コンポーネント外側の余白（兄弟間距離、配置先との距離）は親が `gap` または layout primitive で制御する。
内部 margin は `margin-top` / `margin-block-start` などの片側 longhand を優先する。子要素が 2 つ以上で同方向に並ぶ場合はまず `gap` を検討する。
`0` の reset は [styling.md](./styling.md) の直接値禁止からの例外として許容する。

既存コードに root margin が残っている箇所がある。新規コードでは踏襲せず、外側余白は親の `gap`、layout primitive、またはページ固有の配置要素へ移す。

## 🟡 Every Layout 原則 (IMPORTANT)

layout primitive（子要素の配置責務だけを持つ UI コンポーネント）の設計方針。用語と禁止語（`Wrapper` など）の正規定義は [design-system-terminology.md](./design-system-terminology.md) を参照。

layout primitive は `src/components/UI/Layout/` 配下の独自実装を正とする。

- primitive は 1 つの配置責務だけを持つ。例: 縦方向の間隔、中央寄せ、折り返し横並び、主従 2 カラム。
- 意味を持つ UI は primitive の組み合わせで構成する。primitive 自体に Post / Tag / Header などのドメイン責務を持たせない。
- 子要素自身の margin ではなく、親 primitive の `gap` / layout rule で関係を作る。
- breakpoint 固定より、CSS の layout algorithm を優先する。`flex-wrap`、Grid `auto-fit`、`minmax()`、`clamp()`、container query で配置先の幅に追従させる。
- primitive の props は配置契約（方向、間隔、整列、折り返し閾値など）だけに絞る。色、装飾、data loading、URL 状態、イベント副作用を混ぜない。

参考: [Every Layout - Composition](https://every-layout.dev/rudiments/composition/) / [Layouts](https://every-layout.dev/layouts/)

## 🟡 Props 設計 (IMPORTANT)

Props はコンポーネントの公開契約である。呼び出し側がレイアウト責務、HTML semantics、状態責務を読める名前にする。

- data loading 済みの値を渡す。`UI/` では loader、Source、URL query へのアクセスを props の裏側に隠さない。
- boolean props は表示状態や挙動の切り替えに限定する。複数の boolean が組み合わさって variant になる場合は union / variant prop を検討する。
- `className` は公開入口で受けてよい。外部 margin のためではなく、配置先固有の layout integration や Storybook / test のための逃げ道として扱う。
- DOM 要素を切り替える props は `as` を基本にする。見出し階層のように用途が限定される場合は `titleTagName` など、意味が分かる名前を使う。
- variant の具体値や ARIA role は `components.md` だけで決めない。既存 token、対象 UI の意味、アクセシビリティ要件に合わせ、呼び出し側が理解できる union 名と DOM semantics を選ぶ。

## JSDoc / Storybook 説明

UI コンポーネントの公開入口 export 関数には `@summary` 付き JSDoc を必須とする。これは Storybook 公式要件ではなく、Storybook AI manifest と LLM 読解の品質を安定させるためのローカル規約である（[storybook.md](./storybook.md) 参照）。

```tsx
/**
 * @summary 記事カード。一覧ページで Post の概要を 1 枚に表示する。
 */
export function ArticleCard(props: ArticleCardProps) {
  /* ... */
}
```

配置型 B の内部実装は、外部公開しない限り `@summary` 必須対象ではない。ただし、内部実装単体の Storybook を作る、または内部実装を直接テスト対象にする場合は、公開入口との関係が分かる JSDoc を付ける。

Props JSDoc は名前と型で自明なら書かない。次の場合だけ書く。

- ドメイン固有の意味: `type: AlertType` -> `/** 重要度と視覚表現が変わる */`
- 動作が不明: `intrinsic?: boolean` -> `/** flex column + align center による内在的な中央揃え */`
- 単位情報: `delay?: number` -> `/** ホバーから表示までの遅延（ms） */`
- 使い分けガイド: `titleTagName` -> `/** 一覧ページでは h2、単体では h3 が典型 */`

ストーリーの記述方針は [storybook.md](./storybook.md) を参照する。responsive や visual state のストーリーでも、幅や見た目だけを説明せず、その状態を保証したい利用文脈を書く。全 variant の一覧や最大構成を確認したい場合は複合ストーリーとして扱い、[storybook.md](./storybook.md) の manifest 除外規則に従う。

## レスポンシブ / 状態管理

- 新しいレスポンシブ CSS を書く前に「あらゆる幅でどう見えるべきか」を確認する。
- `@media (--isDesktop)` は PostCSS で生成する custom media である。`position: fixed / sticky`、タッチ vs マウスの操作差異、viewport 全幅を使う場合の最終手段とする。コンポーネントを配置先の幅に追従させ、ページ固有 breakpoint へ結合しないためである。
- 連続的な値は `clamp()`、container 内では `cqw`、段階的な配置変更は `flex-wrap` / Grid `auto-fit` / `@container` を優先する。
- クライアント側でシリアライズ可能な状態（フィルタ、ページネーション等）は URL パラメータで管理する。SSG ページの動的セグメントは `generateStaticParams` で列挙する。
- サーバー状態をクライアントストアに複製しない。

## デザイン品質

- ライブラリ（Panda CSS、React Aria など）のデフォルト値をそのまま出荷しない。デザイントークン経由で上書きする。
- インタラクティブ要素は hover / focus / active を設計する。
- スケール・余白でヒエラルキーを表現する。

## 参照

- 用語規則: [design-system-terminology.md](./design-system-terminology.md)
- スタイリング: [styling.md](./styling.md)
- SSG 原則: [architecture.md](./architecture.md)
- レイヤー依存・barrel 禁止の lint 強制: [linting.md](./linting.md)
- テスト配置: [testing.md](./testing.md)
- Storybook: [storybook.md](./storybook.md)
