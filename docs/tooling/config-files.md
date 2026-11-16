# Config Files Verification

## Rule: Read Before Suggest

変更提案の前に、関連する設定ファイルを必ず読むこと。
設定ファイルはプロジェクト規則の実行可能な source of truth であり、AI の一般知識より優先する。確認なしの提案は React Compiler、Biome overrides、Panda token、prebuild の実態とずれやすい。

## 必須チェック（最小）

- `next.config.mjs`: `reactCompiler` の有効/無効
- `biome.json`: `"preset": "recommended"` + 例外方式、`noRestrictedImports`（レイヤー依存）、VCS 統合
- `panda.config.mts`: `theme.tokens` の定義
- `postcss.config.cjs`: hover 自動ラップ設定
- `tsconfig.json`: `strict` と `paths`（`@/*`, `~/*`）
- `package.json`: `prebuild` と関連スクリプト

**詳細**:

- Biome 設定・規則: [linting.md](./linting.md)
- React Compiler: [performance.md](../conventions/performance.md)
- レイヤー依存: [layers.md](../architecture/layers.md#-レイヤー依存関係-critical)
- スタイリング: [styling.md](../conventions/styling.md)
- TypeScript: [typescript.md](../conventions/typescript.md)
