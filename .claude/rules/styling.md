---
paths:
  - 'src/**/*.tsx'
  - 'src/components/**/*.ts'
  - 'src/ui/**/*'
  - 'panda.config.mts'
  - 'postcss.config.cjs'
  - 'stylelint.config.js'
---

# スタイル（Panda CSS）

作業の前に、次の文書のうち作業に当たるものを読み、従う。このファイルには規則を書かない。

- 常に読む: [styling.md](../../docs/conventions/styling.md)（使える API と import、hover、CSS 変数、状態の出し方、shorthand）
- 色・余白・トークンを使う・足すとき: [tokens.md](../../docs/design-system/tokens.md)。トークンを足す・変える前に、[mcp.md](../../docs/tooling/mcp.md) の panda MCP で既存のトークンとの重複を確かめる
- 見た目の要素を足す・変えるとき: [principles.md](../../docs/design-system/principles.md)
- 部品の外側の余白と、レスポンシブを書くとき: [layout.md](../../docs/components/layout.md)
