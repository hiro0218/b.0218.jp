---
version: alpha
name: 零弐壱蜂（b.0218.jp）
description: 個人の技術ブログ「零弐壱蜂」のデザインシステム。無彩色・影と枠線なし・余白で構造を示す、読むことに集中させるミニマルなデザイン。
colors:
  primary: '#131313'
  secondary: '#505050'
  neutral: '#f8f8f8'
  surface: '#ffffff'
  surface-footer: '#f3f3f3'
  band-1: '#e2e2e2'
  band-2: '#cdcdcd'
  fill: '#0000000d'
  fill-faint: '#00000008'
  fill-strong: '#00000017'
  fill-on-neutral: '#ebebeb'
  state-hover: '#0000000d'
  state-current: '#0000001f'
  state-current-on-neutral: '#dadada'
  state-active: '#00000026'
  overlay: '#00000070'
  focus-ring: '#3b63fb'
  brand-google: '#4285f4'
  code-keyword: '#a626a4'
  code-string: '#50a14f'
  code-comment: '#a0a1a7'
  code-tag: '#e45649'
  code-attribute: '#986801'
  code-function: '#4078f2'
typography:
  display:
    fontFamily: Noto Sans JP
    fontSize: 40px
    fontWeight: 900
    lineHeight: 1.5
    letterSpacing: 0em
  display-mobile:
    fontFamily: Noto Sans JP
    fontSize: 36px
    fontWeight: 900
    lineHeight: 1.5
    letterSpacing: 0em
  h2:
    fontFamily: Noto Sans JP
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h2-mobile:
    fontFamily: Noto Sans JP
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h3:
    fontFamily: Noto Sans JP
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h3-mobile:
    fontFamily: Noto Sans JP
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h4:
    fontFamily: Noto Sans JP
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h4-mobile:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h5:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h5-mobile:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  h6:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0.04em
  prose:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 2
    letterSpacing: 0.04em
  prose-mobile:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0.04em
  title:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0em
  rank:
    fontFamily: SFMono-Regular
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: 0em
  lead:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0em
  body:
    fontFamily: Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.875
    letterSpacing: 0em
  small:
    fontFamily: Noto Sans JP
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  small-mono:
    fontFamily: SFMono-Regular
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  caption:
    fontFamily: Noto Sans JP
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  caption-mono:
    fontFamily: SFMono-Regular
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  code:
    fontFamily: SFMono-Regular
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0em
  logo:
    fontFamily: Noto Sans JP
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  full: 100%
spacing:
  grid-baseline: 4px
  tight: 4px
  inline: 8px
  stack: 16px
  group: 24px
  row: 32px
  block: 40px
  subsection: 48px
  title: 48px
  page: 48px
  page-wide: 64px
  section: 64px
  section-wide: 96px
  touch-target: 44px
  touch-target-inline: 32px
  columns: 4
  columns-wide: 12
  container-content: 768px
  container-article: 800px
  container-frame: 1280px
  container-mokuji: 192px
  container-mokuji-max: 320px
components:
  page:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    typography: '{typography.body}'
  page-band-1:
    backgroundColor: '{colors.band-1}'
  page-band-2:
    backgroundColor: '{colors.band-2}'
  footer:
    backgroundColor: '{colors.surface-footer}'
    textColor: '{colors.primary}'
  text-secondary:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.secondary}'
  button-ghost-hover:
    backgroundColor: '{colors.fill-strong}'
  button-ghost-active:
    backgroundColor: '{colors.state-current}'
  nav-item-current:
    backgroundColor: '{colors.state-current-on-neutral}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
  nav-item-current-layer:
    backgroundColor: '{colors.state-current}'
  tag:
    backgroundColor: '{colors.fill-strong}'
    textColor: '{colors.secondary}'
    typography: '{typography.small}'
    rounded: '{rounded.md}'
    height: 24px
  tag-with-count:
    backgroundColor: '{colors.fill-strong}'
    textColor: '{colors.secondary}'
    typography: '{typography.small}'
    rounded: '{rounded.md}'
    height: 36px
    padding: 4px 16px
  tag-count:
    textColor: '{colors.secondary}'
    typography: '{typography.caption-mono}'
  list-row:
    rounded: '{rounded.md}'
    padding: 24px
  list-row-hover:
    backgroundColor: '{colors.state-hover}'
  year-tile:
    backgroundColor: '{colors.fill-faint}'
    rounded: '{rounded.sm}'
    height: 44px
  chart-bar:
    backgroundColor: '{colors.fill-strong}'
  card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    rounded: '{rounded.sm}'
  alert:
    typography: '{typography.small}'
    rounded: '{rounded.md}'
    padding: 16px
  code-block:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.primary}'
    typography: '{typography.code}'
    rounded: '{rounded.md}'
  code-keyword:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-keyword}'
  code-string:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-string}'
  code-comment:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-comment}'
  code-tag:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-tag}'
  code-attribute:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-attribute}'
  code-function:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.code-function}'
  kbd:
    backgroundColor: '{colors.fill}'
    typography: '{typography.caption-mono}'
    rounded: '{rounded.sm}'
    height: 24px
  dialog-overlay:
    backgroundColor: '{colors.overlay}'
  search-dialog:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    rounded: '{rounded.md}'
  search-dialog-close:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.primary}'
    rounded: '{rounded.full}'
    size: 44px
  page-scroll:
    backgroundColor: '{colors.fill-strong}'
    textColor: '{colors.primary}'
    rounded: '{rounded.full}'
    size: 44px
  focus-indicator:
    textColor: '{colors.focus-ring}'
  google-mark:
    textColor: '{colors.brand-google}'
