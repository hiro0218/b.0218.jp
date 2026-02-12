import { JSDOM, VirtualConsole } from 'jsdom';
import { handleError } from './handleError';
import { isIgnoreDomain, isValidURL, normalizeURL } from './url';

const FETCH_HEADERS = { 'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' };

const FETCH_TIMEOUT = 5000;

const META_TAG_REGEX =
  /<meta\s+(?:[^>]*?\s+)?(?:property|name)=["'](?:og:|twitter:)?(title|description|image|card)["'][^>]*?content=["']([^"']*)["'][^>]*?>/gi;
const TITLE_TAG_REGEX = /<title[^>]*>([^<]*)<\/title>/i;
const HEAD_TAG_REGEX = /<head[^>]*>[\s\S]*?<\/head>/i;

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {
  /* skip console errors */
});
const { DOMParser } = new JSDOM(`<!DOCTYPE html><body></body>`, { virtualConsole }).window;

/**
 * HTML文字列からOGPやメタ情報を抽出する
 * @param html - 解析対象のHTML文字列
 * @returns メタ要素の配列またはNodeList、失敗時はnull
 */
export const getMeta = (html: string) => {
  if (!html) {
    return null;
  }

  /**
   * 正規表現によるメタ情報抽出
   */
  try {
    const metaTags: HTMLMetaElement[] = [];
    const extractedProperties = new Set<string>();
    let regexMatch;

    // OGPとTwitterカードのメタタグを正規表現で抽出
    while ((regexMatch = META_TAG_REGEX.exec(html)) !== null) {
      // [全体マッチ, プロパティ名, コンテンツ値]
      const [, propertyName, contentValue] = regexMatch;

      // 有効なプロパティと値があり、まだ抽出していない場合のみ処理
      if (propertyName && contentValue && !extractedProperties.has(propertyName)) {
        // 抽出済みとしてマーク
        extractedProperties.add(propertyName);

        // 適切なプロパティ名に変換（twitterとogのプレフィックス処理）
        const fullPropertyName = propertyName === 'card' ? 'twitter:card' : `og:${propertyName}`;

        // メタタグのインターフェースを模倣するオブジェクト作成
        const meta = {
          getAttribute: (attrName: string) => {
            if (attrName === 'property' || attrName === 'name') return fullPropertyName;
            if (attrName === 'content') return contentValue;
            return null;
          },
        } as unknown as HTMLMetaElement;
        metaTags.push(meta);

        // 必要な情報が揃ったら早期リターン
        if (
          extractedProperties.has('title') &&
          extractedProperties.has('description') &&
          extractedProperties.has('image')
        ) {
          return metaTags;
        }
      }
    }

    // タイトルタグをフォールバックとして抽出（OGPタイトルがない場合）
    if (!extractedProperties.has('title')) {
      // titleタグを正規表現で検索
      const titleMatch = html.match(TITLE_TAG_REGEX);
      if (titleMatch?.[1]) {
        // 見つかったタイトルをトリミング
        const titleText = titleMatch[1].trim();

        // og:title相当のメタタグとして扱う
        const titleMeta = {
          getAttribute: (attr: string) => {
            if (attr === 'property') return 'og:title';
            if (attr === 'content') return titleText;
            return null;
          },
        } as unknown as HTMLMetaElement;

        metaTags.push(titleMeta);
      }
    }

    if (metaTags.length > 0) {
      return metaTags;
    }
  } catch (_) {
    // 正規表現抽出に失敗した場合は無視して次の方法を試す
  }

  /**
   * headを抽出し、適切なDOMパーサーで解析する
   */
  try {
    const head = html.match(HEAD_TAG_REGEX);
    if (!head || head.length === 0) {
      return null;
    }

    // headをDOMとして解析
    const document = new DOMParser().parseFromString(head[0], 'text/html');
    return document.head.querySelectorAll('meta');
  } catch (err) {
    handleError(err, 'Error parsing HTML head');
    return null;
  }
};

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 指定されたURLからHTML内容を取得する
 * @param url - HTML取得対象のURL
 * @returns HTML文字列、取得失敗時は空文字列
 */
export const getHTML = async (url: string) => {
  if (isIgnoreDomain(url)) return '';
  if (!isValidURL(url)) return '';

  const normalizedUrl = normalizeURL(url);

  const enhancedHeaders = {
    ...FETCH_HEADERS,
    accept: 'text/html',
    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(normalizedUrl, {
        headers: enhancedHeaders,
        signal: AbortSignal.timeout(FETCH_TIMEOUT),
      });

      if (!response.ok) {
        return '';
      }

      const text = await response.text();
      const headEnd = text.indexOf('</head>');

      if (headEnd > 0) {
        return text.substring(0, headEnd + 7);
      }

      return text;
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      handleError(error, `Failed to fetch HTML from: ${url}`);
      return '';
    }
  }

  return '';
};
