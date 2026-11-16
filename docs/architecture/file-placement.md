# ファイル配置

コンポーネントのファイルの置き方（配置型）と、import・命名の規則を定める。適用範囲と層の定義は [layers.md](./layers.md) に従う。

## 🟡 ファイル配置パターン (IMPORTANT)

### 配置型

| 配置型 | 用途                         | 例                                                                                |
| ------ | ---------------------------- | --------------------------------------------------------------------------------- |
| A      | 単一コンポーネント           | `UI/Heading.tsx`（+ `UI/Heading.stories.tsx`）                                    |
| B      | 親 = 公開入口、子 = 内部実装 | `Page/_shared/ArticleCard.tsx` + `Page/_shared/ArticleCard/{Header,Tags,...}.tsx` |
| C      | 並列 primitive 群            | `UI/Layout/{Stack,Container,Cluster,...}.tsx`                                     |

「公開入口」は外部から import される公開ファイル。配置型 B では親同名ファイル、配置型 A / C ではコンポーネントファイル自体を指す。

### 配置型 B の昇格条件

配置型 B は、公開入口を 1 点に保ったまま内部責務を分割したい場合に使う。内部子要素を 2 箇所以上の他 UI から再利用する、または内部子要素だけを直接テスト / Storybook で扱う価値が生まれた時点で、内部実装ではなく配置型 C または独立した UI コンポーネントへ昇格する。

`Page/` / `App/` でも同じ考え方を使う。単一の既存コンポーネントに閉じる要素は同名ディレクトリ内の内部実装に置き、複数箇所で使う、公開 API として読みたい、または単独で検証したい責務だけを独立ファイルにする。

### ディレクトリ構造

公開入口を同名ファイルとし、内部実装を同名ディレクトリに置く。テストは対象ファイルと同ディレクトリに置く。内部実装単体のテストは、独自ロジックや複雑な分岐を単独で検証する価値があるときだけ作る。

```txt
src/components/Page/_shared/
  ArticleCard.tsx              # 公開入口
  ArticleCard.test.tsx         # 公開入口のテスト
  ArticleCard.stories.tsx      # 公開入口の Storybook
  ArticleCard/
    Header.tsx                 # 内部実装
    Tags.tsx
```

### Storybook 配置

Storybook は原則として公開入口に作る。内部実装単体の Storybook は、公開入口経由では再現しにくい状態（複雑な分岐、データ取得失敗、独立 interactive 状態など）を検証する必要があるときだけ追加する。

## Import / 命名

- 配置型 B の公開入口・内部実装間、内部実装どうしは相対 import（`./` / `../`）を使う。
- 内部実装の export 名に親プレフィックスを付けない。
  - 良: `ArticleCard/Header.tsx` の `export function Header(...)`
  - 悪: `ArticleCard/ArticleCardHeader.tsx`

## 参照

- 層と依存の向き: [layers.md](./layers.md)
- テスト配置: [testing.md](../conventions/testing.md)
- Storybook: [storybook.md](../components/storybook.md)
