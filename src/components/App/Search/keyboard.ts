export const SEARCH_SHORTCUT_KEY = '/';

/** aria-keyshortcuts の値。「/」に加えて、Cmd・Ctrl+K でも開く */
export const SEARCH_ARIA_KEYSHORTCUTS = '/ Meta+K Control+K';

export function isSearchShortcut(event: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey'>): boolean {
  return event.key === SEARCH_SHORTCUT_KEY || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k');
}

/** isComposing だけで判定しない。ブラウザによっては、変換の確定の前後で isComposing が false のまま届くため */
export function isImeComposing(event: Pick<KeyboardEvent, 'isComposing' | 'keyCode'>): boolean {
  return event.isComposing || event.keyCode === 229;
}
