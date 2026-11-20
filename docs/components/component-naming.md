# 命名の用語表

デザインツールのコンポーネント名、コードのコンポーネント名、CSS のクラス名とカスタムプロパティ名で、同じ語を同じ意味で使う。表記（大文字と小文字、区切り方）は各層の慣習に従う。

名前に付けるスコープ修飾（`Post` など）と、既存の名前の扱いは、[terminology.md](../design-system/terminology.md) の「公開範囲とスコープ修飾」「既存語の扱い」に従う。

| 語              | 意味                                                                                    | 避ける呼び方                     | 使わない場面                           |
| --------------- | --------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------- |
| Element         | HTML 要素、またはそれに 1 対 1 で対応する最小単位                                       | HTML 要素を総称して Block と呼ぶ | なし                                   |
| Section         | ページの中の意味のある区画                                                              | なし                             | 幅を制限するだけの要素                 |
| Inner           | 区画の中で内容の幅を制限し、中央に寄せる要素。「何の」を付ける（section-inner）         | container、wrapper と呼ぶ        | なし                                   |
| Outer           | 親が子のコンポーネントの配置と外側の余白を決める要素。親の子要素として扱う              | wrapper と呼ぶ                   | 単独のコンポーネントにする             |
| Container       | `container-type`（または `container`）でサイズクエリの問い合わせ先にした要素            | なし                             | 幅を制限するだけの要素                 |
| Gutter          | コンテンツの外縁と画面の端のあいだの、インライン方向の余白。サイト全体で 1 つのトークン | なし                             | 列や子要素どうしの間隔                 |
| Gap             | Flexbox や Grid の子要素どうしの間隔                                                    | なし                             | 画面の端との余白、通常フローのマージン |
| Columns         | マルチカラムの段組み                                                                    | なし                             | Flexbox や Grid の列                   |
| Flex Columns    | Flexbox で横に並べた列                                                                  | 単に Columns と呼ぶ              | なし                                   |
| Grid            | CSS Grid の配置                                                                         | なし                             | Flexbox の配置                         |
| Row             | 配置の結果                                                                              | なし                             | 要素の名前                             |
| Link            | ページを移動する `<a>`。見た目がボタンでも Link                                         | なし                             | `<button>`                             |
| Button          | ページの中の操作を起こす `<button>`、`<input type="submit">`                            | なし                             | `<a>`                                  |
| List            | `<ul>` か `<ol>` の並びと、それを 1 つだけ包むコンポーネントのルート                    | なし                             | `<ul>`、`<ol>` を使わない並び          |
| Navigation      | 通常のサイトの導線                                                                      | なし                             | 操作の選択肢                           |
| Menu            | 操作を実行したり選んだりする選択肢の一覧                                                | なし                             | サイトの導線                           |
| Paragraph       | 1 つの段落                                                                              | Text と呼ぶ                      | なし                                   |
| Rich Text       | 見出し、段落、リストを含む編集領域                                                      | Text と呼ぶ                      | なし                                   |
| Pattern         | 静的で再利用できる見た目の断片                                                          | Template と呼ぶ                  | 動的なデータを前提にした UI            |
| Component       | 単一の定義で管理され、差し替えられる入力点（props、slots、variants）を持つ単位          | なし                             | 見た目が共通なだけの断片               |
| Dynamic Element | JavaScript や状態の遷移を伴う、振る舞いが中心の UI（Component と兼ねてよい）            | なし                             | 静的な断片                             |
| Template        | ページ単位で条件つきに適用する描画の定義                                                | なし                             | 静的な断片                             |
| Theme           | 構造の上に乗る見た目、トークン、色、余白のまとまり                                      | なし                             | 構造や動的なロジック                   |

- 正式名称に使わない語: Block、Wrapper、Text、Widget、Module
- Inner、Outer、Container は単独で使わず、対象を表す語を付ける（section-inner、card-outer、list-container）
- コンポーネントの中の要素は、CSS のクラス名をルートの語で始める（架空の例: PlanList の中なら plan-list-card）。コンポーネント名と styled 部品名には適用しない
- 省略語は Web 標準の略語（img、nav）と、この表に元の語と並べて書いた略語だけを使う
- クラス名に番号を付けない。役割が違えば役割名、見た目の種類が違えば data-variant、位置で選ぶだけなら :nth-child() を使う
- 表にない語を使うときは、コードに現れるプロパティ名、要素名、ARIA のロール名と同じ語かを調べ（同じ語ならその意味を変えずに使う）、責務を表す語かを確かめてから、この表に足す
- 責務を表す語かどうかは、[terminology.md](../design-system/terminology.md) の「判定フロー」の 2（視覚特性ではなく、責務・HTML/CSS の実体・スコープを反映しているか）で判定する

## 参照

- 用語規則: [terminology.md](../design-system/terminology.md)
- スタイリング: [styling.md](../conventions/styling.md)
- 内部実装の命名: [file-placement.md](../architecture/file-placement.md#import--命名)
