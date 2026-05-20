import { JSDOM, VirtualConsole } from 'jsdom';
import { handleError } from './handleError';
import { isIgnoreDomain, isValidURL, normalizeURL } from './url';

const FETCH_HEADERS = { 'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' };

const FETCH_TIMEOUT = 5000;

type NormalizedMetaDescriptor = {
  attribute: 'name' | 'property';
  dedupeKey: 'card' | 'description' | 'image' | 'title';
  value: string;
};

const META_DESCRIPTORS = new Map<string, NormalizedMetaDescriptor>([
  ['og:title', { attribute: 'property', dedupeKey: 'title', value: 'og:title' }],
  ['twitter:title', { attribute: 'property', dedupeKey: 'title', value: 'og:title' }],
  ['description', { attribute: 'name', dedupeKey: 'description', value: 'description' }],
  ['og:description', { attribute: 'name', dedupeKey: 'description', value: 'description' }],
  ['twitter:description', { attribute: 'name', dedupeKey: 'description', value: 'description' }],
  ['og:image', { attribute: 'property', dedupeKey: 'image', value: 'og:image' }],
  ['twitter:image', { attribute: 'property', dedupeKey: 'image', value: 'og:image' }],
  ['twitter:card', { attribute: 'name', dedupeKey: 'card', value: 'twitter:card' }],
]);

const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {
  /* skip console errors */
});
const { DOMParser } = new JSDOM(`<!DOCTYPE html><body></body>`, { virtualConsole }).window;

function createMetaElement(
  document: Document,
  descriptor: Pick<NormalizedMetaDescriptor, 'attribute' | 'value'>,
  content: string,
): HTMLMetaElement {
  const meta = document.createElement('meta');
  meta.setAttribute(descriptor.attribute, descriptor.value);
  meta.setAttribute('content', content);

  return meta;
}

function getMetaDescriptor(element: HTMLMetaElement): NormalizedMetaDescriptor | undefined {
  const name = element.getAttribute('property') ?? element.getAttribute('name');

  return name ? META_DESCRIPTORS.get(name) : undefined;
}

function appendTitleFallback(document: Document, meta: HTMLMetaElement[], extractedKeys: Set<string>): void {
  if (extractedKeys.has('title')) {
    return;
  }

  const title = document.head.querySelector('title')?.textContent?.trim();
  if (!title) {
    return;
  }

  extractedKeys.add('title');
  meta.push(createMetaElement(document, { attribute: 'property', value: 'og:title' }, title));
}

/**
 * HTML文字列からOGPやメタ情報を抽出する
 * @param html - 解析対象のHTML文字列
 * @returns メタ要素の配列またはNodeList、失敗時はnull
 */
export const getMeta = (html: string): HTMLMetaElement[] | null => {
  if (!html) {
    return null;
  }

  try {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const metaTags: HTMLMetaElement[] = [];
    const extractedKeys = new Set<string>();

    for (const element of document.head.querySelectorAll('meta')) {
      const descriptor = getMetaDescriptor(element);
      const content = element.getAttribute('content');

      if (!descriptor || !content || extractedKeys.has(descriptor.dedupeKey)) {
        continue;
      }

      extractedKeys.add(descriptor.dedupeKey);
      metaTags.push(createMetaElement(document, descriptor, content));
    }

    appendTitleFallback(document, metaTags, extractedKeys);

    if (metaTags.length > 0) {
      return metaTags;
    }

    return null;
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
