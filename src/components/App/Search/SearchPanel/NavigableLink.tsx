import { forwardRef } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/utils/url';
import { ICON_SIZE_XS } from '@/ui/icons';
import { Hashtag, MagnifyingGlass } from '@/ui/icons/index';
import { cx } from '@/ui/styled';
import type { MatchedIn } from '../types';
import { AnchorStyle, FocusedContainerStyle, LinkContainerStyle } from './styles';

type NavigableLinkProps = {
  slug: string;
  title: string;
  isFocused: boolean;
  matchedIn: MatchedIn;
  onLinkClick?: () => void;
};

export const NavigableLink = forwardRef<HTMLDivElement, NavigableLinkProps>(
  ({ slug, title, isFocused, matchedIn, onLinkClick }, ref) => {
    const link = convertPostSlugToPath(slug);

    return (
      <div
        className={cx(LinkContainerStyle, isFocused && FocusedContainerStyle)}
        ref={ref}
        tabIndex={isFocused ? 0 : -1}
      >
        <Anchor className={AnchorStyle} href={link} onClick={onLinkClick} prefetch={false}>
          {matchedIn === 'tag' ? (
            <Hashtag height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          ) : (
            <MagnifyingGlass height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          )}
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </Anchor>
      </div>
    );
  },
);

NavigableLink.displayName = 'NavigableLink';
