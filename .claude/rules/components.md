---
paths:
  - 'src/components/**/*'
  - 'src/ui/icons/**/*'
---

# コンポーネントの設計と配置

作業の前に、次の文書のうち作業に当たるものを読み、従う。このファイルには規則を書かない。

- 常に読む: [layers.md](../../docs/architecture/layers.md)（層の責務と、層の間の import の向き）
- ファイルを足す・動かす・分けるとき: [file-placement.md](../../docs/architecture/file-placement.md)
- 余白・レイアウト・レスポンシブを書くとき: [layout.md](../../docs/components/layout.md)
- Props と、公開入口の JSDoc を書くとき: [props-and-jsdoc.md](../../docs/components/props-and-jsdoc.md)
- 開閉・焦点・キー操作を持つ部品を作る・直すとき: [dynamic-element.md](../../docs/components/dynamic-element.md)。構造を分けるか迷ったら [headless-ui-component-design.md](../../docs/components/headless-ui-component-design.md) を、React Aria の hook を使う前に [mcp.md](../../docs/tooling/mcp.md) の React Aria MCP を見る
- 部品と props の名前を決めるとき: [terminology.md](../../docs/design-system/terminology.md)
