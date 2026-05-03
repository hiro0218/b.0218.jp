---
paths:
  - '**/ui/**/*.{ts,tsx}'
  - '**/components/**/*.{ts,tsx}'
  - '**/*.css'
---

# Panda CSS スタイリング規則

## 🔴 Import (CRITICAL)

- `@/ui/styled` から `css/styled/cx` を import
- `~/styled-system/*` の直接 import は禁止

## 🔴 Hover States (CRITICAL)

- `:hover` を直接書く
- `@media (any-hover: hover)` は手動で書かない（PostCSS が自動処理）

## 🔴 CSS Variables (CRITICAL)

- 色 / 余白 / font-size / font-weight は CSS 変数を使用
- 直接値 (16px / #fff / red 等) は禁止（例外は [components.md](./components.md#-zero-margin-principle-critical) の Zero Margin Principle を参照）
- `0`、`line-height` の単位なし数値、border width、radius、z-index、opacity、transition duration はこの項目の直接値禁止対象外。ただし対応する design token が存在する場合は token を優先する
- ただし CSS キーワード値 (`italic`, `solid`, `none`, `inherit`, `bold`, `normal` 等) は型としてキーワードしか取れないため変数化対象外

## 🔴 Dynamic Styling (CRITICAL)

- Panda CSS は静的コンパイルのため、動的値は CSS 変数経由で渡す

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

- Zero Margin: [components.md](./components.md#-zero-margin-principle-critical)

## Web パフォーマンス

| メトリクス | 目標    |
| ---------- | ------- |
| LCP        | < 2.5s  |
| INP        | < 200ms |
| CLS        | < 0.1   |
| FCP        | < 1.5s  |
| TBT        | < 200ms |

- 画像には `width` と `height` を明示する。
- ヒーロー画像のみ `loading="eager"` + `fetchpriority="high"` を使う。
- Below-the-fold は `loading="lazy"` を使う。
- AVIF / WebP を優先する。
- フォントは `font-display: swap`、プリロードは最も使用頻度の高いウェイトのみにする。
- 動的コンテンツによるレイアウトシフトを避ける。
- サードパーティスクリプトは async/defer を使う。
