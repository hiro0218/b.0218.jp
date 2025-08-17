/**
 * Escapeキーかどうかを判定
 */
export const isEscapeKey = (key: string): boolean => {
  return key === 'Escape' || key === 'Esc';
};

/**
 * アクティベーションキー（Enter/Space）かどうかを判定
 * WHY: モーダルやボタンの確認操作でEnter/Spaceキーの両方をサポートするため
 */
export const isActivationKey = (key: string): boolean => {
  return key === 'Enter' || key === ' ' || key === 'Space';
};

/**
 * 垂直矢印キーかどうかを判定
 */
export const isVerticalArrowKey = (key: string): boolean => {
  return key === 'ArrowUp' || key === 'ArrowDown';
};
