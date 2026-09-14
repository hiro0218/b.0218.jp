#!/usr/bin/env bash
# masterへの本番デプロイ成功のたびに、新規/更新記事のURLをBridgy Fedへwebmention送信する。
#
# 「状態ファイルを持たない」設計だが、正しさの根拠はGitHub自身のDeployments API履歴という
# 外部状態に完全に依存している(直近per_page件のみ参照。それより前にしか成功デプロイが
# 無い場合は直前成功デプロイを見失う)。
# 「Bridgy Fedは同一source URLへの再送を更新として扱う」という未確認の前提にも依存する設計で、
# ここが崩れた場合は送信済み状態を記録するファイル方式に切り替える。
# dist/はgit管理外でこのワークフロー内ではprebuildを実行できないため、noindex判定は
# dist/posts-list.jsonではなく公開済みページを直接fetchして行う(sitemap.xml等の集合データだけでは
# 「noindexだから無い」のか「デプロイが壊れていて無い」のかを区別できないため、個別fetchが必要)。
set -euo pipefail

REPO="${GITHUB_REPOSITORY}"
ENDPOINT="https://fed.brid.gy/webmention"
TARGET="https://fed.brid.gy/" # src/constants.ts の BRIDGY_FED_URL と同一値。変更時は両方更新すること
MAX_TARGETS="${MAX_TARGETS:-10}"
DRY_RUN="${DRY_RUN:-false}"
DEPLOYMENTS_PAGE_SIZE=100 # GitHub REST APIのper_page上限。これを超えて成功デプロイが無い期間が
                          # 続くと直前の成功デプロイを見失う(既知の限界、下記参照)

log() { echo "$@" >&2; }

# 与えられたdeployment一覧(JSON配列、順序はそのまま先頭から走査)から、
# statusesにstate==successを含む最初の要素を1件返す。見つからなければ失敗する。
find_first_successful() {
  local list="$1" id
  while read -r id; do
    [[ -z "$id" ]] && continue
    if gh api "repos/${REPO}/deployments/${id}/statuses" --jq 'any(.[]; .state=="success")' | grep -q true; then
      echo "$list" | jq -c --arg id "$id" '.[] | select((.id|tostring)==$id)'
      return 0
    fi
  done < <(echo "$list" | jq -r '.[].id')
  return 1
}

all_prod=$(gh api "repos/${REPO}/deployments?environment=Production&per_page=${DEPLOYMENTS_PAGE_SIZE}" --jq 'sort_by(.created_at) | reverse')

# 1) アンカーdeploymentの決定
#    deployment_status起点ならイベントpayloadに既にsha/created_atが載っているためAPI呼び出し不要。
#    ANCHOR_DEPLOYMENT_IDのみ渡された場合はAPIで解決し、workflow_dispatchでは直近の成功デプロイを探す。
if [[ -n "${ANCHOR_SHA:-}" && -n "${ANCHOR_CREATED_AT:-}" ]]; then
  CUR_SHA="$ANCHOR_SHA"
  ANCHOR_AT="$ANCHOR_CREATED_AT"
  log "anchor deployment: id=${ANCHOR_DEPLOYMENT_ID:-N/A} sha=${CUR_SHA} created_at=${ANCHOR_AT} (event contextより)"
elif [[ -n "${ANCHOR_DEPLOYMENT_ID:-}" ]]; then
  anchor=$(gh api "repos/${REPO}/deployments/${ANCHOR_DEPLOYMENT_ID}")
  CUR_SHA=$(echo "$anchor" | jq -r '.sha')
  ANCHOR_AT=$(echo "$anchor" | jq -r '.created_at')
  log "anchor deployment: id=${ANCHOR_DEPLOYMENT_ID} sha=${CUR_SHA} created_at=${ANCHOR_AT} (APIより)"
else
  anchor=$(find_first_successful "$all_prod") || { log "::error::成功したProductionデプロイが見つかりません"; exit 1; }
  CUR_SHA=$(echo "$anchor" | jq -r '.sha')
  ANCHOR_AT=$(echo "$anchor" | jq -r '.created_at')
  log "anchor deployment: id=$(echo "$anchor" | jq -r '.id') sha=${CUR_SHA} created_at=${ANCHOR_AT} (workflow_dispatchのフォールバック)"
fi

# 2) 直前の成功Productionデプロイを、アンカーより古いものの中から探す
#    「最新の成功デプロイ」ではなくアンカー基準で探すことで、re-runしても窓が不変になり、
#    部分失敗の再試行が決定論的になる
older=$(echo "$all_prod" | jq -c --arg at "$ANCHOR_AT" '[.[] | select(.created_at < $at)]')
prev=$(find_first_successful "$older") || {
  log "::error::直前の成功Productionデプロイが見つかりません(初回実行、またはProductionデプロイが直近${DEPLOYMENTS_PAGE_SIZE}件以内に成功例が無い可能性があります)"
  exit 1
}
PREV_SHA=$(echo "$prev" | jq -r '.sha')
log "previous successful deployment sha: ${PREV_SHA}"

