# TypeScript コーディング規約

## 🔴 必須

- `any` を使用しない
- 型のみの import は `import type`
- 絶対パス import を使用（`@/*` は `src/*`、`~/*` はリポジトリルート）。相対 import にするのは、次の場合だけである
  - 配置型 B の公開入口と内部実装の間、内部実装どうし（[file-placement.md](../architecture/file-placement.md#import--命名)）
  - `build/`、`tests/`、テスト（`*.test.*`）、ストーリー（`*.stories.*`）のファイル
  - `panda.config.mts` から import で辿れる `src/ui/styled/theme/**` と `src/ui/lib/fonts.ts`。どちらも相対 import で、設定の読み込みで `@/` が解決されるかは未確認である

## 🟡 推奨

- import の並びは Biome の `organizeImports` に任せ、手で並べない（コミット時の `biome check --write` が並べ替える。[linting.md](../tooling/linting.md)）
- 命名: コンポーネントは PascalCase、ユーティリティは camelCase

## JSDoc

UI コンポーネントの公開入口の export 関数には JSDoc + `@summary` を付ける（Storybook AI manifest が消費）。
詳細な Props JSDoc 判断基準は [props-and-jsdoc.md](../components/props-and-jsdoc.md#jsdoc--storybook-説明) を参照。

## 参照

- Props 設計: [props-and-jsdoc.md](../components/props-and-jsdoc.md#-props-設計-important)
- JSDoc: [props-and-jsdoc.md](../components/props-and-jsdoc.md#jsdoc--storybook-説明)
- Storybook 規約: [storybook.md](../components/storybook.md)
