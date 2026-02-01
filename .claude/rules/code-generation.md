---
paths:
  - '**/*.{ts,tsx,js,jsx}'
---

# コード生成の指示

## Priority Markers

> 優先度の定義については [CLAUDE.md](../../CLAUDE.md#priority-markers) を参照。

## 必須

- Next.js App Router を前提に実装する
- `generateMetadata` / `generateStaticParams` を必要に応じて使用
- ルートグループは `(ArchivePage)`, `(PostPage)`, `(SinglePage)` を使う
- パスエイリアスは `@/*` と `~/*` を使用
- レイヤー依存は `App → Page → UI ↔ Functional`

## 参照

- TypeScript: [typescript.md](./typescript.md)
- Components: [components.md](./components.md)
- Architecture: [architecture.md](./architecture.md)
- Styling: [styling.md](./styling.md)
- React Compiler: [react-compiler-optimization.md](./react-compiler-optimization.md)
