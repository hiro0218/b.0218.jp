# Storybook VRT

Playwright で Storybook の各ストーリーをスクリーンショット比較する Visual Regression Testing（VRT）の運用手順。

## 前提

- Playwright の `@playwright/test` は `package.json` の `devDependencies` に含まれる
- ベースラインは GitHub Actions の `vrt-baseline` artifact（master push ごとに更新）が正
- ローカルのベースラインは参考扱い。CI（Ubuntu + 固定 Chromium）の結果を優先する

## ローカル実行

### 1. ストーリーをビルドする

```bash
npm run vrt:build
```

`storybook build` を実行し、`storybook-static/` に `index.json` と各ストーリーの `iframe.html` を生成する。

### 2. ベースラインを取得する

```bash
gh auth status
npm run vrt:pull-baseline
```

master の最新 artifact を `tests/vrt/__snapshots__/` に展開する。未実行時は Artifact が存在しない可能性があるため、その場合は初回撮影として `npm run vrt:update` を実行する。

### 3. 差分チェック

```bash
npm run vrt
```

差分があると `test-results/` にアクチュアル画像と diff 画像が出力される。HTML レポートは `playwright-report/index.html`。

### 4. 意図的な UI 変更時のベースライン更新

```bash
npm run vrt:update
```

ローカルの `__snapshots__/` を上書きする。CI のベースラインは master merge 後の push で自動更新されるため、ローカル更新分を PR に含める必要はない（`__snapshots__/` は `.gitignore` 対象）。

### 5. UI モードでデバッグ

```bash
npm run vrt:ui
```

Playwright UI でストーリーごとの撮影・比較を対話的に確認できる。

## スコープ（Phase 1）

`tests/vrt/helpers/load-stories.ts` の `INCLUDE_PREFIXES` で対象を絞り込む。

- 現在: `components-ui-alert--` で始まるストーリーのみ
- 除外タグ: `!manifest`, `!vrt` のいずれかを持つストーリーは対象外

Phase 2 以降で対象を広げる場合は、該当定数を空配列 `[]` に変更すると全ストーリーが対象になる。

## CI 挙動

`.github/workflows/vrt.yml` で実行する。

| イベント                   | 挙動                                                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `push` to `master`         | ストーリーを撮影し、成功時に `vrt-baseline` artifact を上書き（retention 90 日）                                                    |
| `pull_request` to `master` | master の `vrt-baseline` artifact を取得し比較。差分・HTML レポートを `vrt-diff-<PR番号>` artifact に upload、sticky comment で通知 |
| `workflow_dispatch`        | 手動でベースラインを更新する際に利用                                                                                                |

初回は master に `vrt-baseline` artifact が存在しないため PR 側は warning で続行する。master に merge 後の push で初ベースラインが生成される。

## 既存テストとの関係

- `npm run test:storybook`（Vitest + `composeStories`）はインタラクションテストを担当し、本 VRT とは独立に実行される
- 本 VRT は `storybook-static/` を静的サーブする方式のため、Storybook の dev server（port 6006）を並行起動する必要はない

## トラブルシューティング

- フォント差で失敗する: `maxDiffPixelRatio: 0.01` で吸収しているが、OS 依存のレンダリング差でローカルと CI が一致しない場合は CI を正とする
- `storybook-static/index.json` が見つからない: `npm run vrt:build` を先に実行する
- port 6006 が塞がっている: 既に `storybook dev` が起動していれば `webServer.reuseExistingServer` により再利用される
