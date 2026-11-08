export const SEARCH_SHORTCUT_KEY = '/';

/** isComposing だけで判定しない。ブラウザによっては、変換の確定の前後で isComposing が false のまま届くため */
export function isImeComposing(event: Pick<KeyboardEvent, 'isComposing' | 'keyCode'>): boolean {
  return event.isComposing || event.keyCode === 229;
}
