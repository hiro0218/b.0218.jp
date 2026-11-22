# Config Files Verification

## Rule: Read Before Suggest

変更提案の前に、関連する設定ファイルを必ず読むこと。
設定ファイルはプロジェクト規則の実行可能な source of truth であり、AI の一般知識より優先する。確認なしの提案は React Compiler、oxlint の overrides、Panda token、prebuild の実態とずれやすい。

## 必須チェック（最小）

- `next.config.mjs`: `reactCompiler` の有効/無効
- `.oxlintrc.json`: `plugins`・`categories` の基本設定 + `rules`・`overrides` に書く例外、`no-restricted-imports`（レイヤー依存）、`ignorePatterns`
- `.oxfmtrc.json`: `printWidth`・`singleQuote`・`sortImports`（import の並べ替え）、`ignorePatterns`
- `panda.config.mts`: `theme.tokens` の定義
- `postcss.config.cjs`: hover 自動ラップ設定
- `tsconfig.json`: `strict` と `paths`（`@/*`, `~/*`）
- `package.json`: `prebuild` と関連スクリプト

**詳細**:

- oxlint・oxfmt の設定と規則: [linting.md](./linting.md)
- React Compiler: [performance.md](../conventions/performance.md)
- レイヤー依存: [layers.md](../architecture/layers.md#-レイヤー依存関係-critical)
- スタイリング: [styling.md](../conventions/styling.md)
- TypeScript: [typescript.md](../conventions/typescript.md)
