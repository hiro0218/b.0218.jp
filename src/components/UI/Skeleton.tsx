import { styled } from '@/ui/styled';

interface SkeletonProps {
  /** 幅（CSS値。例: '100%', '200px'） */
  width?: string;
  /** 高さ（CSS値。例: '1em', '128px'） */
  height?: string;
  className?: string;
}

/**
 * 読み込み中のコンテンツ領域を示すプレースホルダー。読み込み中である旨の通知は呼び出し側のコンテナが担う想定のため、装飾要素として扱う。
 * @summary ローディングプレースホルダー
 */
export function Skeleton({ width = '100%', height = '1em', className }: SkeletonProps) {
  return <Div aria-hidden="true" className={className} style={{ width, height }} />;
}

const Div = styled.div`
  position: relative;
  overflow: hidden;
  pointer-events: none;
  background-color: var(--colors-gray-a-300);
  border-radius: var(--radii-md);

  /* ハイライトが要素の左端から右端まで通過するよう -100% -> 200% で要素幅の3倍分を移動する */
  &::after {
    position: absolute;
    inset: 0;
    content: '';
    background-image: linear-gradient(to right, transparent, var(--colors-gray-a-500), transparent);
    transform: translateX(-100%);
    /* 継続的なローディング表示のため、UI操作アニメーションの300ms上限(animation.md)は適用しない */
    animation: skeletonShimmer 2s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      /* transform の初期値である -100% (要素外) で静止し、ハイライトが非表示になる */
      animation: none;
    }
  }
`;
