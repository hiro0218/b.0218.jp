import type { Element, ElementContent } from 'hast';
import { h } from 'hastscript';

import * as Log from '@/lib/Log';

import { FETCH_TIMEOUT, getHTML, getMeta } from '../dom';

type OpgProps = {
  description?: string;
  image?: string;
  title?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};
type OgpKey = keyof OpgProps;

const PREVIEW_LINK_BLOCK_CLASS_NAME = 'p-link-preview';
const PREVIEW_LINK_CLASS_NAMES = {
  BLOCK: PREVIEW_LINK_BLOCK_CLASS_NAME,
  THUMBNAIL: `${PREVIEW_LINK_BLOCK_CLASS_NAME}-thumbnail`,
  BODY: {
    BLOCK: `${PREVIEW_LINK_BLOCK_CLASS_NAME}-body`,
    URL: `${PREVIEW_LINK_BLOCK_CLASS_NAME}-body__url`,
    TITLE: `${PREVIEW_LINK_BLOCK_CLASS_NAME}-body__title`,
    DESCRIPTION: `${PREVIEW_LINK_BLOCK_CLASS_NAME}-body__description`,
  },
};

const setPreviewLinkNodes = (node: Element, index: number, parent: Element, domain: string, ogp: OpgProps) => {
  if (Object.keys(ogp).length === 0) return;
  if (!ogp.title) return;

  const properties = node.properties;

  node.properties = {};
  node.tagName = 'p';
  const template = h(
    'a',
    { ...properties, class: PREVIEW_LINK_CLASS_NAMES.BLOCK, 'data-card': ogp?.card || 'summary' },
    [
      h('span', { class: PREVIEW_LINK_CLASS_NAMES.THUMBNAIL }, [
        h('img', { src: ogp.image, alt: '', loading: 'lazy', decoding: 'async' }),
      ]),
      h('span', { class: PREVIEW_LINK_CLASS_NAMES.BODY.BLOCK }, [
        h('span', { class: PREVIEW_LINK_CLASS_NAMES.BODY.URL }, domain),
        h('span', { class: PREVIEW_LINK_CLASS_NAMES.BODY.TITLE }, ogp.title),
        ogp.description && h('span', { class: PREVIEW_LINK_CLASS_NAMES.BODY.DESCRIPTION }, ogp.description),
      ]),
    ],
  );
  node.children = [template];

  parent.children.splice(index, 1, ...node.children);
};

// eslint-disable-next-line complexity
const canTransformLinkPreview = (node: Element, index: number, parent: Element) => {
  // a要素ではない
  if (node.type !== 'element' && node.tagName !== 'a') {
    return false;
  }

  // a要素に子がない
  if (!node.children.length) {
    return false;
  }

  // textノードではない
  if (node.children[0].type !== 'text') {
    return false;
  }

  // 親がp要素ではない
  if (parent.tagName !== 'p' && parent.children[0].type === 'element') {
    return false;
  }

  // 子がtext、textがhrefと一致すること
  if (node.children.length === 1 && node.children[0].value !== node?.properties?.href) {
    return false;
  }

  const siblings = parent ? parent.children : [];
  const prevNode = !!index && siblings[index - 1];
  const nextNode = !!index && siblings[index + 1];

  // 前後が空行だった場合はtrue
  return !checkBreakNode(prevNode) && !checkBreakNode(nextNode);
};

const checkBreakNode = (node: boolean | ElementContent) => {
  if (typeof node === 'boolean') {
    return node;
  }

  try {
    return (node.type === 'element' && node.tagName === 'br') || !!node;
  } catch (e) {
    return false;
  }
};

const getOgpContent = (element: HTMLMetaElement): [OgpKey, string] | null => {
  const property = element.getAttribute('property');
  const name = element.getAttribute('name');

  if (property === 'og:title' || property === 'og:image' || name === 'description' || name === 'twitter:card') {
    const key = property?.replace('og:', '') || name?.replace('twitter:', '');
    const content = element.getAttribute('content');

    return [key as OgpKey, content ?? ''];
  }

  return null;
};

const getOgpProps = (meta: HTMLMetaElement[]): OpgProps => {
  const ogpEntries = meta.map(getOgpContent).filter((entry): entry is [OgpKey, string] => entry !== null);
  return Object.fromEntries(ogpEntries);
};

const transformLinkPreview = async (node: Element, index: number, parent: Element) => {
  if (!canTransformLinkPreview(node, index, parent)) return;

  const href = node.properties?.href as string;

  try {
    const result = await getHTML(href);

    if (!result) return;

    const meta = getMeta(result);
    const ogp = getOgpProps(Array.from(meta));
    const domain = new URL(href).hostname;

    setPreviewLinkNodes(node, index, parent, domain, ogp);
  } catch (error) {
    if (error.name === 'TimeoutError') {
      Log.error(`Timeout: It took more than ${FETCH_TIMEOUT} ms to retrieve the result.`, href);
    } else if (error.name === 'AbortError') {
      Log.error('Fetch aborted by user action.', href);
    } else if (error.name === 'TypeError') {
      Log.error('AbortSignal.timeout() method is not supported', href);
    } else {
      Log.error('Unexpected error occurred', error, href);
    }
  }
};

export default transformLinkPreview;
