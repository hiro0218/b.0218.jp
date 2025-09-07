import { forwardRef } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/url';
import { cx } from '@/ui/styled';
import { AnchorStyle, FocusedContainerStyle, LinkContainerStyle } from './Result';

type NavigableLinkProps = {
  slug: string;
  title: string;
  isFocused: boolean;
};

export const NavigableLink = forwardRef<HTMLDivElement, NavigableLinkProps>(({ slug, title, isFocused }, ref) => {
  const link = convertPostSlugToPath(slug);

  return (
    <div
      className={isFocused ? cx(LinkContainerStyle, FocusedContainerStyle) : LinkContainerStyle}
      ref={ref}
      tabIndex={isFocused ? 0 : -1}
    >
      <Anchor className={AnchorStyle} dangerouslySetInnerHTML={{ __html: title }} href={link} prefetch={false} />
    </div>
  );
});

NavigableLink.displayName = 'NavigableLink';