---

# 零弐壱蜂 DESIGN.md

b.0218.jpのデザインシステム。値（色・余白・書体）は、実装の Panda のトークンが正で、この文書はその写しである。front matter が値を、本文が使い方と理由を書く。値が食い違ったら、この文書を実装に合わせる。
値の多くはサイトの Panda のトークン（`colors.gray.900` など）と同じ値で、対応は各節に書く。

## Overview

技術記事を読むためのサイト。見た目で主張せず、文字と余白だけで構造が分かる状態を目指す。

- **無彩色**：基本は無彩色にする。色相は、意味を伝える部品に限る（フォーカス枠の青、注意枠の種類色、コードの色分け）。操作している位置は、ページの中で一つだけ色で示す。
- **影と枠線を使わない**：面の区別は塗り（`fill`）と余白で行う。
- **レイアウトに説明させる**：補助のラベルや説明文を足す前に、並び方・余白・見出しで伝えられないかを考える。ただし、画面から読み取れない操作（キー操作、アイコンだけでは用途が分からないボタン）には言葉を残す。
- **静けさ**：太さは 400 / 700 の 2 段。900 は Display（ページ見出し・記事タイトル・Home のプロフィール名）だけ。700 は、その語が「名前」として働くときと、強調に限る。見出し（h2〜h6）・カードとリンクカードの題名（日付と同じ大きさで、太さでしか区別できない）・表の見出し（th）・注意枠の見出し・開閉の見出し（summary、モバイルの目次）・本文の強調（strong）・検索の一致。本文、説明、日付、タグ、ナビ（現在地を含む）やボタンの文字、目次の項目は 400 にする。大きさで区別できる一覧の行のタイトルも 400 にする（太字にすると、一覧のページで文字の大半が太字になる）。

この文書の規則（無彩色、影と枠線を使わない、太さの 2 段）に反する実装の未移行の箇所は、この文書でなく実装を直す。一覧と、新規・変更コードでの扱いは、[principles.md](docs/design-system/principles.md) の「線と面」と、[tokens.md](docs/design-system/tokens.md) の「色の運用」にある。

## Colors

文字色は 2 段、面は灰の段、状態は半透明の黒の層で作る。ここまでは無彩色で、色相を使う例外は、この節の終わりに書く。

