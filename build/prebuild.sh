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

npm run build:similarity &
PID_SIMILARITY=$!

npm run build:search &
PID_SEARCH=$!

npm run build:popular &
PID_POPULAR=$!

npm run build:category &
PID_CATEGORY=$!

PARALLEL_FAILED=0
EXIT_SIMILARITY=0
EXIT_SEARCH=0
EXIT_POPULAR=0
EXIT_CATEGORY=0

wait $PID_SIMILARITY; EXIT_SIMILARITY=$?
wait $PID_SEARCH; EXIT_SEARCH=$?
wait $PID_POPULAR; EXIT_POPULAR=$?
wait $PID_CATEGORY; EXIT_CATEGORY=$?

if [ $EXIT_SIMILARITY -ne 0 ] || [ $EXIT_SEARCH -ne 0 ] || [ $EXIT_POPULAR -ne 0 ] || [ $EXIT_CATEGORY -ne 0 ]; then
  PARALLEL_FAILED=1
fi

if [ $PARALLEL_FAILED -ne 0 ]; then
  echo "✗ One or more parallel steps failed:"
  [ $EXIT_SIMILARITY -ne 0 ] && echo "  - build:similarity (exit code: $EXIT_SIMILARITY)"
  [ $EXIT_SEARCH -ne 0 ] && echo "  - build:search (exit code: $EXIT_SEARCH)"
  [ $EXIT_POPULAR -ne 0 ] && echo "  - build:popular (exit code: $EXIT_POPULAR)"
  [ $EXIT_CATEGORY -ne 0 ] && echo "  - build:category (exit code: $EXIT_CATEGORY)"
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
