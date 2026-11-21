# レイアウトと余白

UI コンポーネントの余白（Zero Margin Principle）、layout primitive の設計方針（Every Layout 原則）、レスポンシブの規則を定める。適用範囲と層の定義は [layers.md](../architecture/layers.md) に従う。

## 🔴 Zero Margin Principle (CRITICAL)

UI コンポーネントのルート要素は外部マージンを持たない。
ここでの「ルート要素」は、export されるコンポーネント関数の `return` 直下の単一 JSX 要素を指す。Fragment（`<>...</>`）や配列を返す場合は、その内部のトップレベル要素すべてをルート扱いする。

| 対象                                    | 扱い | 理由                                                                                   |
| --------------------------------------- | ---- | -------------------------------------------------------------------------------------- |
| ルート要素の外部余白用 `margin`         | 禁止 | 配置先のレイアウトに干渉し、再利用時に親の上書きが必要になる                           |
| ルート要素の `margin: 0` リセット       | 許可 | 素タグ（`h1`, `p` など）の内在マージンを正規化するため                                 |
| `SectionInner` の中央寄せ `margin:auto` | 許可 | `SectionInner` 自体の責務が内容幅制御・中央寄せであるため                              |
| ルート要素の `padding`                  | 許可 | コンポーネント自体の内側余白（カード、バッジ、ボタン、入力欄など）はコンポーネント責務 |
| 内部子要素（ルート以外）の `margin`     | 許可 | コンポーネント内部のレイアウトは内部の責任                                             |

コンポーネント外側の余白（兄弟間距離、配置先との距離）は親が `gap` または layout primitive で制御する。
内部 margin は `margin-top` / `margin-block-start` などの片側 longhand を優先する。子要素が 2 つ以上で同方向に並ぶ場合はまず `gap` を検討する。
`0` の reset は [styling.md](../conventions/styling.md) の直接値禁止からの例外として許容する。

既存コードに root margin が残っている箇所がある。新規コードでは踏襲せず、外側余白は親の `gap`、layout primitive、またはページ固有の配置要素へ移す。

## 🟡 Every Layout 原則 (IMPORTANT)

layout primitive（子要素の配置責務だけを持つ UI コンポーネント）の設計方針。用語と禁止語（`Wrapper` など）の正規定義は [terminology.md](../design-system/terminology.md) を参照。

layout primitive は `src/components/UI/Layout/` 配下の独自実装を正とする。

- primitive は 1 つの配置責務だけを持つ。例: 縦方向の間隔、中央寄せ、折り返し横並び、主従 2 カラム。
- 意味を持つ UI は primitive の組み合わせで構成する。primitive 自体に Post / Tag / Header などのドメイン責務を持たせない。
- 子要素自身の margin ではなく、親 primitive の `gap` / layout rule で関係を作る。
- breakpoint 固定より、CSS の layout algorithm を優先する。`flex-wrap`、Grid `auto-fit`、`minmax()`、`clamp()`、container query で配置先の幅に追従させる。
- primitive の props は配置契約（方向、間隔、整列、折り返し閾値など）だけに絞る。色、装飾、data loading、URL 状態、イベント副作用を混ぜない。

参考: [Every Layout - Composition](https://every-layout.dev/rudiments/composition/) / [Layouts](https://every-layout.dev/layouts/)

## レスポンシブ

- 新しいレスポンシブ CSS を書く前に「あらゆる幅でどう見えるべきか」を確認する。
- `@media (--isDesktop)`・`(--isWide)`・`(--isPostTwoColumn)` は PostCSS が `src/ui/breakpoints.json` から生成する custom media である。`position: fixed / sticky`、タッチ vs マウスの操作差異、viewport 全幅を使う場合の最終手段とする。コンポーネントを配置先の幅に追従させ、ページ固有 breakpoint へ結合しないためである。
- 連続的な値は `clamp()`、container 内では `cqw`、段階的な配置変更は `flex-wrap` / Grid `auto-fit` / `@container` を優先する。

## 参照

- 用語規則: [terminology.md](../design-system/terminology.md)
- スタイリング: [styling.md](../conventions/styling.md)
