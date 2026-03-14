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
- 直接値は禁止（`margin: 0` だけ許可 - Zero Margin Principle のリセット目的）

## 🔴 Dynamic Styling (CRITICAL)

- Panda CSS は静的コンパイルのため、動的値は CSS 変数経由で渡す

## 参照

- Zero Margin: [components.md](./components.md)
