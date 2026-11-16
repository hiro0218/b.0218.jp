# デザイントークン

デザイン値（トークン・色・余白）を追加・変更するときの運用規則を定める。判断の前提になる原則は [principles.md](./principles.md) にある。

## 🟡 トークン階層 (IMPORTANT)

デザイン値は次の 3 層で扱う。

| 層              | 場所                                     | 内容                                                              |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| primitive       | `src/ui/styled/theme/tokens/`            | Spectrum 由来のパレットと基礎スケール（gray、spacing、fontSizes） |
| semantic        | `src/ui/styled/theme/semanticTokens/`    | サイト全体の役割（bodyBackground、focusRing など）                |
| component-local | 各コンポーネント内の CSS custom property | その部品内でしか使わない座標・寸法・派生値                        |

semantic token は増やしすぎない。次のいずれかを満たす値だけを semantic token にする。

- 複数箇所を同じ判断で動かす値である（例: 反転面の背景を一括で変える）。
- サイト全体の役割を表す値である（例: ページ背景、フォーカスリング）。

一度しか使わない値は共通トークンにせず、利用箇所でパレットを直接参照するか、component-local な CSS custom property に閉じる。
semantic token の定義には、名前だけで利用箇所が読み取れない場合に限り、1 行コメントで役割を補足する（実際の利用箇所を確認できるものだけに付ける）。

## 🔴 色の運用 (CRITICAL)

色は、色相の多さではなく意味の差で使い分ける。

- 基本はニュートラルなグレー（`gray-*` / `grayA-*`）を使う。強調に色相を使うのはフォーカス表示だけで、`accent-*`（Spectrum の blue のパレット）を使う。それ以外は色相で強調しない。
- 状態色（green / red / yellow / purple など）は、Alert のように意味が定義された部品に限る。
- **単発の強調色を追加しない**。1 箇所だけの装飾のために新しい色相を持ち込まない。
- 新しい色の役割を追加する場合は、色名ではなく役割名で命名する（`blueBox` ではなく `notePanel`）。追加時にコントラスト、非カラー情報での代替、ダークテーマへの耐性を確認する。

パレット直接参照（`var(--colors-gray-900)` など）は禁止しないが、次のスケール数値の用途目安に従う。

- 25-100: 地と面
- 200-500: 帯・チャートの棒などの濃い面、無効状態
- 600-800: 副の文字、テキスト以外の静的な装飾
- 900 以上: 主の文字色・アイコン・状態色

この区分は Spectrum の規定ではなく、本リポジトリの運用実態に基づく整理である。

文字色は、載る面に対して 4.5:1 以上になる段から選ぶ。既定は主 gray-900・副 gray-700（日付・件数・補足）である。gray-600 は、載る面で 4.5:1 を確かめてから使う。次の表の面は、ブラウザで実測した描画の色（地の gray-50 に黒の層を重ねた色）で、比は WCAG 2.2 の式で計算した値である。ページ上部の帯は黒 9% の三角形 2 枚で描かれ、重なる所は 2 枚分になる。

| 載る面                            | gray-600 | gray-700 |
| --------------------------------- | -------- | -------- |
| 白（gray-25）                     | 4.88     | 8.06     |
| 地（gray-50）                     | 4.60     | 7.59     |
| フッター（gray-75）               | 4.40     | 7.27     |
| hover の面（黒 5%）               | 4.13     | 6.83     |
| タグの面、帯 1 枚（黒 9%）        | 3.77     | 6.22     |
| タグの hover、current（黒 12%）   | 3.49     | 5.77     |
| 帯 2 枚の重なり（黒 9% を 2 枚）  | 3.07     | 5.07     |
| current の面が帯 2 枚の上に載る所 | 2.35     | 3.89     |

gray-600 が 4.5:1 に届くのは、白と地の上だけである。gray-500 以下は地の上でも届かない（3.05:1）。current の面が帯 2 枚の上に載る所では、副の gray-700 でも 3.89:1 で 4.5:1 を下回るため、その面に副の文字を置かない。base CSS（`src/ui/styles/base/index.css`）などに残る gray-1000 の文字色は未移行であり、新規・変更コードでは踏襲しない。

hover / active の色は、色相を変えず濃度で差を付ける。

- **フォーカス表示**: `:focus-visible` の標準表示は semantic token の `focusRing`（`accent-900`、#3b63fb）に任せる。コンポーネントごとに独自のフォーカス色を定義しない。
- **hover / active の強調**: 切り替え色は部品ごとの判断として component-local な CSS custom property に閉じる。ArticleCard の hover（`--hover-color: var(--colors-accent-1100)` で、文字と枠線を青に切り替える）は未移行であり、新規・変更コードでは踏襲しない。

同じ意図の色参照が複数箇所に散り始めたら、semantic token への昇格を検討する。閾値の考え方は [file-placement.md](../architecture/file-placement.md#配置型-b-の昇格条件) の昇格条件に合わせる。

## 🟡 余白の運用 (IMPORTANT)

余白は Spectrum spacing スケール（`--spacing-50`〜`--spacing-1000`、2〜96px の 12 段）を唯一の尺度とする。
値は `@adobe/spectrum-tokens` から抽出し、期待 px 値と照合してから公開する（[tokens/spacing.ts](../../src/ui/styled/theme/tokens/spacing.ts)。パッケージ更新による暗黙のスケール変動を codegen 時に検知するため）。primitive 12 段は長期固定の契約として扱う。

- layout primitive の gap API（`SpaceGap`）は、サイトのリズムを構成する subset（75 / 100 / 300 / 400 / 500 / 600 / 700 / 800 / 1000）に制限する。段を増やす場合は実際の利用箇所を提示する（500 は格子・タグの一覧で見出しと内容の間に使い、PostSection の card と TagSection が使う。700 は見出しと行の並びの間に使い、base CSS の `--spacing-title` と同じ値である。PostSection の timeline と ArchiveTimelinesByYear の年ごとの区切りが使う）。
- 600 以降の隣接段は比が 1.2〜1.33 倍で知覚差が小さい。段は役割（title / page / section など。base CSS の `--spacing-*`）ごとに 1 つ割り当て、画面幅で同じ役割を広げる切り替えは隣接段でよい（page 700→800）。title は幅で広げない（48）。最も大きな区切りの section は段飛ばし（800→1000）にする。
- スケールにない寸法を calc() の合成で作らない。オフセットや反転（`* -1` など）の算術は許容する。

## 参照

- デザイン原則: [principles.md](./principles.md)
- Panda CSS 規則: [styling.md](../conventions/styling.md)
- UI 命名: [terminology.md](./terminology.md)
