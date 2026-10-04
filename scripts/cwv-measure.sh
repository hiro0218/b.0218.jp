#!/usr/bin/env bash
# 代表ページの Core Web Vitals(LCP / CLS / TBT)を Lighthouse で測り、LHR(JSON)を出力ディレクトリへ置く。
# .github/workflows/cwv.yml から呼ぶ。事前に next build が済んでいること。
#
# 使い方: bash scripts/cwv-measure.sh <lighthouse の実行ファイル> <出力ディレクトリ>
#
# 測る対象は next dev ではなく、ビルド済みの成果物を配信する next start にする。
# dev は未最適化の JS を配るため、同じページでも TBT が 2430ms(next start は 18ms)になり、PR 間の比較に使えない。
set -euo pipefail

lighthouse_bin="${1:?Lighthouse の実行ファイルを指定してください}"
out_dir="${2:?出力ディレクトリを指定してください}"

port=3101
base="http://127.0.0.1:${port}"
runs=3 # 中央値を取るため奇数にする。1 回だと外れ値がそのまま表に出る

# src/app のルートテンプレート 9 種類から 1 件ずつ選び、記事だけは HTML サイズが最大のものも加える。
# prerender 済みの全ページは測りきれないため、型ごとの代表で見る。
# .next/prerender-manifest.json から自動で選ぶ案は、Next.js の内部ファイルに依存するため採らない。
# 記事とタグは _article(submodule)の内容に依存し、prebuild が最新に更新するため、内容側の改名や削除でも壊れる。
paths=(
  /                      # トップ
  /20121112133354.html   # /[slug] 記事(HTML サイズが中央値)
  /202112010005.html     # /[slug] 記事(HTML サイズが最大)
  /archive               # 最大のページ(HTML が 1.6MB)
  /popular
  /tags
  /tags/CSS              # /tags/[slug](HTML サイズが最大)
  /tags/CSS/2            # /tags/[slug]/[page](HTML サイズが最大)
  /about
  /privacy
)

# 外部の広告・計測スクリプトの通信を止める。通したままだと LCP が数秒単位で揺れる
# (/archive は 8 回中 4 回が 8.5 秒、残りが 2.4 秒に割れ、3 回の中央値でも吸収できない)。
# 止めると最大 3.5 秒に収まった(2026-10-05 の手元測定。下の 11 パターンで確認した構成)。
# 実際に通信が起きて止まるのは次の 4 ホストだけで、残りは入口が動いた場合の下流の通信先である。
#   googletagmanager.com               src/app/layout.tsx の GoogleAnalytics
#   googlesyndication.com              src/components/Functional/GoogleAdSense.tsx
#   fundingchoicesmessages.google.com  src/components/Functional/GoogleAdSense.tsx
#   news.google.com                    src/components/Functional/GooglePublisher.tsx
# 外部の <Script> を足したら、ここにも足す。
blocked_patterns=(
  '*googlesyndication.com*'
  '*doubleclick.net*'
  '*adtrafficquality.google*'
  '*fundingchoicesmessages.google.com*'
  '*googletagmanager.com*'
  '*google-analytics.com*'
  '*news.google.com*'
  '*csp.withgoogle.com*'
  '*play.google.com*'
  '*www.google.com*'
  '*gstatic.com*'
)
blocked_flags=()
for pattern in "${blocked_patterns[@]}"; do
  blocked_flags+=("--blocked-url-patterns=${pattern}")
done

# 配信サーバーを裏で起動し、応答するまで待つ。Lighthouse のログ置き場も含め、失敗したときも終了時に必ず片付ける。
lh_log="$(mktemp)"
./node_modules/.bin/next start -p "$port" -H 127.0.0.1 &
server_pid=$!
trap 'rm -f "$lh_log"; kill "$server_pid"' EXIT
curl --silent --show-error --fail --retry 30 --retry-delay 1 --retry-connrefused --output /dev/null "${base}/"

# ページごとに runs 回ずつ測る。ファイル名の連番は出力を衝突させないためだけに使う
# (表の並びは集計側が LHR の fetchTime で決める)。
#
# Lighthouse は進捗(LH:status)を 1 回あたり約 150 行 stderr に出し、30 回で 4,400 行を超える。
# 成功時は捨て、失敗したときだけ全文を出す。--quiet は失敗の原因まで消すため使わない。
# 失敗時のエラー文は URL を含まないため、どのページかはこちらで出す。
# --disable-full-page-screenshot は、指標に使わない全ページのスクリーンショット
# (1 回あたり約 1.2 秒、LHR の約 15%)を撮らないために付ける。トレースの停止後に撮られるため、指標には影響しない。
# --no-sandbox は、CI の Linux ではサンドボックスが使えず Chrome の起動に失敗することがあるため付ける。
# 開くのは自前のページだけで、この job は書き込み権限も秘密情報も持たないため問題ない
# (記事の一部は CodePen の埋め込みと webmention.io の取得を含み、これらは止めていない)。
mkdir -p "$out_dir"
index=0
for path in "${paths[@]}"; do
  index=$((index + 1))
  for run in $(seq 1 "$runs"); do
    "$lighthouse_bin" "${base}${path}" \
      --only-categories=performance \
      --output=json \
      --output-path="${out_dir}/$(printf '%02d' "$index")-${run}.json" \
      --chrome-flags='--headless=new --no-sandbox --disable-gpu' \
      --disable-full-page-screenshot \
      "${blocked_flags[@]}" 2>"$lh_log" || {
      echo "::error::${path} の測定に失敗した(${run}/${runs})。404 などでページが無い場合は scripts/cwv-measure.sh の paths を見直す"
      cat "$lh_log" >&2
      exit 1
    }
    echo "measured ${path} (${run}/${runs})"
  done
done
