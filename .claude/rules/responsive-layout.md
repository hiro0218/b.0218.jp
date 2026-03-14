---
paths:
  - '**/components/**/*.{ts,tsx}'
  - '**/ui/**/*.{ts,tsx}'
---

# レスポンシブレイアウト設計（Layout Maestro）

## 🔴 設計姿勢 (CRITICAL)

Layout Maestro はテクニックの選択基準ではなく **設計姿勢** である。

- **あらゆる幅でレイアウトがどう見えるべきか** を設計する
- breakpoint の数を減らすことが目的ではない。**中間状態の品質** が目的
- 新しいレスポンシブ CSS を書く前に「この幅での見え方は意図的か？」を問う

## 🔴 viewport breakpoint の使用制限 (CRITICAL)

`@media (--isDesktop)` は **最終手段**。以下の場合のみ許可:

- `position: fixed / sticky` が関与する
- タッチ vs マウスの操作差異がある
- viewport 全幅を使うコンポーネント

新規追加時は必ず判断フローで解決できないか先に検討すること。

## 🟡 手法の選択基準 (IMPORTANT)

```
Q1. 値の変化は連続的か？
├── YES → Q2. viewport 幅に比例するか？
│         ├── YES → clamp()
│         └── NO（逆比例・二値）→ @media
└── NO（段階的切替）→ Q3. レイアウト方向が変わるか？
                       ├── YES → flex-wrap / Grid auto-fit
                       └── NO → Q4. viewport 自体に依存するか？
                                 ├── YES → @media
                                 └── NO → @container
```

## 🟡 サイト固有の条件 (IMPORTANT)

- 大半のページは `Container size="small"`（max 720px）→ viewport breakpoint より `@container` が適切
- `clamp()` 内の `vw` は viewport 幅に連動する。container 内では `cqw` を検討
- `clamp()` は隣接トークン間の補間に留める（1 段飛ばしは中間値が不自然）

## 参照

- Panda CSS: [styling.md](./styling.md)
- Zero Margin: [components.md](./components.md)
- PostCSS config: `postcss.config.cjs`（`--isDesktop: (min-width: 992px)`）