- **Primary（#131313 / サイトの gray-900）**：主の文字、見出し。
- **Secondary（#505050 / gray-700）**：副の文字。記事本文、日付、件数、補足。サイトの gray-600 は、hover の面の上とページ上部の帯の上で 4.5:1 に届かないため、副は gray-700 にそろえた（面ごとの比は [tokens.md](docs/design-system/tokens.md) の表）。
- **Neutral（#f8f8f8 / gray-50、サイトの body-background）**：ページの地。検索ダイアログの面も同じ。
- **Surface（#ffffff / gray-25）**：白い面。コードブロック、記事カード、目次（モバイル）に使う。404 ページの主ボタンの文字にも使う。
- **Surface footer（#f3f3f3 / gray-75）**：フッターの面。
- **Band 1・Band 2（#e2e2e2、#cdcdcd）**：ページ上部の斜めの帯。実装は黒 9%（`gray-a-100`）の三角形 2 枚で、地（gray-50）の上では、1 枚の所が #e2e2e2、2 枚が重なる所が #cdcdcd になる。この 2 色は層を地に重ねた結果の参考値（コントラストの計算用）で、実装では半透明の層を使う。
- **Fill（黒 5% / gray-a-75）**：静的な灰の面。検索ダイアログの下の帯、キー表示。半透明なので帯の上でも下地を選ばない。
- **Fill strong（黒 9% / gray-a-100）**：タグ、「ページトップへ」、年別チャートの棒。hover は黒 12%（`gray-a-200`）、active は黒 15%（`gray-a-300`）。アイコンだけのボタンは、hover の円が黒 9%、active が黒 12%。
- **Fill faint（黒 3% / gray-a-50）**：年別チャートのマス。
- **状態の層**：hover は黒 5%（`state-hover`）、active は黒 15%（`state-active`）、current は黒 12%（`state-current`）。層は `background-image` で重ね、部品の `background-color` は面に使う。
- **`*-on-neutral`（#ebebeb、#dadada）**：fill と current の層を地（gray-50）に重ねた結果の色。コントラストを計算するツール用の参考値で、実装では半透明の `fill`・`state-current` を使う。地の上での主の文字との比は 15.6:1 と 13.3:1、副の文字とは 6.8:1 と 5.8:1。
- **Overlay（黒 44% / gray-a-500）**：ダイアログの後ろの幕。
- **Focus ring（#3b63fb / accent-900）**：フォーカス枠。2px、外側に 2px あける（スクロールする箱の中で、外側の枠が箱に切られる所だけは内側に描く）。地の上で 4.53:1、白の上で 4.81:1。
- **外部規約の色**：コードの色分けは One Light（Shiki の `one-light`。`build/article/shikiConfig.ts`）。白地で 4.5:1 に届かない色がある（string 3.21:1、comment 2.58:1、function 4.05:1、tag 3.67:1）。Google の G は Google のブランド色で、Share の Google ボタン（外部のスクリプトが描画する）の中にある。外部が描画するため、色と `aria-hidden` は、このリポジトリのコードで確かめていない。ロゴタイプはコントラストの要件の対象外（WCAG 1.4.3）。

注意枠（Note・Tip・Important・Warning・Caution）は、種類ごとに色相を使う。面・文字・枠は、note が blue、tip が green、important が purple、warning が yellow、caution が red のパレットから、面に 100、文字に 900（warning は 1000）、枠に 400 の段を使う。種類はアイコンの形と見出しの語でも示し、Warning・Caution は `role="alert"`（ほかは `role="note"`）で支援技術にも伝える。枠は inset の box-shadow（1px）で描いていて、影と枠線を使わない規則に対しては未移行である。

## Typography

書体はサイトと同じ。sans は Noto Sans JP、mono は SFMono-Regular ほか。mono は桁や文字幅をそろえて読むものだけに使う：コード、日付、件数・順位、年、ナビの英字ラベル、注記番号、©。

- **Display（36→40px / 900 / 行間 1.5）**：ページ見出し、記事タイトル、プロフィール名。1 ページに 1 か所。Panda の `fontSizes.display` で、サイトの h1（30→34px）より 6px 大きい。h2 との比を 1.3 以上にするため。行間は h2〜h6 と同じ 1.5（2〜3 行に折り返す記事タイトルで行が詰まらないように）。
- **h2〜h5（デスクトップ 30 / 26 / 22 / 18px、モバイル 26 / 22 / 18 / 16px / 700 / 行間 1.5 / 字間 0.04em）**：サイトの `font-sizes-h2`〜`h5`。画面幅 430px → 992px で連続的に大きくなる（clamp）。front matter の `*-mobile` は 430px 以下、無印は 992px 以上の値。
- **h6**：記事の中では h5 と同じ大きさで副の文字色にする（本文より小さくしない）。16px の `h6` はカードのタイトルだけ。
- **Prose（デスクトップ 18px・行間 2、モバイル 16px・行間 1.75 / 字間 0.04em）**：記事本文と About の本文。640px 未満は 1 行が 21 字ほどと短く、行間 2 では段落がばらけるため一段詰める。
- **Title（18px / 400 / 行間 1.75）**：一覧の記事タイトル。行の高さは 32px で、日付・本文の 1 行とそろえる。行間が 1.5 だと、2 行に折り返したときに本文より詰まって見える。太字にせず、日付（14px）・タグより大きいことで行の主役にする。先頭の［分類］もタイトルと同じ太さ・色にする。
- **Rank（18px / 700 / mono）**：定番記事の順位。ランキングは順位が並びの基準なので主の強さにする。時系列の一覧では日付は補足（`small-mono`・副の文字色）にする。
- **Lead（18px / 400 / 行間 1.75）**：プロフィールの説明。
- **Body（16px / 行間 1.875）**：UI の本文。
- **Small（14px）**：日付、ナビ、ボタン、目次、脚注、タグの文字。目次は列の幅によらず 14px（行の高さ 24px、項目の間隔 32px）で、ナビ・タグ・日付と同じ大きさにそろえる。列が広がったときだけ 16px にすると、項目の間隔が 32 から 36 に変わり、目次だけが大きく見える。
- **Caption（12px）**：件数、年のマスの補足、注記番号、©。
- **Logo（18px / 700 / 字間 0.04em）**。

