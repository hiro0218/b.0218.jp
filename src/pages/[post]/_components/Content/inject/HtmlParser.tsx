import { Anchor } from '@/components/UI/Anchor';
import { parseJSON } from '@/lib/parseJSON';
import { Alert, type AlertType } from '@/pages/[post]/_components/Alert';
import { LinkPreview } from '@/pages/[post]/_components/LinkPreview';
import reactHtmlParser, {
  type HTMLReactParserOptions,
  Element,
  domToReact,
  type DOMNode,
  Text,
} from 'html-react-parser';

type AlertDataProps = {
  type: 'alert';
  data: {
    type: AlertType;
    text: string;
  };
};

type LinkPreviewDataProps = {
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

const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode.attribs)) {
      return domNode;
    }

    // Anchor
    if (domNode.tagName === 'a' && domNode.attribs?.href.startsWith('/')) {
      return <Anchor href={domNode.attribs.href}>{domToReact(domNode.children as DOMNode[])}</Anchor>;
    }

    // Alert
    if (domNode.attribs.class === 'gfm-alert') {
      const json = parseJSON<AlertDataProps>(domToReact(domNode.children as DOMNode[]) as string);

      return <Alert type={json.data.type} text={json.data.text} />;
    }

    // Link Preview
    if (domNode.attribs.class === 'link-preview') {
      const json = parseJSON<LinkPreviewDataProps>(domToReact(domNode.children as DOMNode[]) as string);

      return (
        <LinkPreview
          link={json.data.link}
          card={json.data.card}
          thumbnail={json.data.thumbnail}
          title={json.data.title}
          description={json.data.description}
          domain={json.data.domain}
        />
      );
    }

    // iframe: CodePen
    if (
      domNode.tagName === 'iframe' &&
      typeof domNode.attribs?.src === 'string' &&
      domNode.attribs.src.includes('//codepen.io') &&
      domNode.children[0] instanceof Text
    ) {
      // ハイドレーション時にエスケープ文字が不一致しない場合があるため埋める
      domNode.children[0].data = 'CodePen';
    }

    return domNode;
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