# 3) _article submoduleポインタの解決(git clone不要、Contents APIで完結させる)
PREV_SUB=$(gh api "repos/${REPO}/contents/_article?ref=${PREV_SHA}" --jq '.sha')
cur_contents=$(gh api "repos/${REPO}/contents/_article?ref=${CUR_SHA}")
CUR_SUB=$(echo "$cur_contents" | jq -r '.sha')

if [[ "$PREV_SUB" == "$CUR_SUB" ]]; then
  log "記事の変更なし(_article submodule ポインタ不変): ${PREV_SUB}"
  exit 0
fi

ARTICLE_REPO=$(echo "$cur_contents" | jq -r '.submodule_git_url' | sed -E 's#^https://github\.com/##; s#\.git$##')
log "article repo: ${ARTICLE_REPO}, ${PREV_SUB} -> ${CUR_SUB}"

# 4) 変更記事の抽出(_posts/*.md のうち削除以外。rename時は新filename側を採用する)
compare=$(gh api "repos/${ARTICLE_REPO}/compare/${PREV_SUB}...${CUR_SUB}")
file_count=$(echo "$compare" | jq '.files | length')
if [[ "$file_count" -ge 300 ]]; then
  # compare APIはfilesを300件で切り詰める。MAX_TARGETSガード(送りすぎ防止)と対称に、
  # 送り漏れの可能性がある場合もfail-closedにする。状態を持たない設計では次回の窓は
  # CUR_SHA以降から始まるため、ここで見逃すとその記事は永久に取りこぼされる。
  log "::error::compare APIのfilesが300件に達しており、差分の取りこぼしが疑われます(${PREV_SUB}...${CUR_SUB})。手動確認してください"
  exit 1
fi

mapfile -t slugs < <(echo "$compare" | jq -r '
  .files[]
  | select(.status != "removed")
  | select(.filename | test("^_posts/.+\\.md$"))
  | .filename
  | sub("^_posts/"; "")
  | sub("\\.md$"; "")
')

if [[ ${#slugs[@]} -eq 0 ]]; then
  log "対象記事なし"
  exit 0
fi

log "candidate slugs: ${slugs[*]}"

# 5) 暴走ガード: 窓の計算が壊れて大量の記事が一斉配信されるのを防ぐ(不可逆な操作のため必須)
if [[ ${#slugs[@]} -gt $MAX_TARGETS ]]; then
  log "::error::対象記事数(${#slugs[@]})がMAX_TARGETS(${MAX_TARGETS})を超えています。窓の計算が壊れている可能性があるため送信を中止します: ${slugs[*]}"
  exit 1
fi

# 6) 公開状態の確認とwebmention送信
#    dist/posts-list.jsonのnoindexフラグはこのワークフロー内では信頼できないため、
#    実際に公開されているページのrobotsメタタグを一次ソースにする
sent=()
skipped=()
failed=()

for slug in "${slugs[@]}"; do
  url="https://b.0218.jp/${slug}.html"

  http_code=$(curl -sS --max-time 20 --retry 2 --retry-delay 5 --retry-all-errors \
    -o /tmp/notify-bridgy-fed-page.html -w '%{http_code}' "$url" || echo "000")

  if [[ "$http_code" != "200" ]]; then
    log "::error::${slug}: ページ取得失敗 (status=${http_code}, url=${url})"
    failed+=("$slug")
    continue
  fi

  if grep -oE '<meta[^>]*>' /tmp/notify-bridgy-fed-page.html | grep 'name="robots"' | grep -q noindex; then
    log "${slug}: noindexのためスキップ"
    skipped+=("$slug")
    continue
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    log "[dry-run] ${slug}: 送信予定 (${url})"
    continue
  fi

  post_code=$(curl -sS -X POST "$ENDPOINT" \
    --data-urlencode "source=${url}" \
    --data-urlencode "target=${TARGET}" \
    --retry 2 --retry-connrefused --max-time 60 \
    -o /tmp/notify-bridgy-fed-resp.txt -w '%{http_code}' || echo "000")

  if [[ "$post_code" =~ ^2[0-9][0-9]$ ]]; then
    log "${slug}: 送信成功 (status=${post_code})"
    sent+=("$slug")
  else
    log "::error::${slug}: webmention送信失敗 (status=${post_code}, url=${url})"
    cat /tmp/notify-bridgy-fed-resp.txt >&2
    failed+=("$slug")
  fi
done

# 7) 集計
log "::notice::window ${PREV_SHA}..${CUR_SHA} / sent=${sent[*]:-なし} / skipped=${skipped[*]:-なし}"

if [[ ${#failed[@]} -gt 0 ]]; then
  log "::error::送信失敗: ${failed[*]}"
  exit 1
fi
