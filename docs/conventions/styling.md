# Panda CSS スタイリング規則

## 🔴 前提 (CRITICAL)

本プロジェクトは PandaCSS を `syntax: 'template-literal'`（`panda.config.mts`）で採用している。利用可能な API は `css` / `styled` / `cx`（すべて `@/ui/styled` 経由）のみで、`patterns`（`stack` / `center` / `grid` / `container` 等）と `recipes` / `cva` は **生成されず利用できない**。object-literal API（`css({ color: '...' })` 等）も使用しない。

## 🔴 Import (CRITICAL)

- `@/ui/styled` から `css/styled/cx` を import
- `~/styled-system/*` の直接 import は禁止

## 🔴 Hover States (CRITICAL)

- `:hover` を直接書く
- `@media (any-hover: hover)` は手動で書かない（PostCSS が自動処理）

## 🔴 CSS Variables (CRITICAL)

- 色 / 余白 / font-size / font-weight は CSS 変数を使用
- 直接値 (16px / #fff / red 等) は禁止（例外は [layout.md](../components/layout.md#-zero-margin-principle-critical) の Zero Margin Principle を参照）
- `0`、`line-height` の単位なし数値、border width、radius、z-index、opacity、transition duration、`font-size: 1em`（親の大きさに揃える）、sr-only の `margin: -1px`（視覚的に隠す）はこの項目の直接値禁止対象外。ただし対応する design token が存在する場合は token を優先する
- ただし CSS キーワード値 (`italic`, `solid`, `none`, `inherit`, `bold`, `normal` 等) は型としてキーワードしか取れないため変数化対象外。`font-weight: bold/normal` はキーワード例外だが、視覚的な強弱を設計値として選ぶ場合は token / CSS 変数を優先する

色・余白・typography は design system の契約である。直接値は一貫性、テーマ変更、レビュー可能性を壊すため、例外値はデザイン判断ではなく CSS の機械的な値として扱える場合に限る。

## 🔴 Dynamic Styling (CRITICAL)

- Panda CSS は静的コンパイルのため、動的値は CSS 変数経由で渡す

Panda CSS は build 時に class を静的抽出する。runtime 値を `css()` に直接入れると抽出できないため、class 構造は静的に保ち、値だけ CSS custom property で渡す。

## 🟡 状態とスタイル (IMPORTANT)

部品の状態をスタイルへ出す手段は、次の順に選ぶ。

1. ネイティブの状態: `:disabled`・`[open]`・`:focus-visible` など
2. ARIA の状態: `[aria-current='page']` など（`Page/Archive/Pagination.tsx`）
3. `data-<状態>={boolean}` を属性として出し、`[data-<状態>='true']` で選ぶ（`UI/Toast.tsx` の `data-visible`）
4. 値が連続して変わるものは、CSS 変数で渡す（上の「Dynamic Styling」）

React は `data-x={false}` を `data-x="false"` として描画する。属性の有無で選ぶ `[data-x]` は `false` のときも一致するので、必ず `[data-x='true']` で選ぶ。

`stateLayer`（`src/ui/styled/components/stateLayerControl.ts`）は、hover と active の層を `background-image` で重ねる。重ねる側の class に `background-image` を持たせない。同じ property を持つ class と合成すると、適用順が定まらないためである。

`data-slot` は、部品の境界を越えて選ぶときだけ付ける。例: 親の部品が、子の部品の中の要素を選ぶ（`UI/CodeBlock/CopyButton.tsx` の `copy-button` を `UI/CodeBlock.tsx` が選ぶ）。

## 🟡 css テンプレートの呼び出し位置 (IMPORTANT)

- 補間なしの `` css`...` `` はモジュールスコープ定数に hoist し、コンポーネントの render 本体内で呼ばない
- 動的な切り替えは、hoist 済み定数から選ぶ。条件式か対応表で選ぶ
  - 条件式の例: `UI/Layout/Cluster.tsx` の `isWide && wideStyle`
  - 対応表の例: `UI/Layout/SectionInner.tsx` の `sizeStyles[size]`

`css()` は呼び出しごとにテンプレート文字列をパースする（メモ化されるのはクラス名の算出のみ）。render 本体内で呼ぶと SSG では全ページ分の無駄なパースになる。React Compiler の自動 memoize はコンポーネントインスタンス内の再レンダーにのみ効くため、この問題は防げない（[performance.md](./performance.md) 参照）。

## 🟡 Shorthand vs Longhand (IMPORTANT)

shorthand プロパティは省略された sub-property を **initial 値で暗黙的に上書き** するため、別箇所で設定した longhand が壊れる事故が起きやすい。以下の shorthand は原則禁止し、個別プロパティを使う。

### `background` 禁止

- 単独の色指定 (`background: red`, `background: var(--colors-...)`, `background: transparent`, `background: none`) は longhand (`background-color`) を使う
- `url(...)` / `gradient(...)` を含む値は shorthand を許容（複数 sub-property を一括指定する正当な用途）

### `font` 禁止

- `font: 16px sans-serif` は `font-style` / `font-variant` / `font-weight` / `font-stretch` / `line-height` を暗黙リセット。`line-height` の事故が頻発
- 代わりに `font-size` / `font-family` / `font-weight` / `line-height` を個別指定
- 例外: CSS-wide keywords (`font: inherit`, `font: initial`, `font: unset`, `font: revert`) は許容

### 共通

- 強制: Stylelint `declaration-property-value-disallowed-list`（`stylelint.config.js`）
- 上記以外の shorthand (`border`, `border-radius`, `transition`, `animation`, `padding`, `margin`, `inset` 等) は禁止対象外。慣用的な使用を許容
- JSX inline style (`style={{ background: ..., font: ... }}`) は Stylelint 対象外。`backgroundColor` / `fontSize` 等の longhand を使うこと

## 参照

- Zero Margin: [layout.md](../components/layout.md#-zero-margin-principle-critical)
- デザイン原則: [principles.md](../design-system/principles.md)、トークン階層: [tokens.md](../design-system/tokens.md#-トークン階層-important)
