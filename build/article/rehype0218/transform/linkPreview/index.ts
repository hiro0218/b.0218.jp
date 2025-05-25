import type { Element, ElementContent } from 'hast';
import { getHTML, getMeta } from './dom';
import { handleError } from './handleError';

type OpgProps = {
  description?: string;
  image?: string;
  title?: string;
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
};
type OgpKey = keyof OpgProps;

const SKIP_DOMAINS: string[] = [];

const setPreviewLinkNodes = (node: Element, domain: string, ogp: OpgProps) => {
  if (Object.keys(ogp).length === 0) return;
  if (!ogp.title) return;

  const href = node.properties.href as string;

  try {
    node.properties = {
      className: 'link-preview',
    };
    node.tagName = 'script';
    node.properties.type = 'application/json';

    const data = {
      type: 'text',
      value: JSON.stringify({
        type: 'link-preview',
        data: {
          card: ogp?.card || 'summary',
          link: href,
          thumbnail: ogp.image,
          title: ogp.title,
          description: ogp.description ? ogp.description.substring(0, 50) : '',
          domain: domain,
        },
      }),
    };

    node.children = [data] as ElementContent[];
  } catch (error) {
    handleError(error, href);
  }
};

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
  } catch (_e) {
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
  const ogpEntries = meta.map(getOgpContent).filter((entry): entry is [OgpKey, OpgProps['card']] => entry !== null);
  return Object.fromEntries(ogpEntries);
};

const transformLinkPreview = async (node: Element, index: number, parent: Element) => {
  if (!canTransformLinkPreview(node, index, parent)) return;

  const href = node.properties?.href as string;

  // URLが有効かつHTTPで始まる外部リンクのみを処理
  if (!href || !href.startsWith('http')) return;

  try {
    const domain = new URL(href).hostname;
    if (SKIP_DOMAINS.includes(domain)) return;

    const result = await getHTML(href);
    if (!result) return;

    const meta = getMeta(result);
    if (!meta) return;

    const ogp = getOgpProps(Array.from(meta));

    setPreviewLinkNodes(node, domain, ogp);
  } catch (error) {
    // エラー発生時はドメインをスキップリストに追加
    handleError(error, `Failed to transform link preview for: ${href}`);
    try {
      SKIP_DOMAINS.push(new URL(href).hostname);
    } catch (_) {
      // URL解析に失敗した場合は無視
    }
  }
};

export default transformLinkPreview;
