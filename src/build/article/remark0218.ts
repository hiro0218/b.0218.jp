import type { Element } from 'hast';
import { h } from 'hastscript';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

import * as Log from '@/lib/Log';

type OpgProps = {
  description?: string;
  image?: string;
  title?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};

const FETCH_TIMEOUT = 1000;

/**
 * 不正な CSS を読み込んだ際のパースエラーを握りつぶす
 * @see https://github.com/jsdom/jsdom/issues/2230
 */
const virtualConsole = new VirtualConsole();
virtualConsole.on('error', () => {
  // No-op to skip console errors.
});

const transformImage = (node: Element) => {
  node.properties = {
    ...(node.properties || {}),
    loading: 'lazy',
  };
};

const transformCodeblock = (node: Element) => {
  if (Array.isArray(node.properties?.className) && node.properties.className.includes('hljs')) {
    const className = node.properties?.className.join(' ').replace('hljs language-', '');
    node.properties.dataLanguage = className;
  }
};

const setPreviewLinkNodes = (node: Element, index: number, parent: Element, domain: string, ogp: OpgProps) => {
  if (Object.keys(ogp).length === 0) return;
  if (!ogp.title) return;

  const CLASS_NAME = 'p-link-preview';
  const properties = node.properties;

  node.properties = {};
  node.tagName = 'p';
  const template = h('a', { ...properties, class: CLASS_NAME, 'data-card': ogp?.card || 'summary' }, [
    h('span', { class: `${CLASS_NAME}-thumbnail` }, [
      h('img', { src: ogp.image, alt: '', loading: 'lazy', decoding: 'async' }),
    ]),
    h('span', { class: `${CLASS_NAME}-body` }, [
      h('span', { class: `${CLASS_NAME}-body__url` }, domain),
      h('span', { class: `${CLASS_NAME}-body__title` }, ogp.title),
      ogp.description && h('span', { class: `${CLASS_NAME}-body__description` }, ogp.description),
    ]),
  ]);
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

  const url = node.properties.href as string;
  const headers = { 'User-Agent': 'Twitterbot/1.0' };

  try {
    const result = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    }).then((res) => {
      return res.status === 200 ? res.text() : '';
    });

    if (result) {
      const { document } = new JSDOM(result.replace(/<body.*?>.*?<\/body>/gs, ''), { virtualConsole }).window;
      const meta = document.head.querySelectorAll('meta');
      const ogp: OpgProps = Array.from(meta)
        .filter((element: HTMLMetaElement) => {
          const property = element.getAttribute('property');
          const name = element.getAttribute('name');

          return (
            property === 'og:title' || property === 'og:image' || name === 'description' || name === 'twitter:card'
          );
        })
        .reduce((tmp, element: HTMLMetaElement) => {
          const key =
            element.getAttribute('property')?.replace('og:', '') ||
            element.getAttribute('name')?.replace('twitter:', '');
          tmp[key] = element.getAttribute('content');
          return tmp;
        }, {});
      const domain = url.split('/')[2];

      setPreviewLinkNodes(node, index, parent, domain, ogp);
    }
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

const removeEmptyParagraph = (node: Element, index: number, parent: Element) => {
  if (node.children.length === 0) {
    parent.children.splice(index, 1);
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
