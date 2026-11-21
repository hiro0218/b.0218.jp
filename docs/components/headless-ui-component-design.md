# UIコンポーネント設計思想

## 目的

この文書は、状態や操作を持つ UI コンポーネント（以下、部品）の構造を選ぶ基準を定める。部品を作る、直す、レビューするときに使う。「する・しない」の規範は、[`docs/` の各文書](../README.md)が持つ。この文書は、その理由と、構造を分けるかどうかの判断基準を持つ。

目的は 2 つある。

- キーボード操作、フォーカス管理、ARIA を、一から書かずに済ませる。
- 変更 1 回あたりの保守費用を下げる。費用は、変更の手間と、壊したときの被害で測る。手間は、変更箇所を見つけて理解し、直し、確かめる作業である。ファイルの数では測らない。

対象は、`src/components/` の `UI/`、`Page/`、`App/` にある部品のうち、状態や操作を持つもの（[Dynamic Element](../design-system/terminology.md#-用語分類軸-important)）である。ページの組み立て、デザイントークン、layout primitive は対象外である。それぞれ [app-router.md](../architecture/app-router.md)、[tokens.md](../design-system/tokens.md)、[layout.md の Every Layout 原則](./layout.md#-every-layout-原則-important)が扱う。

前提は、静的生成（SSG）、Panda CSS、日本語だけのサイト、WCAG 2.2 AA を下限とするアクセシビリティである。

## 設計原則

1. 振る舞いは、ネイティブ、React Aria の hook、自作の順に選ぶ。自作は、前の 2 つにない分だけにする。自作が増えるほど、キーボード操作、フォーカス、ARIA の保守を自分で負うためである。React Aria の hook は、1 つの仕事だけを担うものを組み合わせて使う。例は `UI/Tooltip.tsx` で、`useTooltipTriggerState`、`useTooltipTrigger`、`useTooltip` を組み合わせる。順位の詳細は [dynamic-element.md の手段の優先順位](./dynamic-element.md#手段の優先順位)に従う。
2. 部品の状態と操作は、1 つの hook にまとめる。画面からの操作と、コードからの呼び出しは、同じ関数を通す。コードから操作を呼ぶ必要が出たときに、画面からの操作と同じ結果で呼べるためである。例は `App/Search/SearchProvider.tsx` で、検索ボタン（`App/Search/SearchTrigger.tsx`）と `/` キーが、同じ `open` を呼ぶ。部品が小さいうちは、hook を部品の本体に書く（[dynamic-element.md の Dynamic Element](./dynamic-element.md#-dynamic-element-important)）。計算は、部品を通すと確かめにくくなった時点で、純粋関数に切り出す（[Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell)）。
3. スタイルは、部品が公開した約束だけを参照する。約束は、ネイティブの状態、ARIA、`data-<状態>`、CSS 変数の順に選ぶ（[styling.md の状態とスタイル](../conventions/styling.md#-状態とスタイル-important)）。例は `UI/Toast.tsx` で、表示の状態を `data-visible` で出し、スタイルは `[data-visible='true']` で選ぶ。別のファイルが頼る約束は、コメントだけで守らず、共有の定数、属性、テストにする。約束を変えたときに、壊れる箇所を型やテストが示すためである。

   約束は、要素に届いて初めて効く。受け取った props は、描画する要素へ渡す（[dynamic-element.md の状態と公開 API](./dynamic-element.md#状態と公開-api)）。ホバーとフォーカスの props は、焦点を取れる要素そのものに付ける。React Aria の `useFocus` は、自分自身へのフォーカスしか受けないためである。子のボタンを包む `span` に付けると、ボタンにフォーカスが当たっても開かない。`UI/Tooltip.tsx` は、子の要素へ props を渡す。

   操作できる部位には、すべてアクセシブルな名前を付ける。名前は、見える文字を含める（WCAG 2.5.3）。含まない名前は、axe の自動検査が検出する（[testing.md の Accessibility](../conventions/testing.md#accessibility)）。

4. 業務の知識は `Page/` と `App/` に置き、`UI/` に持ち込まない。部品は操作を公開し、`Page/` と `App/` が、その操作を業務上の操作に結びつける。例は `Page/Archive/Pagination.tsx` で、ページの URL の作り方を、`getPageHref` として呼び出し側から受け取る。層の定義は [layers.md のレイヤー定義](../architecture/layers.md#レイヤー定義)に従う。

## 構造を分けるかの判断基準

分けると保守費用が下がるのは、次の 3 つがそろうときである。

1. 分けた片方だけが変わる。変更の軸が独立している。
2. 分けた境界の約束が安定していて、型、テスト、lint で検査できる。
3. 1 回の変更で読む範囲と確かめる範囲が、実際に減る。

1 回の変更が境界を横切ると、分けた分だけ、直す場所と、そろえる約束が増える。ファイルが増えること自体は、費用ではない。

このリポジトリで測った結果は、次のとおりである。

| 観点               | 結果                                                              | 対象                                           |
| ------------------ | ----------------------------------------------------------------- | ---------------------------------------------- |
| 変更の軸           | コードを変えたコミットの 83% が、スタイルだけ、またはロジックだけ | 6 部品の 179 コミット                          |
| 小さい部品         | 1 回の変更が触る本番ファイルは平均 1.0〜1.13 個                   | 4 部品の 59 コミット                           |
| 細かく分けた検索   | ロジックだけの変更が触る本番ファイルは平均 3.1 個                 | 検索の 54 コミット                             |
| モーダルの開閉     | `showModal` の記述が増減したコミットが 12 か月で 9 件             | `src/components/` と `src/hooks/` の本番コード |
| 別ファイルとの約束 | コメントだけで守る箇所が 14 件。9 件は CSS が絡む                 | `src/` の本番コード                            |

測定の条件は、次のとおりである。

- 測定日は 2026-11-15 である。
- 対象は、Tooltip、DropdownMenu、Toast、ZoomImage、検索（`App/Search/`）、Pagination に、2025-11-15 以降に触れたコミットである。マージは除く。複数の部品に触れるコミットは、部品ごとに数える。
- 変更行は、`styled` と `css` のテンプレートの中ならスタイル、それ以外のコメントでない行ならロジックと数える。ファイルの追加、削除、改名と、コメントだけの変更は、コードを変えたコミットに含めない。近似である。
- 本番ファイルは、`*.test.*` と `*.stories.*` を除いたファイルである。
- 「細かく分けた検索」は、コミット `6a5f157f` の親にある、検索の構成である。本番の `.ts` と `.tsx` が 28 ファイル 2,262 行で、内部の hook 4 つ、1 つにまとめる hook、検索エンジンと補助関数、表示の部品に分かれていた。`6a5f157f` で作り直され、現在は 19 ファイル 1,785 行である。ロジックだけの変更のうち、3 個以上のファイルを触ったものは 37% だった。
- 約束の件数は、「食い違」「写し」「外さない」「別の名前にしない」「ずれる」「ずれて」のいずれかを含む、本番コードのコメント 26 行を読んで数えた。別のファイルとの約束だけを数えた。網羅ではない。

分けるための上の 3 つの条件がそろいやすいのは、次の 4 つの場合である。

- 同じ決定を 2 つ以上の部品が知っていて、その決定が変わったときは、その決定を 1 か所に寄せる。置き場は、hook なら `src/hooks/` である。ドメインに依存せず、2 か所以上から使うものに限る。
- 同じ振る舞いに 2 つ目の見た目が要るときは、hook と見た目を分ける。
- 部品を通すと確かめにくい計算が出たときは、その 1 関数を、同じディレクトリのファイルに切り出す。
- 別のファイルとの約束を、コメントだけで守っているときは、共有の定数、属性、テストにする。

1 回の変更が 1 ファイルで済む小さい部品は、分けない。分けても 1 ファイルを下回らず、スタイルとロジックの両方に及ぶ変更だけが、2 ファイルに増える。構造を変える前は、対象のパスの `git log --name-only` で、直近 12 か月の 1 回の変更が触るファイル数を数え、分けた後に減るかを見積もる。

## 部品の確かめ方

- ロールとアクセシブルな名前で要素を探し、利用者と同じ操作で確かめる（[Testing Library の指針](https://testing-library.com/docs/guiding-principles/)）。
- キーボード操作と ARIA 属性の期待値は、WAI-ARIA Authoring Practices の該当するパターンに合わせる（例: [Listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)）。React Aria の挙動がこれと異なる場合は、React Aria の挙動を採り、テストに理由を書く。
- テストするのは、部品が利用者に見せる挙動である。React Aria の内部の実装は、重ねてテストしない。React Aria の更新のたびに、このリポジトリのテストまで直すことになるためである。
- ブラウザが決める挙動は、実ブラウザで確かめる。置き場は [testing.md の対話する部品のテスト](../conventions/testing.md#-対話する部品のテスト-important)に従う。
- ブラウザの API を使う部品は、サーバーでのレンダリングで例外が出ないことも確かめる（`UI/ZoomImage.test.tsx`）。

## 概念と置き場の対応

層と配置の正は、[file-placement.md のファイル配置パターン](../architecture/file-placement.md#-ファイル配置パターン-important)である。

| 概念                      | 置き場                                                    | 例                                                    |
| ------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| 業務の知識を持つ部品      | `Page/`、`App/`                                           | `Page/Archive/Pagination.tsx`                         |
| 公開入口の部品            | `UI/` の、部品と同名のファイル                            | `UI/Tooltip.tsx`                                      |
| 状態と操作をまとめる hook | 部品の本体。分けるなら部品のディレクトリの直下            | `UI/Toast/useToast.ts`                                |
| 部品をまたぐ振る舞い      | `src/hooks/`、`@react-aria/*`                             | `src/hooks/useDisclosure.ts`                          |
| スタイルだけのファイル    | 部品と同名のディレクトリの中                              | `UI/DropdownMenu/styles.ts`                           |
| 複数の部品が使う見た目    | `src/ui/styled/components/`（`data-slot` に依存させない） | `stateLayerControl.ts`                                |
| 純粋関数                  | 部品のファイルの中。分けるなら同じディレクトリ            | `Page/Archive/Pagination.tsx` の `getPaginationRange` |

見た目を部品の中へ閉じ込めると、同じ見た目を別の要素へ当てるときに複製が要る。そのため、複数の部品が使う見た目は、共有のスタイルとして置く（[UI Affordances](https://fractaledmind.com/2025/12/01/ui-affordances/)）。

`primitive` は、layout primitive とデザイントークンの階層だけを指す（[terminology.md](../design-system/terminology.md#-用語分類軸-important)）。状態と操作をまとめる hook には使わない。「機能」も層の名前にしない。業務の知識を持つ部品は `Page/` と `App/` に置き、`Functional/` は視覚 DOM を持たない副作用の層である。import の向きは [layers.md](../architecture/layers.md#-レイヤー依存関係-critical)、barrel（`index.ts`）の禁止は [linting.md](../tooling/linting.md#レイヤー依存--import)が定める。

## 採っていないもの

次の構成と決まりは採っていない。表の `primitive/` は、部品ごとのディレクトリの中にある、スタイルを持たない hook とパーツ（hook を描画する要素に結びつけたコンポーネント）の置き場である。`behaviors/` は、特定の部品に依存しない hook の置き場である。

| 採らないもの                                          | 理由                                                                  | 代わりにしていること                                             |
| ----------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 部品ごとのディレクトリと `primitive/`、`behaviors/`   | 小さい部品は、1 回の変更が 1 ファイルで済む                           | hook は既定で本体に書き、条件に当たる部品だけ分ける              |
| パーツ（Root と部位の分割、パーツの有無で機能を表す） | 2 つ目の見た目が要る部品がない                                        | 部品の本体が持つ。真偽値の props は、表示や挙動の切り替えに限る  |
| `react-aria-components` を優先する                    | 依存に入れておらず、初期 JS の予算がある                              | `@react-aria/*` の hook を、必要なものだけ使う                   |
| `apiRef` と変更の詳細（`reason`、`source`、`cancel`） | 取り消しや理由の区別が要る部品がない                                  | 親が hook を持つか、Provider と `use<名前>()` で公開する         |
| すべてのパーツへの `data-slot`                        | 使っているのは、`CopyButton.tsx` と `CodeBlock.tsx` の 1 組だけである | 境界を越えて選ぶときだけ付ける                                   |
| `render` プロパティと、要素の種類を変えない決まり     | `as` で足りる。`IconLink` は内部リンクと外部リンクを切り替える        | `as` の閉じた union を使い、`aria-label` を型で必須にする        |
| 名前のための専用の props を作らない決まり             | 内側の部位には、外から `aria-label` を渡せない                        | `<部位>Label`（`DropdownMenu` の `triggerLabel`）                |
| props の名前を React Aria に揃える決まり              | 手段の優先順位で、ネイティブが先である                                | `disabled` のように、ネイティブの名前を使う                      |
| 置き場を、作る時点の性質だけで決める                  | 1 か所だけが使う hook を、部品から離さないため                        | `src/hooks/` は、2 か所以上から使う hook に限る                  |
| `useIsSSR` と `useLocale`（右から左の表示）           | 日本語だけで、SSG である                                              | レンダー中にブラウザ API を読まず、`useSyncExternalStore` を使う |
| CSS-in-JS と CSS Modules の両対応                     | スタイルは Panda CSS だけである                                       | `@/ui/styled` の `css`、`styled` を使う                          |
| CSS 変数の名前にコンポーネント名を含める決まり        | 部品の中でしか使わない変数に、接頭辞は要らない                        | 用途で名付ける（`Chart.tsx` の `--percent`）                     |
| 実装の前に、チームで合意を取る手続き                  | 規則に、合意を取る相手が定められていない                              | 公開 API を変える前に、影響範囲を確かめる                        |

代わりにしていることの正は、[dynamic-element.md](./dynamic-element.md)、[props-and-jsdoc.md](./props-and-jsdoc.md)、[styling.md](../conventions/styling.md)、[app-router.md](../architecture/app-router.md#-client-境界と遅延読み込み-important)、[tokens.md](../design-system/tokens.md#-トークン階層-important)である。

## 未確認と限界

- 測定は近似である。変更行の分類は、テンプレートの位置だけで決めた。期間を変えると、比率は変わりうる。
- 検索の作り直しと、共有 hook の置き換えは、構造を変えた理由がコミットに記録されていない。共有 hook は `src/hooks/useDialog.ts` で、2025-09-12 から 2026-01-17 まで存在した。再び共有 hook を作るときは、`git log -- src/hooks/useDialog.ts` で、当時の構成を先に確かめる。
- 「WAI-ARIA のパターンがある汎用の部品は、境界の約束が安定しやすい」は、実測していない。
- 個別ページどうし（`Page/Archive/` と `Page/Post/` など）の import を禁じる規則は、[layers.md](../architecture/layers.md#-レイヤー依存関係-critical) に無い。2026-11-15 時点で、そのような import は 0 件である。

## 参照

- 層、import の向き: [layers.md](../architecture/layers.md)
- 配置: [file-placement.md](../architecture/file-placement.md)
- 手段の優先順位、状態と公開 API: [dynamic-element.md](./dynamic-element.md)
- 状態とスタイル: [styling.md](../conventions/styling.md)
- 対話する部品のテスト: [testing.md](../conventions/testing.md)
- client 境界と遅延読み込み: [app-router.md](../architecture/app-router.md)
- 用語: [terminology.md](../design-system/terminology.md)
