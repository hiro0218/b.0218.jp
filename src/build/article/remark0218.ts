import type { Element } from 'hast';
import { h } from 'hastscript';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

import * as Log from '@/lib/Log';

import { getMeta } from './dom';
import transformCodeblock from './transform/codeblock';
import transformImage from './transform/image';
import { removeEmptyParagraph } from './transform/paragraph';
import { isValidURL, normalizeURL } from './url';

type OpgProps = {
  description?: string;
  image?: string;
  title?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};

const FETCH_TIMEOUT = 1000;

const FETCH_HEADERS = { 'User-Agent': 'Twitterbot/1.0' };

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
  // 親がp要素で子がa要素であること
  if (parent.tagName !== 'p' && parent.children[0].type === 'element' && parent.children[0].tagName === 'a')
    return false;

  if (node.children[0]?.type !== 'text') return false;

  // 子がtext、textがhrefと一致すること
  if (node.children.length === 1 && node.children[0]?.value !== node.properties.href) return false;

  const siblings = parent ? parent.children : [];
  const prevNode = index && siblings[index - 1];
  const nextNode = index && siblings[index + 1];

  // 前後が空行だった場合はtrue
  return !prevNode && !nextNode;
};

const transformLinkPreview = async (node: Element, index: number, parent: Element) => {
  if (!canTransformLinkPreview(node, index, parent)) return;

  const href = node.properties.href as string;

  if (!isValidURL(href)) return;

  const url = normalizeURL(href);

  try {
    const result = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    }).then((res) => {
      return res.status === 200 ? res.text() : '';
    });

    if (!result) return;

    const meta = getMeta(result);
    const ogp: OpgProps = Array.from(meta)
      .filter((element: HTMLMetaElement) => {
        const property = element.getAttribute('property');
        const name = element.getAttribute('name');

        return property === 'og:title' || property === 'og:image' || name === 'description' || name === 'twitter:card';
      })
      .reduce((tmp, element: HTMLMetaElement) => {
        const key =
          element.getAttribute('property')?.replace('og:', '') || element.getAttribute('name')?.replace('twitter:', '');
        tmp[key] = element.getAttribute('content');
        return tmp;
      }, {});
    const domain = new URL(url).hostname;

    setPreviewLinkNodes(node, index, parent, domain, ogp);
  } catch (error) {
    if (error.name === 'TimeoutError') {
      Log.error(`Timeout: It took more than ${FETCH_TIMEOUT} ms to retrieve the result.`, url);
    } else if (error.name === 'AbortError') {
      Log.error('Fetch aborted by user action.', url);
    } else if (error.name === 'TypeError') {
      Log.error('AbortSignal.timeout() method is not supported', url);
    } else {
      Log.error('Unexpected error occurred', error, url);
    }
  }
};

const remark0218 = (): Transformer => {
  const nodes = new Set<{ node: Element; index: number; parent: Element }>();

  return async (tree) => {
    visit(tree, { tagName: 'a' }, function visitor(node: Element, index, parent) {
      nodes.add({ node, index, parent });
    });

    await Promise.all(
      [...nodes].map(async ({ node, index, parent }) => {
        await transformLinkPreview(node, index, parent);
      }),
    );

    visit(tree, { tagName: 'img' }, function visitor(node: Element) {
      transformImage(node);
    });

    visit(tree, { tagName: 'code' }, function visitor(node: Element) {
      transformCodeblock(node);
    });

    visit(tree, { tagName: 'p' }, function visitor(node: Element, index, parent) {
      removeEmptyParagraph(node, index, parent);
    });
  };
};

export default remark0218;
