import type { RefObject } from 'react';

/**
 * 基本的なキーボードhookのオプション
 */
export interface BaseKeyboardOptions {
  /** キーボードハンドラーが有効かどうか */
  isEnabled?: boolean;
  /** 対象となるコンテナのref（スコープ制御用） */
  containerRef?: RefObject<HTMLElement>;
  /** グローバルハンドラーかどうか */
  isGlobal?: boolean;
  /** イベントキャプチャフェーズで処理するかどうか */
  useCapture?: boolean;
}