見出しと一覧のタイトルは約物を詰める（`font-feature-settings: "palt"`）。本文には付けない。計算した行の高さは 4px の倍数に切り上げる（`round(up, …, 4px)`）。

## Layout

余白は「何と何の距離か」という役割ごとに 1 段を割り当て、関係が近いものほど狭くする。値はすべて、サイトの spacing のスケールのうちリズムに使う 9 段（4・8・16・24・32・40・48・64・96）から選ぶ。

| 役割       | 値  | 640px 以上の値 | 使う所                                                                                                                                                                             |
| ---------- | --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| tight      | 4   | 同じ           | アイコンと文字、リスト項目どうし                                                                                                                                                   |
| inline     | 8   | 同じ           | 部品の中の要素どうし、タグどうし、ボタンどうし                                                                                                                                     |
| stack      | 16  | 同じ           | 見出し → 文章、小さな面の内側、768px 未満の列間                                                                                                                                    |
| group      | 24  | 同じ           | 段落どうし、面の内側、一覧の行の上下、768px 以上の列間                                                                                                                             |
| row        | 32  | 同じ           | 格子（カード）・タグの一覧の見出し → 内容                                                                                                                                          |
| block      | 40  | 同じ           | コード・表のあと、シェアの上、h4〜h6 の上                                                                                                                                          |
| subsection | 48  | 同じ           | h3 の上                                                                                                                                                                            |
| title      | 48  | 同じ           | 見出し → 行の並び（日付｜題名）。ページ見出し → 内容と、一覧の見出し（Home の最新記事、アーカイブの年）→ 一覧。見出しの文字から 1 行目の文字までが、一覧の行どうしの間と同じになる |
| page       | 48  | 64             | ヘッダー → ページ見出し                                                                                                                                                            |
| pager      | 64  | 同じ           | 一覧 → ページ送り                                                                                                                                                                  |
| section    | 64  | 96             | セクションどうし、h2 の上、フッターの上                                                                                                                                            |

「640px 以上の値」は front matter の `*-wide` にあたる。「同じ」は、幅で広げない役割である。

