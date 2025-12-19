const isInvalidDate = (date: Date): boolean => {
  return Number.isNaN(date.getTime());
};

/** タイムゾーン付き日時のパターン（+HH:MMまたはZを含む） */
const TIMEZONE_PATTERN = /[+Z]/;

/** 日付のみのパターン（YYYY-MM-DD） */
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** 日付+時刻のパターン（YYYY-MM-DDTHH:mm:ss） */
const DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

const formatDateParts = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const convertDateToSimpleFormat = (date: Date): string => {
  if (isInvalidDate(date)) {
    return 'Invalid Date';
  }

  /**
   * @workaround パフォーマンスコストが高い場合があるため、toLocaleDateStringの使用を避けている
   * ```typescript
   * return date.toLocaleDateString('ja-JP', {
   *  year: 'numeric',
   *  month: '2-digit',
   *  day: '2-digit',
   * });
   * ```
   */
  return formatDateParts(date);
};

const isSameDateParts = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export const isSameDay = (dateA: Date, dateB: Date): boolean => {
  if (isInvalidDate(dateA) || isInvalidDate(dateB)) {
    return false;
  }

  /**
   * @workaround パフォーマンスコストが高い場合があるため、toLocaleDateStringの使用を避けている
   * ```typescript
   * return dateA.toLocaleDateString() === dateB.toLocaleDateString();
   * ```
   */
  return isSameDateParts(dateA, dateB);
};

/**
 * 日付文字列をISO 8601形式（タイムゾーン付き）に変換
 * @param dateString - 日付文字列（例: "2025-12-13" または "2025-12-13T10:30:00"）
 * @param timezone - タイムゾーンオフセット（デフォルト: "+09:00" JST）
 * @returns ISO 8601形式の日時文字列（例: "2025-12-13T00:00:00+09:00"）
 */
export const convertToISO8601WithTimezone = (dateString: string, timezone = '+09:00'): string => {
  // すでにタイムゾーン情報が含まれている場合はそのまま返す
  if (TIMEZONE_PATTERN.test(dateString)) {
    return dateString;
  }

  // 日付のみの場合（YYYY-MM-DD形式）は時刻を00:00:00として追加
  if (DATE_ONLY_PATTERN.test(dateString)) {
    return `${dateString}T00:00:00${timezone}`;
  }

  // 時刻付きの場合（YYYY-MM-DDTHH:mm:ss形式）はタイムゾーンのみ追加
  if (DATETIME_PATTERN.test(dateString)) {
    return `${dateString}${timezone}`;
  }

  // その他の形式の場合はDateオブジェクトを経由して変換
  const date = new Date(dateString);
  if (isInvalidDate(date)) {
    return dateString; // 無効な日付の場合は元の文字列を返す
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T00:00:00${timezone}`;
};
