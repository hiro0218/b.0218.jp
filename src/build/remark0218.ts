import type { Element, ElementContent } from 'hast';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

type OpgProps = { description?: string; image?: string; title?: string };

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

const setPreviewLinkNodes = (node: Element, ogp: OpgProps) => {
  if (Object.keys(ogp).length === 0) return;
  if (!ogp.title) return;

  const CLASS_NAME = 'p-link-preview';
  const properties = node.properties;
  node.properties = {};
  node.tagName = 'div';
  node.children = [
    {
      type: 'element',
      tagName: 'a',
      properties: {
        ...properties,
        className: [CLASS_NAME],
      },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { className: [`${CLASS_NAME}-body`] },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: [`${CLASS_NAME}-body__title`] },
              children: [
                {
                  type: 'text',
                  value: ogp.title || '',
                },
              ],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: [`${CLASS_NAME}-body__description`] },
              children: [
                {
                  type: 'text',
                  value: ogp.description || '',
                },
              ],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'div',
          properties: { className: [`${CLASS_NAME}-thumbnail`] },
          children: [
            {
              type: 'element',
              tagName: 'img',
              properties: { src: ogp.image || '', alt: '', loading: 'lazy' },
              children: [],
            },
          ],
        },
      ],
    },
  ] as ElementContent[];
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

  try {
    const url = node.properties.href as string;
    const result = await fetch(url).then((res) => {
      return res.status === 200 ? res.text() : '';
    });

    if (result) {
      const dom = new JSDOM(result);
      const meta = dom.window.document.querySelectorAll('head > meta');
      const ogp: OpgProps = Array.from(meta)
        .filter((element) => {
          const property = element.getAttribute('property');
          const name = element.getAttribute('name');

          return property === 'og:title' || property === 'og:image' || name === 'description';
        })
        .reduce((tmp, element) => {
          tmp[element.getAttribute('property')?.replace('og:', '') || element.getAttribute('name')] =
            element.getAttribute('content');
          return tmp;
        }, {});

      setPreviewLinkNodes(node, ogp);
    }
  } catch (error) {
    console.error(error, node.properties.href);
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
    visit(tree, 'element', function visitor(node: Element, index, parent) {
      nodes.add({ node, index, parent });
    });

    await Promise.all(
      [...nodes].map(async ({ node, index, parent }) => {
        switch (node.tagName) {
          case 'a':
            await transformLinkPreview(node, index, parent);
            break;
          case 'img':
            transformImage(node);
            break;
          case 'code':
            transformCodeblock(node);
            break;
          case 'p':
            removeEmptyParagraph(node, index, parent);
            break;
        }
      }),
    );
  };
};

export default remark0218;
