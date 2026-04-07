---
paths:
  - '**/components/**/*.tsx'
---

# Web Patterns (ECC)

## Component Composition

- Compound Components: 関連 UI が状態を共有する場合に使用。親が状態を所有、子は context で消費
  - ヘッドレス UI パターンには React Aria MCP を参照
- コンポーネントレイヤー構造（App/Page/UI/Functional）は `components.md` を参照

## 状態管理

SSG ブログのため、以下の原則を守る:

- Server Component をデフォルトとし、クライアント状態は最小限に
- URL にシリアライズ可能な状態（フィルタ、ページネーション等）は URL パラメータで管理
- サーバー状態をクライアントストアに複製しない
