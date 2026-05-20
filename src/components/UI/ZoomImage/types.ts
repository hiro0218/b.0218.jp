/**
 * ズーム用の高解像度画像ソース
 */
export type ZoomImageSource = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

export type ImageDimensions = {
  width: number;
  height: number;
};
