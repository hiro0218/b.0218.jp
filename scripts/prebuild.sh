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
echo -e "${GREEN}[1/6] Updating git submodules...${NC}"
git submodule update --remote
echo "✓ Submodule update completed"
echo ""

# 2. 記事データのビルド
echo -e "${GREEN}[2/6] Building articles...${NC}"
npm run build:article
echo "✓ Article build completed"
echo ""

# 3. 類似度の計算
echo -e "${GREEN}[3/6] Calculating similarity...${NC}"
npm run build:similarity
echo "✓ Similarity calculation completed"
echo ""

# 4. 検索インデックスの生成
echo -e "${GREEN}[4/6] Generating search index...${NC}"
npm run build:search
echo "✓ Search index generation completed"
echo ""

# 5. 人気記事の取得
echo -e "${GREEN}[5/6] Fetching popular posts...${NC}"
npm run build:popular
echo "✓ Popular posts fetched"
echo ""

# 6. OGP 画像の生成
if [ "${SKIP_OGP}" = "true" ]; then
  echo -e "${GREEN}[6/6] Skipping OGP image generation (SKIP_OGP=true)${NC}"
  echo "⊘ OGP image generation skipped"
else
  echo -e "${GREEN}[6/6] Generating OGP images...${NC}"
  npm run build:ogp
  echo "✓ OGP image generation completed"
fi
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Prebuild Process Completed! 🎉${NC}"
echo -e "${BLUE}========================================${NC}"