- **リズムの原則**：距離は関係の強さを表す。近いものほど狭くし、見出しは直前の内容より直後の内容に近づける（見出しの上 > 下。h2 の上 96 / h3 の上 48 / h4〜h6 の上 40 に対し、下は 16）。見出し → 内容の距離は、続くものの見かけで決める。文章は 16（1 行目がすぐ下にある）、箱のあるカードとタグは 32（箱の縁が目印になる）、行の並びは 48（行の上下に余白があり、箱の縁がない。見出しの文字から 1 行目の文字までを一覧の行どうしの間と同じにして、見出しが 1 行目にくっつかないようにする）。
- **部品の内側の微調整**：上の 9 段にない 2px と 12px（サイトの spacing の 50 と 200）は、ブロックどうしの距離ではなく、部品の内側に限る。タグの縦 2px（行の高さを 24px に合わせる）、検索の行の一致タグの内側 2px、注意枠のアイコン → 文字 12px、年別チャートのマスの間 12px（40rem 以上）、開いたナビのパネルをヘッダーの下 12px に置く位置。
- **縦グリッド**：4px。余白と行の高さをすべて 4 の倍数にし、部品の上端と高さが 4px の格子に乗るようにする。
- **横グリッド**：768px 未満は 4 列・列間 16、768px 以上は 12 列・列間 24。一覧は日付 2 列｜タイトル 10 列（768px 未満は日付を上に積む）。
- **コンテナ**：一覧・About・フッターは content（上限 48rem）、記事は article（50rem）＋目次 mokuji（12rem。記事が上限に達して余った幅を 20rem まで使い、記事の幅は削らない）、ヘッダーと記事ページの枠は frame（上限 80rem）。幅は 90vw で、320px 幅のときに左右 16px になる。
- **画面幅の区切り**：992px（サイトの BREAKPOINT）でヘッダーのナビを開閉ボタンにしまう。1024px 以上で目次を右に固定する。
- **押せる大きさは 2 段**：主な操作（ナビ、ロゴ、検索、ページ送り、目次、タグ一覧のタグ、共有、コピー、「すべて見る」）は、タッチの画面（640px 未満、または `pointer: fine` に当たらない画面）で 44px 四方以上。一覧の行と記事冒頭のタグは 32px 四方以上で、隣とは 8px あける。文の中のリンクは行の高さのまま（WCAG 2.5.8 の inline の例外）。注釈の「戻る」は文の外に置くので、24px 四方以上を押せる範囲にする。

## Elevation & Depth

奥行きは使わない。影は使わず、重なりは次の 2 つだけで示す。

- 面の濃さの段：地（gray-50）→ fill（黒 5%）→ 状態の層。
- ダイアログは後ろに幕（黒 44%）を敷いて前面に出す。ダイアログ自体には影も枠線も付けない。

モバイルで開いたナビは、本文に重ねずヘッダーの下に全幅で差し込み、本文を押し下げる。影なしで重ねると、本文と面の区別がつかないため。

## Shapes

角丸は 3 段だけ。

- **sm（4px）**：文字の中の小さな面（キー表示、文字リンクの面）、記事カード、年別チャートのマス。
- **md（8px）**：面と部品の多く（ナビの項目、タグ、注意枠、コード、一覧の行、ダイアログ）。
- **full**：円（検索ダイアログの閉じるボタン、「ページトップへ」、アバター）。

## Components

この節は見た目の規則だけを書く。部品の責務と置き場所は、[layers.md](docs/architecture/layers.md) と [file-placement.md](docs/architecture/file-placement.md) に書いてある。

