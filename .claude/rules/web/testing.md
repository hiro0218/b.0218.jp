---
paths:
  - '**/*.test.{ts,tsx}'
  - 'e2e/**/*.ts'
---

# Web テスト規則

## Visual Regression

- スクリーンショットは主要ブレークポイント（320, 768, 1024, 1440）で取得
- 対象: 記事詳細、記事一覧、アーカイブページ
- ライトモードのみ（ダークモード未対応）

## Accessibility

- 自動アクセシビリティチェックを実行
- キーボードナビゲーションを検証
- `prefers-reduced-motion` の動作を確認

## E2E

- Playwright（chromium のみ）を使用
- HTTPS 必須: `https://localhost:8080`
- タイムアウトベースのアサーションを避け、deterministic な待機を使用
- 参照: `test-generation.md`（ユニットテスト方針・Vitest 設定）

## Cross-Browser

- 最低限: Chrome, Firefox, Safari
- スクロール、モーション、フォールバックの動作を検証
