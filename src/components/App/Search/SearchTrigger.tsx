'use client';

import { MagnifyingGlassIcon } from '@phosphor-icons/react';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';

import { SEARCH_LABELS } from './constants';
import { SEARCH_SHORTCUT_KEY } from './keyboard';
import { useSearchOpener } from './SearchProvider';

export function SearchTrigger() {
  const { open, prefetch } = useSearchOpener();

  return (
    <button
      aria-haspopup="dialog"
      aria-keyshortcuts={SEARCH_SHORTCUT_KEY}
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
