# Dynamic Element 規則

## 🟡 Dynamic Element (IMPORTANT)

この節は、`Dynamic Element`（状態遷移やユーザー操作を中心に説明する UI）に適用する。用語は [terminology.md](../design-system/terminology.md) を参照する。Tooltip・DropdownMenu・Toast・ZoomImage・SearchDialog が当たる。部品が小さく、利用箇所も少ないため、構造は増やさない。hook は既定で部品の本体に書き、`primitive/` や `behaviors/` のような層を足さない（層の定義と、構造を分けるかの判断基準は [設計思想](./headless-ui-component-design.md) にある）。

### 手段の優先順位

次の順に選ぶ。

1. ネイティブ: HTML・CSS・DOM API（`<dialog>` と `showModal()`、`:disabled`、`[open]`、anchor positioning など）
2. React Aria の hook: 個別パッケージ（`@react-aria/*`）から、必要なものだけを import する
3. 自作

`react-aria-components` は採らない。理由は 3 つある。依存に入ったことが、履歴上一度も無い。初期 JS の予算（`package.json` の `nextBundleAnalysis`）がある。Dialog の React Aria が、記事ページの初期 JS の約 15 KB を占めた（`UI/ZoomImage/Controller.tsx` のコメント）。

### 対象ブラウザより新しい機能

`package.json` の `browserslist` に届かない機能は、段階的強化でだけ使う。条件は、無くても同じ操作が完了することと、分岐が `@supports` か 1 行の機能検出で済むことである。例: `UI/DropdownMenu/styles.ts` の anchor positioning。`<dialog>` の `closedby`、`popover="hint"`、`interestfor` は使わない。`browserslist` の下限が Safari 27.3・Firefox 147 に上がったら、`closedby="any"` と popover に置き換える。

### モーダル

新規のモーダルは、`<dialog>` と `showModal()` だけで作り、`useDialog` と `FocusScope` を足さない。ダイアログの外は `showModal()` が操作を受け付けなくし、閉じたあとの焦点の復帰もブラウザが行う。既存のモーダルは、ネイティブの `<dialog>` に `useDialog` と `FocusScope` を併用している。対象は `App/Search/SearchDialog.tsx` と `UI/ZoomImage/Dialog.tsx` で、ネイティブだけへ段階的に移す。`useDialog` は iOS Safari の VoiceOver に向けた回避策（0.5 秒待ってから blur して再 focus する）を持つため、移行では iOS 実機で確認する。

### 状態と公開 API

- 状態の置き場は、URL、ネイティブの状態（`[open]` など）、ARIA、本体の `useState`、親の順に選ぶ。
- 要素の差し替えは `as` にする。操作部品は閉じた union（`IconButton` の `'button' | 'link' | 'externalLink'`）、配置部品は任意の要素（`UI/Layout/Stack.tsx`）を受ける。`render` は足さない。
- アイコンだけの部品のルート要素には、`aria-label` を型で必須にする（`IconButton`）。内側の部位の名前は `<部位>Label` とする（`DropdownMenu` の `triggerLabel`）。
- 部品が受け取った props は、描画する要素へ渡す。ホバーとフォーカスの props は、焦点を取れる要素そのものへ渡す（`UI/Tooltip.tsx`）。
- `apiRef` と `useImperativeHandle` は使わない。外からの操作は、次のどちらかで公開する。
  - 親が hook を持って状態を渡す（`Page/Post/Share.tsx` と `UI/Toast.tsx`）
  - Provider と `use<名前>()` を使う（`App/Search/SearchProvider.tsx` の `useSearchOpener`）
- `src/hooks/` には、ドメインに依存せず、2 か所以上から使う hook だけを置く。部品専用の hook は、その部品のディレクトリの直下に `use<名前>.ts` として置く。既存の `src/hooks/useIsMounted.ts` は `App/Header/Layout.tsx` だけが使っているので、触るときに寄せる。

## 参照

- 用語規則: [terminology.md](../design-system/terminology.md)
- スタイリング: [styling.md](../conventions/styling.md)
- テスト: [testing.md](../conventions/testing.md)
- client 境界と遅延読み込み: [app-router.md](../architecture/app-router.md#-client-境界と遅延読み込み-important)
- 設計思想: [headless-ui-component-design.md](./headless-ui-component-design.md)
