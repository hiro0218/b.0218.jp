import type { ImgHTMLAttributes, JSX } from 'react';
import { styled } from '@/ui/styled';
import { Controller } from './ZoomImage/Controller';

const MIN_IMAGE_SIZE = 100;

type ZoomImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
};

/**
 * ズーム可能な画像コンポーネント。
 * クリックで画像をモーダル表示し、View Transitions API で
 * トリガー画像の位置から画面中央へスムーズに遷移する。
 * @summary クリックでモーダルズームする画像
 */
export function ZoomImage({ alt, src, style, ...props }: ZoomImageProps): JSX.Element {
  if (style?.objectFit) {
    return <img alt={alt} src={src} style={style} {...props} />;
  }

  return (
    <Root>
      <Controller
        alt={alt}
        closeLabel="閉じる"
        dialogLabel={alt || '画像のズーム表示'}
        minImageSize={MIN_IMAGE_SIZE}
        src={src}
        style={style}
        triggerLabel={alt || '画像をズーム'}
        {...props}
      />
    </Root>
  );
}

const Root = styled.span`
  position: relative;
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
`;
