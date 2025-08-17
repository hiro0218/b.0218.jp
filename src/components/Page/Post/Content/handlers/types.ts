import type { Element } from 'html-react-parser';

export type HandlerFunction = (domNode: Element) => React.ReactElement | null | undefined;
