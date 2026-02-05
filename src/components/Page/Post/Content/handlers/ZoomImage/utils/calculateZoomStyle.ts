import type { CSSProperties } from 'react';

/**
 * CSSProperties の値を number として取得し、取得できない場合は 0 を返す
 */
function toNumberOrZero(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return value;
  }
  return 0;
}

/**
 * ウィンドウに収まるスケールを計算
 *
 * @param params - 画像サイズとオフセット
 * @returns ウィンドウに収まるスケール値
 */
function getScaleToWindow(params: { height: number; width: number; offset: number }): number {
  return Math.min(
    (window.innerWidth - params.offset * 2) / params.width,
    (window.innerHeight - params.offset * 2) / params.height,
  );
}

/**
 * 元画像サイズを考慮した最大スケールを計算
 *
 * @param params - コンテナサイズ、ターゲットサイズ、オフセット
 * @returns 最大スケール値
 */
function getScaleToWindowMax(params: {
  containerHeight: number;
  containerWidth: number;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}): number {
  const scale = getScaleToWindow({
    height: params.targetHeight,
    offset: params.offset,
    width: params.targetWidth,
  });

  const ratio =
    params.targetWidth > params.targetHeight
      ? params.targetWidth / params.containerWidth
      : params.targetHeight / params.containerHeight;

  return scale > 1 ? ratio : scale * ratio;
}

interface ScaleParams {
  containerHeight: number;
  containerWidth: number;
  hasScalableSrc: boolean;
  offset: number;
  targetHeight: number;
  targetWidth: number;
}

/**
 * ズーム時のスケール値を計算
 *
 * @param params - スケール計算に必要なパラメータ
 * @returns スケール値（コンテナが無効な場合は 1）
 */
function getScale(params: ScaleParams): number {
  if (!params.containerHeight || !params.containerWidth) {
    return 1;
  }

  const hasValidTarget = params.targetHeight > 0 && params.targetWidth > 0;
  const shouldUseNaturalSize = !params.hasScalableSrc && hasValidTarget;

  if (shouldUseNaturalSize) {
    return getScaleToWindowMax(params);
  }

  return getScaleToWindow({
    height: params.containerHeight,
    offset: params.offset,
    width: params.containerWidth,
  });
}

interface ModalImgStyleParams {
  hasScalableSrc: boolean;
  isZoomed: boolean;
  offset: number;
  targetEl: HTMLImageElement;
}

/**
 * モーダル画像のスタイルを計算
 *
 * transform ベースのアニメーションで、トリガー画像の位置から
 * 画面中央へスムーズに遷移するスタイルを生成する。
 *
 * @param params - スタイル計算に必要なパラメータ
 * @returns 計算された CSSProperties
 */
export function calculateModalImgStyle(params: ModalImgStyleParams): CSSProperties {
  const imgRect = params.targetEl.getBoundingClientRect();
  const targetWidth = params.targetEl.naturalWidth || imgRect.width;
  const targetHeight = params.targetEl.naturalHeight || imgRect.height;

  const scale = getScale({
    containerHeight: imgRect.height,
    containerWidth: imgRect.width,
    hasScalableSrc: params.hasScalableSrc,
    offset: params.offset,
    targetHeight,
    targetWidth,
  });

  const style: CSSProperties = {
    top: imgRect.top,
    left: imgRect.left,
    width: imgRect.width * scale,
    height: imgRect.height * scale,
    transform: `translate(0,0) scale(${1 / scale})`,
  };

  if (params.isZoomed) {
    const width = toNumberOrZero(style.width);
    const height = toNumberOrZero(style.height);
    const left = toNumberOrZero(style.left);
    const top = toNumberOrZero(style.top);

    const translateX = window.innerWidth / 2 - (left + width / 2);
    const translateY = window.innerHeight / 2 - (top + height / 2);

    style.transform = `translate(${translateX}px,${translateY}px) scale(1)`;
  }

  return style;
}
