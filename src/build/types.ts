export interface GitHubGraphQl {
  data?: Data;
}

export interface Data {
  user?: User;
}

export interface User {
  pinnedItems?: PinnedItems;
}

export interface PinnedItems {
  edges?: Edge[];
}

export interface Edge {
  node?: EdgeNode;
}

export interface EdgeNode {
  name?: string;
  description?: string;
  updatedAt?: Date;
  createdAt?: Date;
  homepageURL?: string;
  url?: string;
  stargazerCount?: number;
  forkCount?: number;
  languages?: Languages;
}

export interface Languages {
  nodes?: NodeElement[];
}

export interface NodeElement {
  color?: string;
  name?: string;
}
