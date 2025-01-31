import { parseJSON } from '@/lib/parseJSON';
import { Alert } from '@/pages/[post]/_components/Alert';
import reactHtmlParser, { type HTMLReactParserOptions, Element, domToReact, type DOMNode } from 'html-react-parser';

type AlertDataProps = {
  type: 'alert';
  data: {
    type: 'note' | 'tip' | 'important' | 'warning' | 'caution';
    text: string;
  };
};

const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode.attribs)) {
      return domNode;
    }

    // Alert
    if (domNode.attribs.class === 'gfm-alert') {
      const json = parseJSON<AlertDataProps>(domToReact(domNode.children as DOMNode[]) as string);

      return <Alert type={json.data.type} text={json.data.text} />;
    }

    return domNode;
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
