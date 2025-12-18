export type PopularityDetail = {
  total: number;
  ga: number;
  hatena: number;
};

/** 記事スラッグごとの人気度スコア */
export type Result = Record<string, PopularityDetail>;

export type HatenaResult = Record<string, number>;
