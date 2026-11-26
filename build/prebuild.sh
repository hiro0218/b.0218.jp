#!/bin/bash

# Prebuild Script - ビルド前の準備処理を実行
# エラー発生時は即座に終了
set -e

# 色付き出力の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Prebuild Process Started${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Git Submodule の更新
echo -e "${GREEN}[1/4] Updating git submodules...${NC}"
git submodule update --remote
echo "✓ Submodule update completed"
echo ""

# 2. 記事データのビルド
echo -e "${GREEN}[2/4] Building articles...${NC}"
npm run build:article
echo "✓ Article build completed"
echo ""

# 3-5. 類似度計算・検索インデックス生成・人気記事取得・タグカテゴリ分類を並列実行
# 4つのステップは dist/posts/*.json / posts-list.json / tags.json を読み込むのみで相互依存なし
echo -e "${GREEN}[3/4] Running similarity, search, popular, and category in parallel...${NC}"

AFTER_ARTICLE=(similarity search popular category)
PIDS=()
for step in "${AFTER_ARTICLE[@]}"; do
  npm run "build:${step}" &
  PIDS+=($!)
done

# `wait $PID; EXIT=$?` と書かない。set -e の下では、失敗した wait の行でスクリプトが終わり、残りの段を待たず、失敗の一覧も出せないため
FAILED=()
for i in "${!AFTER_ARTICLE[@]}"; do
  wait "${PIDS[$i]}" || FAILED+=("build:${AFTER_ARTICLE[$i]} (exit code: $?)")
done

if [ ${#FAILED[@]} -ne 0 ]; then
  echo "✗ One or more parallel steps failed:"
  for failure in "${FAILED[@]}"; do
    echo "  - ${failure}"
  done
  exit 1
fi

echo "✓ Similarity calculation completed"
echo "✓ Search index generation completed"
echo "✓ Popular posts fetched"
echo "✓ Tag category classification completed"
echo ""

# 6. OGP 画像の生成
if [ "${SKIP_OGP}" = "true" ]; then
  echo -e "${GREEN}[4/4] Skipping OGP image generation (SKIP_OGP=true)${NC}"
  echo "⊘ OGP image generation skipped"
else
  echo -e "${GREEN}[4/4] Generating OGP images...${NC}"
  npm run build:ogp
  echo "✓ OGP image generation completed"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Prebuild Process Completed! 🎉${NC}"
echo -e "${BLUE}========================================${NC}"
