#!/bin/bash

# VRT Pull Baseline - master の最新成功 run から vrt-baseline artifact を取得
set -e

id=$(gh run list \
  --workflow=vrt.yml \
  --branch=master \
  --status=success \
  --limit=1 \
  --json databaseId \
  --jq '.[0].databaseId // empty')

if [ -z "${id}" ]; then
  echo "master に成功済みの VRT run が見つかりません。" >&2
  echo "初回は 'npm run vrt:update' でローカルベースラインを作成するか、" >&2
  echo "master への push で baseline artifact が生成されるのを待ってください。" >&2
  exit 1
fi

gh run download "${id}" -n vrt-baseline -D tests/vrt/__snapshots__
