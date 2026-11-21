---
paths:
  - 'src/**/*.tsx'
  - 'src/hooks/**/*'
  - 'next.config.mjs'
---

# React と Next.js のコード

作業の前に、次の文書のうち作業に当たるものを読み、従う。このファイルには規則を書かない。

- 常に読む: [app-router.md](../../docs/architecture/app-router.md)（Server Component を既定にする、client 境界、`page.tsx` にスタイルを置かない）
- 常に読む: [performance.md](../../docs/conventions/performance.md)（React Compiler を前提にした memo 化、画像とフォント）
- hook を足す・動かすとき: [dynamic-element.md](../../docs/components/dynamic-element.md) の「状態と公開 API」（`src/hooks/` に置く hook の条件）
- Next.js の API の使い方に迷ったとき: [mcp.md](../../docs/tooling/mcp.md) の next-devtools MCP
