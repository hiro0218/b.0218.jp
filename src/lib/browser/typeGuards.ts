/**
 * DOM要素の型ガード関数
 * React AriaやDOM APIで使用するEventTargetの型安全性を向上
 */

/**
 * EventTargetがHTMLElementかどうかを判定する型ガード
 *
 * @param target - 判定対象のEventTarget
 * @returns targetがHTMLElementの場合true
 *
 * @example
 * ```typescript
 * const { keyboardProps } = useKeyboard({
 *   onKeyDown: (e) => {
 *     if (!isHTMLElement(e.target)) return;
 *     // e.targetをHTMLElementとして安全に使用可能
 *     console.log(e.target.tagName);
 *   },
 * });
 * ```
 */
export function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

/**
 * EventTargetがHTMLInputElementかどうかを判定する型ガード
 *
 * @param target - 判定対象のEventTarget
 * @returns targetがHTMLInputElementの場合true
 *
 * @example
 * ```typescript
 * if (isInputElement(e.target)) {
 *   console.log(e.target.value);
 * }
 * ```
 */
export function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

/**
 * EventTargetがHTMLButtonElementかどうかを判定する型ガード
 *
 * @param target - 判定対象のEventTarget
 * @returns targetがHTMLButtonElementの場合true
 */
export function isButtonElement(target: EventTarget | null): target is HTMLButtonElement {
  return target instanceof HTMLButtonElement;
}

/**
 * EventTargetがHTMLAnchorElementかどうかを判定する型ガード
 *
 * @param target - 判定対象のEventTarget
 * @returns targetがHTMLAnchorElementの場合true
 */
export function isAnchorElement(target: EventTarget | null): target is HTMLAnchorElement {
  return target instanceof HTMLAnchorElement;
}
