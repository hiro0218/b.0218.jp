---
paths:
  - '**/*.{ts,tsx}'
  - '**/*.css'
---

# Web パフォーマンス規則

## Core Web Vitals 目標

| メトリクス | 目標    |
| ---------- | ------- |
| LCP        | < 2.5s  |
| INP        | < 200ms |
| CLS        | < 0.1   |
| FCP        | < 1.5s  |
| TBT        | < 200ms |

## 画像最適化

- `width` と `height` を明示
- ヒーロー画像のみ `loading="eager"` + `fetchpriority="high"`
- Below-the-fold は `loading="lazy"`
- AVIF / WebP を優先

## フォント

- Noto Sans JP + system sans-serif
- `font-display: swap`
- プリロードは最も使用頻度の高いウェイトのみ

## アニメーション

- compositor-friendly プロパティのみ: `transform`, `opacity`, `clip-path`
- `will-change` は限定的に使用し、完了後に除去
- 参照: グローバルルール `animation.md`

## チェックリスト

- [ ] 全画像に明示的なサイズ指定
- [ ] レンダリングブロックリソースなし
- [ ] 動的コンテンツによるレイアウトシフトなし
- [ ] サードパーティスクリプトは async/defer
