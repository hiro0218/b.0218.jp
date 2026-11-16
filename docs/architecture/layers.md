# レイヤーと依存方向

`src/components/{UI,Functional,Page,App}/` 配下の React コンポーネントと、`src/ui/icons/` の icon コンポーネントについて、層の責務と、層の間の依存の向きを定める。
用語の正規定義は [terminology.md](../design-system/terminology.md)、機械的に検出できる import / barrel / formatter / lint の詳細は [linting.md](../tooling/linting.md) を参照する。
ここでは lint だけでは判断しにくい責務境界と例外を定義する。配置の判断は [file-placement.md](./file-placement.md) に書く。

## レイヤー定義

| 層            | 定義                                                                                                                                                                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UI/`         | 表示・操作の基礎コンポーネント。props で入力を受け、data loading、URL 状態、グローバル副作用、ページ単位の composition を持たない。新規 UI はドメイン非依存を原則とする |
| `Functional/` | 視覚 DOM を持たない副作用・リソース注入コンポーネント。`null`、または `<script>` / `<link>` / `<meta>` / `<style>` / `<noscript>` などの非表示 DOM のみを返す           |
| `Page/`       | ページ種別ごとの composition 層。UI と Functional を組み合わせ、Post / Tag / Page などのドメイン表示を構成する                                                          |
| `App/`        | サイト全体の shell、global UI、URL / storage / search dialog などサイト横断状態、自己完結した Feature Module を置く最上位層                                             |

視覚 DOM を描画するコンポーネントは `UI/` / `Page/` / `App/` のいずれかに置く。視覚 DOM と非表示の副作用を混ぜず、表示コンポーネントの再利用性と副作用境界を保つためである。
ドメイン語やサイト設定を含む表示は、原則として `UI/` に置かず、`Page/` または `App/` に置く。`UI/` の公開 API を移動・改名するときは、影響範囲（import 元、Storybook の `title`、VRT の基準画像）を確かめてから行う。

## Feature Module

Feature Module は、`App/` 内で独自 hooks / engine / types を持つ自己完結 module を指す。外部からは公開入口のみ import する。

Feature Module 構造は `Page/` 配下のドメインにも適用できる。ページ種別に閉じた機能が独自の hooks / engine / utils / types を必要とする場合、`App/` へ昇格させたり `src/hooks/` などの汎用層へ置いたりせず、`Page/<Domain>/` 内に同じ自己完結構造で配置する。`App/` と `Page/` の判定基準はスコープである。サイト横断で使われる機能（ヘッダー、検索、レイアウトなど）は `App/`、特定のページ種別に閉じる機能（記事ページの目次など）は `Page/<Domain>/` に置く。外部からは公開入口のみ import する規約、およびレイヤー依存ルール（`Page` から `App` への依存禁止、`Page/_shared` から個別ドメインへの依存禁止）は、`Page/` 配下の Feature Module 内部にもそのまま適用される。

### module 境界

「module 外」は、その module directory の外側にある runtime code を指す。module 内の test / Storybook が内部詳細を直接検証する場合は例外としてよい。

### 公開入口

公開入口は 1 ファイルに限定しない。外部から直接使う必要がある top-level component / provider / lifecycle API を公開入口とし、内部実装は module 外から直接 import しない。外部が lifecycle API を必要とする場合は、top-level facade を作る。純粋な re-export barrel で公開範囲を広げない。

## 🔴 レイヤー依存関係 (CRITICAL)

層ごとに、import しない先を次の表に示す。biome は [biome.json](../../biome.json) の `noRestrictedImports` の overrides で lint の error にする（コミット時の nano-staged と、`.github/workflows/pr-validation.yml` の `npm run lint`）。dependency-cruiser は [.dependency-cruiser.js](../../.dependency-cruiser.js) の規則に当たる import を PR の依存関係レポート（`.github/workflows/pr-dependency-graph-report.yml`）に示すが、違反があってもワークフローは失敗しない。

| import する側   | import しない先                                                      | 検出                      |
| --------------- | -------------------------------------------------------------------- | ------------------------- |
| `UI/`           | `App/`・`Page/`・`Functional/`                                       | biome・dependency-cruiser |
| `Functional/`   | `App/`・`Page/`・`UI/`                                               | biome・dependency-cruiser |
| `Page/`         | `App/`                                                               | biome・dependency-cruiser |
| `Page/_shared/` | 個別のページ（`Archive/`・`Home/`・`NotFound/`・`Post/`・`Single/`） | biome                     |
| `App/`          | `Page/`                                                              | dependency-cruiser        |

barrel 経由の import と `~/styled-system/*` の直接 import の禁止、biome の設定の書き方は、[linting.md](../tooling/linting.md#レイヤー依存--import) にある。

## 参照

- 配置: [file-placement.md](./file-placement.md)
- 用語規則: [terminology.md](../design-system/terminology.md)
- page.tsx のスタイル: [app-router.md](./app-router.md#-pagetsx-にスタイルを定義しない-critical)
- Lint の設定: [linting.md](../tooling/linting.md)
