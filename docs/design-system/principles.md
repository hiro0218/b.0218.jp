# デザイン原則

デザイントークン・視覚表現を追加・変更するときの判断基準を定義する。
Panda CSS の機械的な規則は [styling.md](../conventions/styling.md)、UI 命名は [terminology.md](./terminology.md)、トークンの運用は [tokens.md](./tokens.md)、コンポーネントの責務は [layers.md](../architecture/layers.md)、共通化の基準は [file-placement.md の昇格条件](../architecture/file-placement.md#配置型-b-の昇格条件) を正とし、本ファイルはそれらの上位にある設計判断を扱う。

出典: 姉妹リポジトリ Harp（Marp スライドのデザインシステム）の DESIGN.md から、ブログに適用可能な概念を抽出・翻案した。

## デザインコンセプト

本サイトは、読み手が本文と根拠を追うための画面である。
デザインは、情報の順序、視線の移動、重要度の差を明確にするために使う。
装飾は、内容の階層を読みやすくする範囲に抑える（Low ornament）。

## Adobe Spectrum との関係

`@adobe/spectrum-tokens` は値の供給源であり、Adobe の見た目に寄せるためのものではない（[tokens/colors.ts](../../src/ui/styled/theme/tokens/colors.ts)）。
採用理由は、読みやすさ、意味の一貫性、調整しやすさをデザイン判断の基準にするためである。

Spectrum の Inclusive design の前提は、本サイトでは次の形で扱う。

- **構造を先に整える**: 見出し、本文、図版、注記の読み順を崩さない。画面上の配置と DOM 順序を矛盾させない。
- **色だけで伝えない**: 状態や重要度は、色に加えてラベル、線、太さ、位置、形で示す。
- **読みやすさを優先する**: 本文は左揃えを基本にし、長すぎる行と詰まった行間を避ける。
- **代替情報を残す**: 画像・図版には意味のある alt を付け、説明に必要な情報は本文にも置く。
- **判断を文書化する**: アクセシビリティや表示上の判断は、token 定義、コンポーネント JSDoc、ルールのいずれかに残す。

## 線と面

- 影と枠線は使わない。線はフォーカス枠とリンクの下線に限る。
- 面（`grayA-75` の fill、フッターの `gray-75` など）は背景から情報単位を分けるために使い、選択状態（current）は面で示す（太字にしない）。
- 階層を作るときは、余白と面で分ける。既存コードに残る枠線・影（ArticleCard の枠線、base CSS の pre・table の罫線、Alert・DropdownMenu・CopyButton・LinkPreview・PostMokuji の枠線と影、記事本文の CSS の枠線と罫線など）は未移行であり、新規・変更コードでは踏襲しない。
- カードの中に装飾カードを重ねて階層を作らない。

## デザイン品質

- ライブラリ（Panda CSS、React Aria など）のデフォルト値をそのまま出荷しない。デザイントークン経由で上書きする。
- インタラクティブ要素は hover / focus / active を設計する。
- スケール・余白でヒエラルキーを表現する。

## 拡張判断

新しいデザイン要素（色役割、装飾、視覚部品）を追加する前に、次を確認する。

- その要素は内容の階層を明確にするか。装飾のための装飾になっていないか。
- 既存のトークン、layout primitive、コンポーネントで表せないか。
- 1 回限りの表現か、今後も使う表現か。
- 色だけに依存せず、形、線、位置、ラベルでも意味が伝わるか。
- 読み順、代替情報、コントラスト、文字量に問題がないか。

## 適用しない Harp 概念

出典の Harp は Marp スライド（固定キャンバス・発表資料）であり、前提が違う次の規則は本リポジトリに適用しない。

| Harp の規則                    | 適用しない理由                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| BEM 命名                       | class は Panda CSS の生成物である。命名は [terminology.md](./terminology.md) を正とする      |
| アニメーションの原則禁止       | 本サイトは動きを設計要素として使う。点滅・長く続く動き・注意を奪う動きを避ける方針は共有する |
| 固定キャンバス前提の文字量削減 | Web はスクロールとリフローを前提にする。行長制限と階層設計で読みやすさを担保する             |

## 参照

- トークンの運用: [tokens.md](./tokens.md)
- Panda CSS 規則: [styling.md](../conventions/styling.md)
- UI 命名: [terminology.md](./terminology.md)
- コンポーネントの責務: [layers.md](../architecture/layers.md)
- 共通化（昇格条件）: [file-placement.md](../architecture/file-placement.md#配置型-b-の昇格条件)
- [Adobe Spectrum: Inclusive design](https://spectrum.adobe.com/page/inclusive-design/)
- [Adobe Spectrum: Color fundamentals](https://spectrum.adobe.com/page/color-fundamentals/)
