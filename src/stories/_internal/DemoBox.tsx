import type { ReactNode } from 'react';

type DemoBoxProps = {
  children: ReactNode;
  color?: string;
  minHeight?: string;
  /** タグやバッジ等のコンパクト要素を模す場合に使用 */
  compact?: boolean;
};

/**
 * Layout Story 用のビジュアルプレースホルダー。
 * レイアウトコンポーネントの配置・間隔を視覚化するために使用する。
 */
export function DemoBox({ children, color = 'var(--colors-blue-200)', minHeight, compact = false }: DemoBoxProps) {
  return (
    <div
      style={{
        background: color,
        padding: compact ? 'var(--spacing-1) var(--spacing-2)' : 'var(--spacing-2)',
        borderRadius: 'var(--radii-sm)',
        ...(minHeight != null && { minHeight }),
      }}
    >
      {children}
    </div>
  );
}
