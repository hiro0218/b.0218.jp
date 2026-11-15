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

## 🟡 対話する部品のテスト (IMPORTANT)

開閉・焦点・キー操作を持つ部品は、振る舞いを決めるものでテストの置き場を分ける。

- このリポジトリの JS が決める振る舞いは、部品の隣の `*.test.tsx`（Vitest、jsdom）で確かめる。例は状態の遷移、タイマー、ARIA 属性の付与である（`src/components/UI/Tooltip.test.tsx`）
- ブラウザが決める振る舞いは、Playwright の実入力で確かめる。例は top layer、Esc による cancel、モーダルの焦点の取り込みと復元、背景のクリックである
  - サイトの画面で操作するものは `tests/e2e/specs/` に置く（`searchDialog.spec.ts`）
  - Storybook のストーリーで描ける UI 部品は、`tests/vrt/` に `*.interaction.spec.ts` として置く（`zoomImage.interaction.spec.ts`）
- jsdom の `HTMLDialogElement` には `showModal()` と `close()` が無い。スタブで通ったテストは、ブラウザの挙動を保証しない（`ZoomImage.test.tsx` はスタブしている）

## 既知の欠陥の残し方

直せていない欠陥を、通常のテストにして失敗させたままにしない。skip もしない。axe の違反だけは例外で、「Accessibility」の `disabledRules` に従う。

- Vitest は `test.fails`、Playwright は `test()` の中の `test.fail()` で、いまは失敗することを確かめる形にする
- 直すと、期待していた失敗が起きなくなってテストが落ちる。そのときに印を外す
- 印の直前に、欠陥の原因を 1 文で書く

## Visual Regression

- Playwright で Storybook のストーリーを撮影し、ベースラインと比べる。対象のストーリーと、ベースラインの取得・更新の手順は [tests/vrt/README.md](../../tests/vrt/README.md) に従う。
- 撮影は Chrome のデスクトップの 1 種類（ビューポートは幅 1280px・高さ 800px）で行う（`playwright.vrt.config.ts`）。
- ライトモードのみ（ダークモード未対応）。

## Accessibility

- 自動検査は axe-core で行う。`tests/e2e/specs/a11y.spec.ts` が、主要な画面と検索ダイアログを開いた状態を検査する
- 検査の下限は WCAG 2.2 AA（タグ `wcag2a`・`wcag2aa`・`wcag21a`・`wcag21aa`・`wcag22aa`）である。best-practice のルールは含めない
- 直せていない違反は、そのルール ID だけを `disabledRules` で無効にし、理由を書く。ページ全体を除外しない
- キーボード操作は、Playwright の実入力で確かめる（`tests/e2e/specs/searchDialog.spec.ts`）
- `prefers-reduced-motion` は、`playwright.e2e.config.ts` が `reduce` を既定にする。`no-preference` の経路は `page.emulateMedia({ reducedMotion: 'no-preference' })` で別に確かめる

## E2E

- Playwright（chromium のみ）を使用する。
- 手動 dev server は HTTPS 必須: `https://localhost:8080`。
- Playwright E2E は `playwright.e2e.config.ts` の `webServer` と `baseURL` に従う（現在は `http://127.0.0.1:3100`）。
- タイムアウトベースのアサーションを避け、deterministic な待機を使用する。
- `waitForTimeout`, `waitUntil: 'networkidle'`, `waitForNavigation`, `{ force: true }`, `page.pause()` は禁止（Biome error）。
- `waitForSelector`, ElementHandle, `$eval` は locator / web-first assertion へ寄せる（Biome warn）。
- Next の `window.__NEXT_HYDRATED` は、Next のテストモードだけで立つ。アプリには、`src/components/App/Header/Layout.tsx` が effect のあとに立てる `data-is-mounted` がある。
- 検索の `/` キーは、listener を effect で登録する。`load` の直後に押すと開かない。操作の前に `header[data-is-mounted="true"]` を待つ（`tests/e2e/helpers/searchDialog.ts`）。
- 操作を `expect(...).toPass()` でやり直さない。hydration の直後の 1 回目が効かない退行を、2 回目で通して隠すため。

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

- 確認の対象は Chrome・Firefox・Safari とする。CI の Playwright は、Chromium のデスクトップだけで動かす（`playwright.e2e.config.ts`・`playwright.vrt.config.ts`）。Firefox と Safari は、手元か実機で確認する。
- Playwright が同梱する Firefox と WebKit は、`browserslist` の下限（Firefox 145・Safari 26.2）より新しい。下限に届かない機能の「無い側」（`@supports` の外）を再現できないため、CI には入れない。
- スクロール、モーション、フォールバックの動作を検証する。

## 参照

- コンポーネント配置: [components.md](./components.md#-ファイル配置パターン-important)
- Linting: [linting.md](./linting.md)
