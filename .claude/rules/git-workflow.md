---
paths:
  - '.git/COMMIT_EDITMSG'
  - '.github/PULL_REQUEST_TEMPLATE.md'
  - '.github/pull_request_template.md'
---

# Git ワークフロー文面規則

## コミットメッセージ

必須フォーマット:

```txt
<type>(<scope>): <subject>
```

- `type`: `feat` / `fix` / `update` / `upgrade` / `bump` / `docs` / `style` / `refactor` / `test` / `chore`
- `scope`: 英語・小文字
- `subject`: 英語・命令形・50文字以内、先頭は小文字、末尾ピリオドなし

## Pull Request

- タイトルは日本語、50文字以内、動詞で開始する（例: 追加 / 修正 / 更新 / 削除）。
- 説明には次を含める。
  - **概要**: 目的と背景を1-2文
  - **変更内容**: 箇条書き
  - **テスト**: 実行した内容（未実施なら未実施と明記）
  - **影響範囲**: 破壊的変更がある場合のみ
