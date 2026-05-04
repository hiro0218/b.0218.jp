---
paths:
  - 'src/components/UI/**/*.{ts,tsx}'
  - 'src/components/App/**/*.{ts,tsx}'
  - 'panda.config.mts'
---

# MCP サーバー使用ガイドライン

## panda MCP

- トークン追加・変更前に `get_tokens` / `get_semantic_tokens` で既存トークンとの重複を確認
- レシピ確認は `get_recipes`、テキストスタイルは `get_text_styles`

## React Aria MCP

- インタラクティブコンポーネント（ボタン、ダイアログ、メニュー等）実装前に参照
- WAI-ARIA パターンの正確な props と振る舞いを確認
- 独自実装より React Aria のフックを優先

## next-devtools MCP

- Next.js API の使い方に迷ったら `nextjs_docs` で最新ドキュメントを参照
- ビルドエラーの調査にも活用
