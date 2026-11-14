---
paths:
  - '**/*.test.{ts,tsx}'
  - 'tests/e2e/**/*.ts'
  - 'tests/vrt/**/*.ts'
  - 'playwright.*.config.ts'
---

# テスト規則

## Unit / Component Test

- フレームワークは Vitest、DOM 操作は jsdom。
- モックは `vi.mock()` / `vi.fn()` を使う。
- `export` された関数・クラス・メソッド、公開 API として利用される機能を対象にする。
- 配置型 B の内部実装は、親から相対 import するために export していても、公開入口テストで振る舞いを十分に覆えるなら個別テスト必須ではない。分岐・状態・アクセシビリティ責務が内部実装に閉じる場合は内部実装を直接テストする。

## 🔴 配置ルール (CRITICAL)

ユニットテストのファイルは対象ファイルと同じディレクトリに配置する。`__tests__` / `__test__` ディレクトリは使用しない。

```txt
src/components/Page/_shared/ArticleCard.tsx
src/components/Page/_shared/ArticleCard.test.tsx
```

統合テスト、E2E、VRT は `tests/` に配置可能である。

## Unit Test Style

- カバレッジ目標は 80%以上。
- ファイル名は `src/lib/tag/routing.ts` -> `src/lib/tag/routing.test.ts`。
- AAA パターンを守る。
- テスト名は日本語で「〜の場合、〜を返す」形式にする。
- 外部 API、ファイルシステム、時刻依存はモックする。
- 時刻依存は `vi.useFakeTimers` + `vi.setSystemTime` を使う。

## Visual Regression

- Playwright で Storybook のストーリーを撮影し、ベースラインと比べる。対象のストーリーと、ベースラインの取得・更新の手順は [tests/vrt/README.md](../../tests/vrt/README.md) に従う。
- 撮影は Chrome のデスクトップの 1 種類（ビューポートは幅 1280px・高さ 800px）で行う（`playwright.vrt.config.ts`）。
- ライトモードのみ（ダークモード未対応）。

## Accessibility

- 自動アクセシビリティチェックを実行する。
- キーボードナビゲーションを検証する。
- `prefers-reduced-motion` の動作を確認する。

## E2E

- Playwright（chromium のみ）を使用する。
- 手動 dev server は HTTPS 必須: `https://localhost:8080`。
- Playwright E2E は `playwright.e2e.config.ts` の `webServer` と `baseURL` に従う（現在は `http://127.0.0.1:3100`）。
- タイムアウトベースのアサーションを避け、deterministic な待機を使用する。
- `waitForTimeout`, `waitUntil: 'networkidle'`, `waitForNavigation`, `{ force: true }`, `page.pause()` は禁止（Biome error）。
- `waitForSelector`, ElementHandle, `$eval` は locator / web-first assertion へ寄せる（Biome warn）。

待機は時間や通信の静止ではなく、ユーザーから見える完了状態、URL、イベントを待つ。失敗時にアプリの未完了状態を検出でき、flake を隠さないためである。
Biome warn は既存移行の猶予であり、新規コードでの推奨ではない。

| 避ける API                       | 置換先                                                                      |
| -------------------------------- | --------------------------------------------------------------------------- |
| `page.waitForTimeout(...)`       | `await expect(locator).toBeVisible()` / `toHaveText()` / `toHaveURL()` など |
| `waitUntil: 'networkidle'`       | 画面上の完了状態を表す locator assertion                                    |
| `page.waitForNavigation()`       | 操作と `expect(page).toHaveURL(...)` の組み合わせ                           |
| `locator.click({ force: true })` | クリック可能状態を妨げる原因を修正し、通常の `click()` を使う               |
| `page.waitForSelector(...)`      | `page.getByRole(...)` などの locator + web-first assertion                  |

検索時は `waitForTimeout|networkidle|waitUntil.*networkidle|waitForNavigation|force: true|waitForSelector|page\.pause` を見る。

## Cross-Browser

- 最低限: Chrome, Firefox, Safari。
- スクロール、モーション、フォールバックの動作を検証する。

## 参照

- コンポーネント配置: [components.md](./components.md#-ファイル配置パターン-important)
- Linting: [linting.md](./linting.md)
