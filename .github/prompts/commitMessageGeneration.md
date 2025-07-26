# コミットメッセージ生成の指示

コミットメッセージを生成する際、必ず以下の形式と規則に従ってください。コミットメッセージの品質と一貫性は、プロジェクトの履歴と管理において非常に重要です。

## 必須フォーマット

`<type>(<scope>): <subject>`

- **type**: 必須。以下のいずれか1つを選択
- **scope**: 必須。変更対象の機能・モジュール名（英語、小文字）
- **subject**: 必須。変更内容の要約（英語、命令形、50文字以内）

## type選択ルール

変更内容に応じて以下から1つを選択してください：

- `feat`: 新機能を追加した場合
  - サーバーやクライアントに新しい機能を実装したとき
  - ユーザーに新しい体験を提供する機能を追加したとき
  
- `fix`: バグを修正した場合  
  - ユーザーが報告したバグを修正したとき
  - テストで発見された問題を解決したとき

- `update`: 既存機能を改良・更新した場合
  - 既存機能に新しい振る舞いや改善を加えたとき
  - 機能は同じだが実装を改善したとき

- `upgrade`: 依存関係やライブラリをアップデートした場合
  - npmパッケージを更新したとき
  - 依存関係を最新版に変更したとき

- `bump`: パッケージバージョンを上げた場合
  - package.jsonのversionを更新したとき
  - リリース準備でバージョン番号を上げたとき

- `docs`: ドキュメント（README、コメントなど）を変更した場合
  - ドキュメント、コメントの追加や更新
  - ユーザーガイド、APIドキュメントの変更

- `style`: コードのフォーマット、スタイル変更（機能に影響しない）
  - 空白、インデントの修正
  - フォーマッターによる修正

- `refactor`: 機能を変えずにコードを整理した場合
  - コードの可読性や保守性を高める変更
  - データ構造や命名を改善する変更

- `test`: テストコードを追加・修正した場合
  - テストの追加や更新
  - テストカバレッジの改善

- `chore`: ビルド設定、CI設定など開発環境の変更
  - ビルドプロセスの更新
  - CI/CDの設定変更
  - 開発環境ツールの追加や更新

## 作成時の注意事項

1. **言語**: コミットメッセージは必ず英語で記述
2. **文体**: subjectは命令形（動詞の原形）で開始
3. **文字数**: subjectは50文字以内
4. **大文字**: subjectの最初は小文字
5. **句読点**: subjectの末尾にピリオド不要

## 生成例

```
# 良い例
feat(similarity): add TF-IDF based article recommendation
fix(header): resolve navigation menu overflow on mobile
update(ogp): improve image generation performance
refactor(auth): extract validation logic to separate module
docs(readme): add installation requirements section

# 避けるべき例
fixed bug               # 型がない
update something        # 具体性がない
feat: new features      # scopeがない
refactor(component).    # ピリオドが付いている
```

## コミット時のチェックリスト

- コミットする変更は関連性の高い単一の修正か
- 適切なtypeとscopeが選択されているか
- subjectは明確で具体的かつ50文字以内か
- 英語で書かれ、動詞の原形で始まる命令形になっているか
