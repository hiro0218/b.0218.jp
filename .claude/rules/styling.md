---
paths:
  - '**/ui/**/*.{ts,tsx}'
  - '**/components/**/*.{ts,tsx}'
---

# Panda CSS スタイリング規則

## 🔴 Import (CRITICAL)

- `@/ui/styled` から `css/styled/cx` を import
- `~/styled-system/*` の直接 import は禁止

## 🔴 Hover States (CRITICAL)

- `:hover` を直接書く
- `@media (any-hover: hover)` は手動で書かない（PostCSS が自動処理）

## 🔴 CSS Variables (CRITICAL)

- 色/余白/フォントは CSS 変数を使用
- 直接値は禁止（例外は [components.md](./components.md) の Zero Margin Principle を参照）

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
- JSX inline style (`style={{ background: ..., font: ... }}`) は Stylelint 対象外。`backgroundColor` / `fontSize` 等の longhand を使うこと

## 参照

- Zero Margin: [components.md](./components.md)
