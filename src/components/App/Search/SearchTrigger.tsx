'use client';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { SEARCH_LABELS } from '@/components/App/Search/constants';
import { SEARCH_ARIA_KEYSHORTCUTS } from '@/components/App/Search/keyboard';
import { useSearchOpener } from '@/components/App/Search/SearchProvider';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';

export function SearchTrigger() {
  const { open, prefetch } = useSearchOpener();

  return (
    <button
      aria-haspopup="dialog"
      aria-keyshortcuts={SEARCH_ARIA_KEYSHORTCUTS}
      aria-label={SEARCH_LABELS.searchTitle}
      className={stateLayerControl}
      onClick={open}
      onFocus={prefetch}
      onMouseEnter={prefetch}
      type="button"
    >
      <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
    </button>
  );
}
