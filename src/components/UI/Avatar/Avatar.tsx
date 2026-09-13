'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import { css, cx } from '@/ui/styled';

type Props = {
  /** alt 代わりの識別名。画像が無い/失敗した場合はイニシャルとして表示する */
  name: string;
  src: string | null;
  /** 一辺のサイズ（px）。省略時は 32px */
  size?: number;
};

const DEFAULT_SIZE_PX = 32;

/**
 * ユーザーの画像を表示し、画像が無い・読み込みに失敗した場合はイニシャル 1 文字にフォールバックする。
 * Base UI の Avatar（Root/Image/Fallback による読み込み状態管理）を参考に、
 * 本プロジェクトでは単一コンポーネント + 素の img の onError で同等の挙動を実装する。
 * @summary アバター画像（イニシャルフォールバック対応）
 */
export function Avatar({ name, src, size = DEFAULT_SIZE_PX }: Props) {
  const [failed, setFailed] = useState(false);
  const style = { '--avatar-size': `${size}px` } as CSSProperties;

  if (!src || failed) {
    const initial = [...name][0] ?? '';
    return (
      <span aria-hidden="true" className={cx(baseStyle, fallbackStyle)} style={style}>
        {initial}
      </span>
    );
  }

  return (
    <img
      alt=""
      className={cx(baseStyle, imageStyle)}
      decoding="async"
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      referrerPolicy="no-referrer"
      src={src}
      style={style}
      width={size}
    />
  );
}

const baseStyle = css`
  flex-shrink: 0;
  width: var(--avatar-size);
  height: var(--avatar-size);
  background-color: var(--colors-gray-100);
  border-radius: var(--radii-full);
`;

const imageStyle = css`
  object-fit: cover;
`;

const fallbackStyle = css`
  display: grid;
  place-items: center;
  font-size: var(--font-sizes-xs);
  font-weight: var(--font-weights-bold);
  color: var(--colors-gray-800);
`;

type GroupProps = {
  children: ReactNode;
};

/**
 * Avatar を横に少しずつ重ねて表示する。各要素に背景色のリングを付けて重なりの境界を分離する。
 * @summary アバターの重なり表示
 */
export function AvatarGroup({ children }: GroupProps) {
  return <div className={groupStyle}>{children}</div>;
}

const groupStyle = css`
  display: flex;

  & > * {
    margin-inline-start: calc(var(--spacing-100) * -1);
    border-radius: var(--radii-full);
    box-shadow: 0 0 0 2px var(--colors-gray-50);
  }

  & > *:first-child {
    margin-inline-start: 0;
  }
`;