- **ページ見出し（Title）**：h1 と、その下の説明（件数・ページの趣旨）。説明は body（16px・行の高さ 32px）・副の文字色で、h1 と inline（8）で束ねる。
- **一覧の上の見出し（PostSection・TagSection・年の見出し）**：太字（700）。一覧のタイトルは 400 なので、太さで見出しと区別する。大きさは 22px（UI の Heading の h2）。Home も「最新記事」「タグ」「定番記事」を同じ h2 にし、「記事」でまとめる見出しは置かない（間の「タグ」は記事ではない）。
- **目次（デスクトップ）**：右の列に開いて置く。nav の名前は「目次」で、項目が無い記事では出さない。ラベル「目次」は控えめに 14px・400。項目は 14px・副の文字色（現在の項目だけ主の文字色と面）で、文節で折り返す。
- **見出しのリンク（#）**：hover と焦点のときだけ見せる。名前は「『見出し』へのリンク」。目次やリンクから移った見出しは、再表示されるヘッダーの下に着く（scroll-margin-top は ヘッダーの高さ 64 ＋ stack 16 = 80px）。
- **ヘッダー**：ページの先頭（帯が見えている状態）では面を持たない。スクロールして本文の上に重なって出るときは、地の色で塗る（影と枠線は付けない）。
- **ページトップへ**：先頭と、読み進めている（下へスクロールしている）間は出さず、上へ戻すときに出す（ヘッダーと同じ合図）。動きを減らす設定では、出し入れのアニメーションだけを止める。
- **ボタン**：アイコンだけのボタンは面を持たず、hover で黒 9% の円が現れ、active で黒 12% になる。`aria-label` を付ける。文字の主ボタンは 404 ページの 1 つだけで、面は gray-800、文字は白、角丸は sm、hover は gray-700 にする。ほかの形（outline など）は、実装にまだない。
- **アイコンだけのボタンの並び（シェア・編集）**：面が無いので、アイコンの端を文字の端にそろえる。押せる範囲（36px、タッチは 44px）のうち、アイコン（24px）の外側の余白の分だけ、アイコンの並びを四方へはみ出させ、左端を文字の端に、前後の間隔を役割の値（group・block）のままにする。面のある Google のボタンは、はみ出させない。ヘッダーのロゴ・検索アイコンと同じ扱い。
- **タグ**：2 つの形。件数つき（タグ一覧・トップ。small の文字、件数は caption-mono・副の文字色）と件数なし（記事冒頭・一覧の行。small の文字）。どちらもタグ詳細へのリンクで、押せないタグは作らない。
- **一覧の行**：行全体が押せる範囲（タイトルのリンクの `::after` を行に広げる）。行の中のタグは別のリンクとして上に重ねる。hover の層は行に出す。hover は黒 5%、active は黒 15% を `--transition-fast` で切り替え、ほかの行は不透明度 0.9 まで薄くする（薄くした行の文字も 4.5:1 を保つ）。
- **ナビの現在地**：面は黒 12% だけで示し、文字は 400 のままにする。`aria-current="page"` を付ける。
- **注意枠**：面・文字・枠は種類ごとの色（Colors を参照）。アイコンと見出しは、その種類の文字色にする。内側の余白は 16px。
- **コードブロック・表**：コードは白い面、言語名の帯、コピーのボタン。横にはみ出す部分まで面を続ける。横にスクロールするコードと表は、キーボードで焦点を当てられるようにする（表の箱は名前を持つ region）。
- **検索ダイアログ**：面は地の色。閉じるボタン（44px の円）を右上の角に 16px はみ出させる。入力の消去は「キーワードを消す」という言葉のボタンにする。未入力のときは最近の検索と「よく読まれている記事」を出す。入力しても結果の行は自動で選ばず、↓ で最初の行へ入り、先頭の行の ↑ で選択を外して入力欄へ戻る（末尾で先頭へ戻らない）。結果の上に、検索中と件数を 1 行（caption・副の文字色）で出す（0 件のときは出さない）。Esc は、入力があっても 1 回で閉じる（IME の変換中は閉じない）。「/」と Cmd・Ctrl+K で開く。ダイアログは画面の上に寄せ、結果の件数で入力欄の位置を動かさない。入力欄の行の焦点の枠は外側に 2px あける。hover は面の色だけで示し、選択を動かさない（選択は ↑↓ だけが動かす）。選んでいる行は hover より濃い面にし、マウスを載せても濃さを変えない。hover の切り替えの速さは一覧の行と同じにし、↑↓ で選んだ行には即座に面を付ける。最近の検索の語は、面（黒 9%）の上で hover を黒 12%、選んでいる語を黒 15% にする。
- **記事の日付**：更新日があるときは、投稿日に取り消し線を引いて更新日（主の文字色）を続ける。読み上げは「公開日」「更新日」と言葉で伝える。記事の先頭の日付も、一覧の行と同じ small-mono（14px）にする。
- **注釈**：文字は副の文字色（不透明度で薄くしない）。「戻る」のリンクは 24px 四方以上を押せる範囲にする。
- **カード**：題名は行数を制限せず全文を出す。折り返しは文節で、入りきらない長い語だけ途中で折る。

## Do's and Don'ts

- Do：色・余白・文字は必ず役割のトークンから選ぶ。値を直接書かない。
- Do：副の文字は gray-700 にする。どの面の上でも 4.5:1 以上を保つ。
- Do：状態は半透明の層を重ねて示す。current も同じ層で示し、太字にしない。
- Do：見出しの上の余白を、見出しの下より広くする（見出しを内容の側に寄せる）。
- Do：一覧と記事のタイトルは `word-break: auto-phrase` で文節の途中で折り返さないようにする。
- Don't：影、枠線、グラデーション、色相の面を使わない（例外はフォーカス枠、注意枠の種類色、コードの色分け、Google の G）。
- Don't：太さ 900 を Display（ページ見出し・記事タイトル・Home のプロフィール名）以外に使わない。500・600 を使わない。
- Don't：角丸に 4・8・円以外の値を使わない。
- Don't：見出しを本文より小さくしない。
- Don't：画面から読み取れない操作の言葉（キー操作の案内、アイコンだけのボタンの名前）を「ミニマルにするため」に削らない。
