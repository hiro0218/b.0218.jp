# Props と JSDoc

コンポーネントの公開契約である Props の設計と、公開入口に付ける JSDoc・Storybook 説明の書き方を定める。適用範囲と層の定義は [layers.md](../architecture/layers.md) に従う。

## 🟡 Props 設計 (IMPORTANT)

Props はコンポーネントの公開契約である。呼び出し側がレイアウト責務、HTML semantics、状態責務を読める名前にする。

- data loading 済みの値を渡す。`UI/` では loader、Source、URL query へのアクセスを props の裏側に隠さない。
- boolean props は表示状態や挙動の切り替えに限定する。複数の boolean が組み合わさって variant になる場合は union / variant prop を検討する。
- `className` は公開入口で受けてよい。外部 margin のためではなく、配置先固有の layout integration や Storybook / test のための逃げ道として扱う。
- DOM 要素を切り替える props は `as` を基本にする。見出し階層のように用途が限定される場合は `titleTagName` など、意味が分かる名前を使う。
- variant の具体値や ARIA role は、この文書だけで決めない。既存 token、対象 UI の意味、アクセシビリティ要件に合わせ、呼び出し側が理解できる union 名と DOM semantics を選ぶ。

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
- 動作が不明: `tooltip?: string` -> `/** ホバー時のツールチップ文字列。指定すると Tooltip でラップする */`
- 単位情報: `size?: 'md' | 'touch'` -> `/** 一辺の長さ。'md'（既定）はタッチの画面 44px・マウスの画面 36px、'touch' は常に 44px（コンパクトな配置でのタッチターゲット） */`
- 使い分けガイド: `titleTagName` -> `/** 一覧ページでは h2、単体では h3 が典型 */`

ストーリーの記述方針は [storybook.md](./storybook.md) を参照する。responsive や visual state のストーリーでも、幅や見た目だけを説明せず、その状態を保証したい利用文脈を書く。全 variant の一覧や最大構成を確認したい場合は複合ストーリーとして扱い、[storybook.md](./storybook.md) の manifest 除外規則に従う。

## 参照

- Storybook: [storybook.md](./storybook.md)
- TypeScript の JSDoc: [typescript.md](../conventions/typescript.md#jsdoc)
