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
- Pattern B の内部実装は、親から相対 import するために export していても、公開入口テストで振る舞いを十分に覆えるなら個別テスト必須ではない。分岐・状態・アクセシビリティ責務が内部実装に閉じる場合は内部実装を直接テストする。

## 🔴 配置ルール (CRITICAL)

ユニットテストのファイルは対象ファイルと同じディレクトリに配置する。`__tests__` / `__test__` ディレクトリは使用しない。

```txt
src/components/Button/Button.tsx
src/components/Button/Button.test.tsx
```

統合テスト、E2E、VRT は `tests/` に配置可能である。

## Unit Test Style

- カバレッジ目標は 80%以上。
- ファイル名は `src/utils/helper.ts` -> `src/utils/helper.test.ts`。
- AAA パターンを守る。
- テスト名は日本語で「〜の場合、〜を返す」形式にする。
- 外部 API、ファイルシステム、時刻依存はモックする。
- 時刻依存は `vi.useFakeTimers` + `vi.setSystemTime` を使う。

## Visual Regression

- スクリーンショットは主要ブレークポイント（320, 768, 1024, 1440）で取得する。
- 対象は記事詳細、記事一覧、アーカイブページ。
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

| 避ける API                       | 置換先                                                                      |
| -------------------------------- | --------------------------------------------------------------------------- |
| `page.waitForTimeout(...)`       | `await expect(locator).toBeVisible()` / `toHaveText()` / `toHaveURL()` など |
| `waitUntil: 'networkidle'`       | 画面上の完了状態を表す locator assertion                                    |
| `page.waitForNavigation()`       | 操作と `expect(page).toHaveURL(...)` の組み合わせ                           |
| `locator.click({ force: true })` | クリック可能状態を妨げる原因を修正し、通常の `click()` を使う               |
| `page.waitForSelector(...)`      | `page.getByRole(...)` などの locator + web-first assertion                  |

検索時は `waitForTimeout|networkidle|waitUntil.*networkidle|waitForNavigation|force: true|waitForSelector|page\\.pause` を見る。

## Cross-Browser

- 最低限: Chrome, Firefox, Safari。
- スクロール、モーション、フォールバックの動作を検証する。

## 参照

- コンポーネント配置: [components.md](./components.md#-ファイル配置パターン-important)
- Linting: [linting.md](./linting.md)
