---
paths:
  - '**/components/**/*.{ts,tsx}'
  - '**/components/UI/**/*.css'
  - 'src/ui/icons.ts'
---

# コンポーネント規則

## 🔴 Zero Margin Principle (CRITICAL)

UI コンポーネントのルート要素は外部マージンを持たない。コンポーネント外側の余白は親が `gap` などで制御する。

| 対象                                       | 扱い | 理由                                                                    |
| ------------------------------------------ | ---- | ----------------------------------------------------------------------- |
| ルート要素（`return` の最外層）の `margin` | 禁止 | 配置先のレイアウトに干渉し、再利用時に親の上書きが必要になる            |
| ルート要素の `margin: 0` リセット          | 許可 | 素タグ（`h1`, `p` など）の内在マージンを正規化するため                  |
| 内部子要素（ルート以外）の `margin`        | 許可 | コンポーネント内部のレイアウトは内部の責任。等間隔なら `gap` を優先する |

内部 margin は `margin-top` / `margin-block-start` などの片側 longhand を優先する。余白値は CSS 変数を使い、`margin: 0` の reset だけ直接値を許容する。

## 🔴 レイヤー依存関係 (CRITICAL)

```txt
App/ (最上位)
  -> Page/
      -> UI/
      -> Functional/
```

- `UI/` と `Functional/` は相互に import しない。
- `Page/` は `UI/` と `Functional/` を import できる。
- `App/` は全レイヤーを import できる。
- `UI/` / `Functional/` / `Page/` から上位層を import しない。
- `biome.json` の `noRestrictedImports` overrides で依存方向を強制する。

**Functional 層**は非表示・非対話のコンポーネントである。`null` を返すか、`<script>` / `<link>` タグのみを描画する。視覚的な DOM を描画するコンポーネントは UI 層または App 層に置く。

App/ 内で自己完結した機能モジュール（独自 hooks / engine / types を持つもの）は Feature Module として扱い、外部からは公開 API（トップレベルコンポーネント）のみ import する。

## 🟡 Props 設計 (IMPORTANT)

props は明示的に型定義し、複雑な型のインライン定義を避ける。

## 🟡 ファイル配置パターン (IMPORTANT)

`index.ts` / `index.tsx` による純粋な re-export 集約は `noBarrelFile` と `noRestrictedImports` で禁止する。

| Pattern | 用途                         | 例                                                            |
| ------- | ---------------------------- | ------------------------------------------------------------- |
| A       | 単一コンポーネント           | `UI/Heading.tsx`（+ `UI/Heading.stories.tsx`）                |
| B       | 親 = 公開 API、子 = 内部実装 | `UI/ArticleCard.tsx` + `UI/ArticleCard/{Header,Tags,...}.tsx` |
| C       | 並列 primitive 群            | `UI/Layout/{Stack,Container,Sidebar,...}.tsx`                 |

公開入口を同名ファイルとし、内部実装を同名ディレクトリに置く。テストは対象ファイルと同階層に置く。

```txt
src/components/UI/
  ArticleCard.tsx              # 公開入口
  ArticleCard.test.tsx         # 公開入口のテスト
  ArticleCard.stories.tsx      # 公開入口の Storybook
  ArticleCard/
    Header.tsx                 # 内部実装
    Excerpt.tsx
    Tags.tsx
```

Storybook は原則として公開入口に作る。内部実装の Storybook は、内部実装単体の状態確認が必要な場合だけ作る。

## Import / 命名

- 外部利用者は公開入口だけを import する。
- Pattern B の公開入口から同名ディレクトリ内の内部実装を import する場合は、相対 import を使う。
- Pattern B の内部実装同士も相対 import を使う。`@/components/UI/*/*` の外部直 import 禁止と衝突しないようにするためである。
- 直接呼び出されない内部実装は親プレフィックスを付けない。
  - 良: `ArticleCard/Header.tsx`（`export function Header(...)`）
  - 悪: `ArticleCard/ArticleCardHeader.tsx`
- React フック（`use*`）は React 慣用の命名を保つ。
- 値定数や型を伴う集約モジュール（例: `@/ui/icons` は `ICON_SIZE_*` 定数を伴う）は barrel と見なさない。純粋な re-export のみのファイルが禁止対象である。

## JSDoc / Storybook 説明

UI コンポーネントの公開入口の export 関数には `@summary` 付き JSDoc を必須とする。Storybook AI manifest が消費する。

Pattern B の内部実装は、親から相対 import するために export していても、外部公開しない限り必須対象ではない。ただし、内部実装単体の Storybook を作る、または内部実装を直接テスト対象にする場合は JSDoc を付ける。

Props JSDoc は名前と型で自明なら書かない。次の場合だけ書く。

- ドメイン固有の意味: `type: AlertType` -> `/** 重要度と視覚表現が変わる */`
- 動作が不明: `intrinsic?: boolean` -> `/** flex column + align center による内在的な中央揃え */`
- 単位情報: `delay?: number` -> `/** ホバーから表示までの遅延（ms） */`
- 使い分けガイド: `titleTagName` -> `/** 一覧ページでは h2、単体では h3 が典型 */`

全ストーリーに `parameters.docs.description.story` を記述する。「いつ・なぜ使うか」を書き、「何を表示するか」は書かない。

## レスポンシブ / 状態管理

- 新しいレスポンシブ CSS を書く前に「あらゆる幅でどう見えるべきか」を確認する。
- `@media (--isDesktop)` は `position: fixed / sticky`、タッチ vs マウスの操作差異、viewport 全幅を使う場合の最終手段である。
- 連続的な値は `clamp()`、container 内では `cqw`、段階的な配置変更は `flex-wrap` / Grid auto-fit / `@container` を優先する。
- URL にシリアライズ可能な状態（フィルタ、ページネーション等）は URL パラメータで管理する。
- サーバー状態をクライアントストアに複製しない。

## デザイン品質

- ライブラリのデフォルトをそのまま出荷しない。
- hover / focus / active の状態を設計する。
- スケール・余白でヒエラルキーを表現する。
- デザイントークン経由の値のみ使用する（詳細は [styling.md](./styling.md)）。

## 参照

- SSG 原則: [architecture.md](./architecture.md)
- スタイリング: [styling.md](./styling.md)
- レイヤー依存の lint 強制: [linting.md](./linting.md)
- テスト配置: [testing.md](./testing.md)
- Storybook: [storybook.md](./storybook.md)
