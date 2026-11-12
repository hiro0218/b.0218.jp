import { isObject } from '@/lib/utils/isObject';
import { isStringArray } from '@/lib/utils/isStringArray';
import { safeJsonParse } from '@/lib/utils/json';

/**
 * Post / Page の HTML 本文に埋め込まれる「埋め込みコンテンツ」の共有契約。
 *
 * 契約の両端:
 * - build 側: build/article/rehype0218/transform/linkPreview, build/article/rehypeGfmAlert が
 *   markdown -> HTML 変換時に `<script type="application/json" class="...">` として JSON を埋め込む。
 * - runtime 側: src/components/Page/_shared/HTMLParser/{LinkPreview,Alert}Handler.tsx が
 *   HTML をパースする際に class 名と JSON 形状を検証し、対応する React コンポーネントへ復元する。
 *
 * なぜ共有するか:
 * これまでは build が生成する class 名 / JSON 形状と runtime がそれを読むための型が、
 * それぞれ独立したファイルに書かれており、両者を結ぶ参照は存在しなかった。
 * build 側でキー名や class 名を変えてもコンパイラは検知できず、runtime 側の型ガードが
 * 静かに失敗して記事内の該当箇所が理由不明のまま消えるだけだった。
 * build と runtime の双方がこのモジュールを import することで、変更が片側に留まった場合に
 * コンパイルエラーとして検出できるようにする。
 */

// ---- link-preview ----

/** build が埋め込み要素に付与し、runtime が読み取る class 名。 */
export const LINK_PREVIEW_CLASS_NAME = 'link-preview';

export type LinkPreviewData = {
  type: 'link-preview';
  data: {
    link: string;
    card: string;
    thumbnail: string;
    title: string;
    description: string;
    domain: string;
  };
};

/** 埋め込み JSON をパースした値が LinkPreviewData の形状を満たすかを検証する。 */
export function isLinkPreviewData(value: unknown): value is LinkPreviewData {
  if (!isObject(value) || value.type !== 'link-preview' || !isObject(value.data)) {
    return false;
  }

  const { link, card, thumbnail, title, description, domain } = value.data;

  return isStringArray([link, card, thumbnail, title, description, domain]);
}

export function parseLinkPreviewData(json: string): LinkPreviewData | null {
  const value = safeJsonParse<unknown>(json);

  return isLinkPreviewData(value) ? value : null;
}

/**
 * build が埋め込む link-preview の JSON 文字列を組み立てる。
 * OGP 取得結果に image が無い場合 thumbnail は undefined になり得る。JSON.stringify は
 * undefined 値のキーを出力から落とすため、その場合 isLinkPreviewData は thumbnail 欠落を
 * 不正な payload として扱いフォールバックする（既存のフォールバック挙動を保持している）。
 */
export function serializeLinkPreviewData(
  data: Omit<LinkPreviewData['data'], 'thumbnail'> & { thumbnail: string | undefined },
): string {
  return JSON.stringify({ type: 'link-preview', data });
}

// ---- gfm-alert ----

/** build が埋め込み要素に付与し、runtime が読み取る class 名。 */
export const GFM_ALERT_CLASS_NAME = 'gfm-alert';

// この5値は @/components/UI/Alert の AlertType と意図的に一致させている。
// 契約（build が書き込み runtime が検証する値集合）と UI（描画バリアント）は別レイヤーの語彙のため
// import による結合はしない。乖離が起きた場合は AlertHandler が isAlertData 通過後の値を
// <Alert type={...}> に渡す箇所で、UI が未対応の値を持つ形の代入エラーとして検出される。
export const ALERT_KINDS = ['note', 'tip', 'important', 'warning', 'caution'] as const;

export type AlertKind = (typeof ALERT_KINDS)[number];

export type AlertData = {
  type: 'alert';
  data: {
    type: AlertKind;
    text: string;
  };
};

/** 埋め込み JSON をパースした値が AlertData の形状を満たすかを検証する。 */
export function isAlertData(value: unknown): value is AlertData {
  if (!isObject(value) || value.type !== 'alert' || !isObject(value.data)) {
    return false;
  }

  const { type, text } = value.data;

  return typeof text === 'string' && ALERT_KINDS.some((kind) => kind === type);
}

export function parseAlertData(json: string): AlertData | null {
  const value = safeJsonParse<unknown>(json);

  return isAlertData(value) ? value : null;
}

/**
 * type を string にしない。string のまま渡せると、build で未知の種別が通る。
 * runtime の isAlertData は未知の種別を弾くため、記事内の alert が理由不明のまま消える。
 */
export function serializeAlertData(data: AlertData['data']): string {
  return JSON.stringify({ type: 'alert', data });
}
